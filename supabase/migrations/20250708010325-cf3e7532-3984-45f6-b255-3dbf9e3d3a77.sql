
-- Fix RLS policies for partners table to allow demo data insertion
DROP POLICY IF EXISTS "Allow authenticated users to insert partners" ON public.partners;

CREATE POLICY "Users can manage their own partners" ON public.partners
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all partners" ON public.partners  
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure partner_applications has proper policies for demo data
CREATE POLICY "System can insert demo applications" ON public.partner_applications
FOR INSERT WITH CHECK (is_demo = true);

-- Add missing SELECT policy for partners
CREATE POLICY "Users can view their own partners" ON public.partners
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all partners" ON public.partners
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
