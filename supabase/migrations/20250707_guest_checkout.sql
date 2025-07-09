-- Guest checkout support: add guest_user and guest_contact fields
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_user boolean DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_contact jsonb;
-- guest_contact example: {"email": "guest@example.com", "phone": "+34123456789"}

-- RLS Policies for orders table
CREATE POLICY "Guests can create guest orders" ON public.orders
  FOR INSERT WITH CHECK (guest_user = true);

CREATE POLICY "Guests can view their own guest orders" ON public.orders
  FOR SELECT USING (guest_user = true);

-- existing policies for registered users and admins...
