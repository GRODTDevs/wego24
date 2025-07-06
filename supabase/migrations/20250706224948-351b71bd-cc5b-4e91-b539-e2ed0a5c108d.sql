
-- Remove the is_admin column we just added and replace with roles JSON array
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;
ALTER TABLE public.profiles ADD COLUMN roles jsonb NOT NULL DEFAULT '["user"]'::jsonb;

-- Update existing users based on current user_roles table
-- First set everyone to default user role
UPDATE public.profiles SET roles = '["user"]'::jsonb;

-- Then add admin role to existing admin users
UPDATE public.profiles 
SET roles = '["user", "admin"]'::jsonb
WHERE id IN (
  SELECT user_id 
  FROM public.user_roles 
  WHERE role = 'admin'
);

-- Update the create_superuser function to work with JSON roles
CREATE OR REPLACE FUNCTION public.create_superuser(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    target_user_id UUID;
    current_roles jsonb;
BEGIN
    -- Get current roles for the user
    SELECT roles INTO current_roles
    FROM public.profiles
    WHERE email = user_email;
    
    -- If user doesn't exist, raise exception
    IF current_roles IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Add admin role if not already present
    IF NOT (current_roles ? 'admin') THEN
        UPDATE public.profiles
        SET roles = current_roles || '["admin"]'::jsonb
        WHERE email = user_email
        RETURNING id INTO target_user_id;
    END IF;
END;
$function$;

-- Update the has_role function to work with JSON roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT COALESCE(
    (SELECT roles ? _role::text FROM public.profiles WHERE id = _user_id),
    false
  )
$function$;

-- Create a helper function to add roles to users
CREATE OR REPLACE FUNCTION public.add_user_role(_user_id uuid, _role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    current_roles jsonb;
BEGIN
    -- Get current roles
    SELECT roles INTO current_roles
    FROM public.profiles
    WHERE id = _user_id;
    
    -- Add role if not already present
    IF current_roles IS NOT NULL AND NOT (current_roles ? _role) THEN
        UPDATE public.profiles
        SET roles = current_roles || jsonb_build_array(_role)
        WHERE id = _user_id;
    END IF;
END;
$function$;

-- Create a helper function to remove roles from users
CREATE OR REPLACE FUNCTION public.remove_user_role(_user_id uuid, _role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    current_roles jsonb;
    new_roles jsonb;
BEGIN
    -- Get current roles
    SELECT roles INTO current_roles
    FROM public.profiles
    WHERE id = _user_id;
    
    -- Remove role if present
    IF current_roles IS NOT NULL AND (current_roles ? _role) THEN
        SELECT jsonb_agg(role) INTO new_roles
        FROM jsonb_array_elements_text(current_roles) AS role
        WHERE role != _role;
        
        -- Ensure user always has at least 'user' role
        IF new_roles IS NULL OR jsonb_array_length(new_roles) = 0 THEN
            new_roles = '["user"]'::jsonb;
        END IF;
        
        UPDATE public.profiles
        SET roles = new_roles
        WHERE id = _user_id;
    END IF;
END;
$function$;
