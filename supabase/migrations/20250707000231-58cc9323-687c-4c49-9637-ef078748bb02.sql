
-- Create orders table with enhanced tracking
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL DEFAULT ('ORD-' || EXTRACT(epoch FROM now())::text),
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  business_id UUID REFERENCES public.restaurants(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  service_fee DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address JSONB,
  delivery_instructions TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order status history for tracking
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  type TEXT NOT NULL CHECK (type IN ('order_status', 'driver_assignment', 'payment', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  delivery_method TEXT[] DEFAULT ARRAY['app'] CHECK (delivery_method <@ ARRAY['app', 'sms', 'email'])
);

-- Create driver locations table for real-time tracking
CREATE TABLE IF NOT EXISTS public.driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.drivers(id) NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders table
CREATE POLICY "Customers can view their own orders" ON public.orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Restaurant users can view their business orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurant_users 
      WHERE restaurant_id = orders.business_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Restaurant users can update their business orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.restaurant_users 
      WHERE restaurant_id = orders.business_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Drivers can view assigned orders" ON public.orders
  FOR SELECT USING (driver_id = auth.uid());

CREATE POLICY "Drivers can update assigned orders" ON public.orders
  FOR UPDATE USING (driver_id = auth.uid());

CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for order_status_history
CREATE POLICY "Users can view order status history for their orders" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_status_history.order_id 
      AND (orders.customer_id = auth.uid() OR orders.driver_id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.restaurant_users ru ON ru.restaurant_id = o.business_id
      WHERE o.id = order_status_history.order_id 
      AND ru.user_id = auth.uid() 
      AND ru.is_active = true
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for driver_locations
CREATE POLICY "Drivers can manage their own locations" ON public.driver_locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.drivers 
      WHERE drivers.id = driver_locations.driver_id 
      AND drivers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view driver locations for their orders" ON public.driver_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = driver_locations.order_id 
      AND (orders.customer_id = auth.uid() OR orders.driver_id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.restaurant_users ru ON ru.restaurant_id = o.business_id
      WHERE o.id = driver_locations.order_id 
      AND ru.user_id = auth.uid() 
      AND ru.is_active = true
    )
  );

-- Function to automatically create order status history
CREATE OR REPLACE FUNCTION public.create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create history entry if status actually changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) OR TG_OP = 'INSERT' THEN
    INSERT INTO public.order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for order status history
CREATE TRIGGER order_status_history_trigger
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.create_order_status_history();

-- Function to update order timestamps
CREATE OR REPLACE FUNCTION public.update_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_order_timestamp_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_order_timestamp();

-- Enable realtime for live updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_status_history REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.driver_locations REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_locations;
