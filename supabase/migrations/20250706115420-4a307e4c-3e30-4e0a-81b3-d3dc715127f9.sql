-- Create partner applications table
CREATE TABLE public.partner_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  business_name text NOT NULL,
  business_type text NOT NULL,
  email text NOT NULL,
  phone text,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users,
  reviewed_at timestamp with time zone,
  rejection_reason text
);

-- Enable RLS on partner applications
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
ON public.partner_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can create applications"
ON public.partner_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON public.partner_applications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update restaurants table to link to partner applications
ALTER TABLE public.restaurants 
ADD COLUMN application_id uuid REFERENCES public.partner_applications(id);

-- Function to create restaurant from approved application
CREATE OR REPLACE FUNCTION public.create_restaurant_from_application(application_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  app_record public.partner_applications%ROWTYPE;
  new_restaurant_id uuid;
BEGIN
  -- Get the application record
  SELECT * INTO app_record FROM public.partner_applications WHERE id = application_id;

  -- Validate application status
  IF app_record.status != 'approved' THEN
    RAISE EXCEPTION 'Application must be approved first';
  END IF;

  -- Validate required fields
  IF app_record.business_name IS NULL OR app_record.business_name = '' THEN
    RAISE EXCEPTION 'Business name is required';
  END IF;
  IF app_record.email IS NULL OR app_record.email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  IF app_record.address IS NULL OR app_record.address = '' THEN
    RAISE EXCEPTION 'Address is required';
  END IF;

  -- Create restaurant
  INSERT INTO public.restaurants (
    name, email, phone, address, city, postal_code, description, 
    cuisine_type, status, application_id
  ) VALUES (
    app_record.business_name, app_record.email, app_record.phone, 
    app_record.address, app_record.city, app_record.postal_code, 
    app_record.description, app_record.business_type, 'pending', application_id
  ) RETURNING id INTO new_restaurant_id;

  -- Create restaurant user relationship
  INSERT INTO public.restaurant_users (restaurant_id, user_id, role)
  VALUES (new_restaurant_id, app_record.user_id, 'owner');

  -- Log restaurant creation
  PERFORM log_event('restaurant_created', 'restaurants', new_restaurant_id, 'Restaurant created from application');

  RETURN new_restaurant_id;
END;
$$;
