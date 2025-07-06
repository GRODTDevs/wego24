
-- Create orders table for order processing system
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  service_fee DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  delivery_address JSONB,
  delivery_instructions TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'motorcycle', 'bicycle', 'scooter')),
  vehicle_info JSONB,
  license_number TEXT,
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT false,
  current_location JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_type TEXT NOT NULL CHECK (review_type IN ('business', 'driver', 'order')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own orders" ON public.orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Business users can view their business orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users 
      WHERE restaurant_users.restaurant_id = orders.business_id 
      AND restaurant_users.user_id = auth.uid() 
      AND restaurant_users.is_active = true
    )
  );

CREATE POLICY "Drivers can view assigned orders" ON public.orders
  FOR SELECT USING (driver_id = auth.uid());

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Business users can update their orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users 
      WHERE restaurant_users.restaurant_id = orders.business_id 
      AND restaurant_users.user_id = auth.uid() 
      AND restaurant_users.is_active = true
    )
  );

CREATE POLICY "Drivers can update assigned orders" ON public.orders
  FOR UPDATE USING (driver_id = auth.uid());

CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.customer_id = auth.uid() OR orders.driver_id = auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurant_users ON restaurant_users.restaurant_id = orders.business_id
      WHERE orders.id = order_items.order_id 
      AND restaurant_users.user_id = auth.uid() 
      AND restaurant_users.is_active = true
    )
  );

CREATE POLICY "Customers can create order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Add RLS policies for drivers
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view and update their own profile" ON public.drivers
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Business users can view drivers" ON public.drivers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all drivers" ON public.drivers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reviews for businesses" ON public.reviews
  FOR SELECT USING (review_type = 'business');

CREATE POLICY "Customers can create reviews for their orders" ON public.reviews
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can view their own reviews" ON public.reviews
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Business users can view their business reviews" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users 
      WHERE restaurant_users.restaurant_id = reviews.business_id 
      AND restaurant_users.user_id = auth.uid() 
      AND restaurant_users.is_active = true
    )
  );

-- Add RLS policies for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payments for their orders" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Business users can view payments for their orders" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurant_users ON restaurant_users.restaurant_id = orders.business_id
      WHERE orders.id = payments.order_id 
      AND restaurant_users.user_id = auth.uid() 
      AND restaurant_users.is_active = true
    )
  );

-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create indexes for better performance
CREATE INDEX idx_orders_business_id ON public.orders(business_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_driver_id ON public.orders(driver_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX idx_drivers_user_id ON public.drivers(user_id);
