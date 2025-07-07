
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  stripe_price_id TEXT UNIQUE,
  features JSONB DEFAULT '[]'::jsonb,
  max_orders_per_month INTEGER,
  max_restaurants INTEGER,
  max_drivers INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_plan_id UUID REFERENCES public.subscription_plans(id),
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_status TEXT DEFAULT 'inactive', -- active, canceled, past_due, unpaid
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- orders, restaurants, drivers, api_calls
  count INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(subscriber_id, metric_type, period_start)
);

-- Create subscription events table for audit trail
CREATE TABLE public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- subscription_created, subscription_updated, payment_succeeded, payment_failed, etc.
  event_data JSONB,
  stripe_event_id TEXT,
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read, admin write)
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can insert their own subscription" ON public.subscribers
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" ON public.subscribers
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions" ON public.subscribers
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for usage_tracking
CREATE POLICY "Users can view their own usage" ON public.usage_tracking
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE subscribers.id = usage_tracking.subscriber_id 
    AND subscribers.user_id = auth.uid()
  )
);

CREATE POLICY "System can manage usage tracking" ON public.usage_tracking
FOR ALL USING (true); -- Allow system operations, will be handled by service role

CREATE POLICY "Admins can view all usage" ON public.usage_tracking
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for subscription_events
CREATE POLICY "Users can view their own subscription events" ON public.subscription_events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE subscribers.id = subscription_events.subscriber_id 
    AND subscribers.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert subscription events" ON public.subscription_events
FOR INSERT WITH CHECK (true); -- Allow system to log events

CREATE POLICY "Admins can view all subscription events" ON public.subscription_events
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, max_orders_per_month, max_restaurants, max_drivers, features) VALUES
('Starter', 'Perfect for small restaurants getting started', 15.00, 100, 1, 2, '["Basic dashboard", "Order management", "Customer support via email"]'::jsonb),
('Professional', 'Great for growing restaurants', 35.00, 500, 3, 10, '["Advanced analytics", "Multi-location support", "Priority support", "Custom branding"]'::jsonb),
('Enterprise', 'For large restaurant chains', 55.00, 2000, 10, 50, '["Unlimited features", "White-label solution", "Dedicated account manager", "Custom integrations", "24/7 phone support"]'::jsonb);

-- Function to get current subscription status
CREATE OR REPLACE FUNCTION public.get_subscription_status(user_id UUID)
RETURNS TABLE (
  subscribed BOOLEAN,
  plan_name TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.subscribed,
    sp.name as plan_name,
    s.subscription_status as status,
    s.current_period_end,
    s.cancel_at_period_end
  FROM public.subscribers s
  LEFT JOIN public.subscription_plans sp ON s.subscription_plan_id = sp.id
  WHERE s.user_id = get_subscription_status.user_id;
END;
$$;

-- Function to track usage
CREATE OR REPLACE FUNCTION public.track_usage(
  p_user_id UUID,
  p_metric_type TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_subscriber_id UUID;
  v_period_start TIMESTAMPTZ;
  v_period_end TIMESTAMPTZ;
BEGIN
  -- Get subscriber ID
  SELECT id INTO v_subscriber_id
  FROM public.subscribers
  WHERE user_id = p_user_id;
  
  IF v_subscriber_id IS NULL THEN
    RETURN; -- No subscription found
  END IF;
  
  -- Calculate current billing period
  v_period_start := date_trunc('month', NOW());
  v_period_end := v_period_start + INTERVAL '1 month';
  
  -- Insert or update usage tracking
  INSERT INTO public.usage_tracking (subscriber_id, metric_type, count, period_start, period_end)
  VALUES (v_subscriber_id, p_metric_type, p_increment, v_period_start, v_period_end)
  ON CONFLICT (subscriber_id, metric_type, period_start)
  DO UPDATE SET 
    count = usage_tracking.count + p_increment,
    updated_at = NOW();
END;
$$;
