
-- Create a table to store historical business metrics for percentage calculations
CREATE TABLE public.business_metrics_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  active_partners INTEGER NOT NULL DEFAULT 0,
  active_drivers INTEGER NOT NULL DEFAULT 0,
  total_users INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(metric_date)
);

-- Enable RLS
ALTER TABLE public.business_metrics_history ENABLE ROW LEVEL SECURITY;

-- Only admins can manage historical metrics
CREATE POLICY "Admins can manage business metrics history"
ON public.business_metrics_history
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to capture daily metrics (can be called by a cron job or manually)
CREATE OR REPLACE FUNCTION public.capture_daily_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  orders_count INTEGER;
  revenue_amount NUMERIC;
  partners_count INTEGER;
  drivers_count INTEGER;
  users_count INTEGER;
BEGIN
  -- Get current metrics
  SELECT COUNT(*) INTO orders_count FROM public.orders;
  
  SELECT COALESCE(SUM(total_amount), 0) INTO revenue_amount 
  FROM public.orders 
  WHERE payment_status = 'completed';
  
  SELECT COUNT(*) INTO partners_count 
  FROM public.restaurants 
  WHERE status = 'active';
  
  SELECT COUNT(*) INTO drivers_count 
  FROM public.drivers 
  WHERE is_active = true;
  
  SELECT COUNT(*) INTO users_count 
  FROM public.profiles;
  
  -- Insert or update today's metrics
  INSERT INTO public.business_metrics_history (
    metric_date, total_orders, total_revenue, active_partners, active_drivers, total_users
  ) VALUES (
    today_date, orders_count, revenue_amount, partners_count, drivers_count, users_count
  )
  ON CONFLICT (metric_date) 
  DO UPDATE SET
    total_orders = EXCLUDED.total_orders,
    total_revenue = EXCLUDED.total_revenue,
    active_partners = EXCLUDED.active_partners,
    active_drivers = EXCLUDED.active_drivers,
    total_users = EXCLUDED.total_users,
    created_at = now();
END;
$$;
