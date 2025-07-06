
-- Fix function search_path warnings by setting search_path to empty string for security

-- Update create_superuser function
CREATE OR REPLACE FUNCTION public.create_superuser(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find the user by email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF target_user_id IS NOT NULL THEN
        -- Insert admin role for this user
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END;
$function$;

-- Update handle_new_restaurant function
CREATE OR REPLACE FUNCTION public.handle_new_restaurant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Create default settings for the new restaurant
  INSERT INTO public.restaurant_settings (restaurant_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Update create_restaurant_from_application function
CREATE OR REPLACE FUNCTION public.create_restaurant_from_application(application_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  app_record public.partner_applications%ROWTYPE;
  new_restaurant_id uuid;
BEGIN
  -- Get the application record
  SELECT * INTO app_record FROM public.partner_applications WHERE id = application_id;
  
  IF app_record.status != 'approved' THEN
    RAISE EXCEPTION 'Application must be approved first';
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
  
  RETURN new_restaurant_id;
END;
$function$;
