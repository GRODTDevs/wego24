
-- Phase 1: Critical Security Fixes - Database Level

-- 1. Add comprehensive RLS policies for unprotected tables
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage activity logs" ON public.activity_log
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active regions" ON public.regions
FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage regions" ON public.regions
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chats they participate in" ON public.chats
FOR SELECT USING (
  auth.uid()::text = ANY(
    SELECT jsonb_array_elements_text(participants)
  )
);

CREATE POLICY "Users can create chats they participate in" ON public.chats
FOR INSERT WITH CHECK (
  auth.uid()::text = ANY(
    SELECT jsonb_array_elements_text(participants)
  )
);

CREATE POLICY "Users can update chats they participate in" ON public.chats
FOR UPDATE USING (
  auth.uid()::text = ANY(
    SELECT jsonb_array_elements_text(participants)
  )
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their chats" ON public.chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE chats.id = chat_messages.chat_id 
    AND auth.uid()::text = ANY(
      SELECT jsonb_array_elements_text(participants)
    )
  )
);

CREATE POLICY "Users can send messages in their chats" ON public.chat_messages
FOR INSERT WITH CHECK (sender_id = auth.uid());

-- 2. Secure partner API keys with proper RLS
ALTER TABLE public.partner_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own API keys" ON public.partner_api_keys
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.partners 
    WHERE partners.id = partner_api_keys.partner_id 
    AND partners.user_id = auth.uid()
  )
);

CREATE POLICY "Partners can create their own API keys" ON public.partner_api_keys
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.partners 
    WHERE partners.id = partner_api_keys.partner_id 
    AND partners.user_id = auth.uid()
  )
);

CREATE POLICY "Partners can update their own API keys" ON public.partner_api_keys
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.partners 
    WHERE partners.id = partner_api_keys.partner_id 
    AND partners.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all API keys" ON public.partner_api_keys
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Secure system settings with admin-only access
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage system settings" ON public.system_settings
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Add audit logging table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.security_audit_log
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs" ON public.security_audit_log
FOR INSERT WITH CHECK (true);

-- 5. Create function for secure audit logging
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, resource_type, resource_id, details
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id, p_details
  );
END;
$$;
