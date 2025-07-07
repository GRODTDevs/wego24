
-- Create helper function to fetch user notifications
CREATE OR REPLACE FUNCTION public.fetch_user_notifications(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  order_id UUID,
  type TEXT,
  title TEXT,
  message TEXT,
  is_read BOOLEAN,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_method TEXT[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    n.id,
    n.user_id,
    n.order_id,
    n.type,
    n.title,
    n.message,
    n.is_read,
    n.sent_at,
    n.delivery_method
  FROM public.notifications n
  WHERE n.user_id = user_uuid
  ORDER BY n.sent_at DESC
  LIMIT 50;
$$;
