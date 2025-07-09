-- Advanced Analytics: indexes and sample queries
-- Ensure orders table has lat/lng for pickup/dropoff, status, created_at, completed_at
create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_orders_completed_at on orders(completed_at);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_pickup_latlng on orders(pickup_location);
create index if not exists idx_orders_dropoff_latlng on orders(dropoff_location);

-- Churn: users who placed an order last month but not this month
-- Retention: users who placed orders in consecutive months
-- Delivery time stats: avg, median, by driver/region
-- Heatmap: aggregate order locations

-- Example: Delivery time stats
select driver_id, avg(extract(epoch from (completed_at - created_at))/60) as avg_delivery_minutes
from orders
where status = 'completed' and completed_at is not null
  and created_at >= date_trunc('month', now()) - interval '6 months'
group by driver_id;

-- Example: Order heatmap (pickup locations)
select round(cast(pickup_lat as numeric), 3) as lat, round(cast(pickup_lng as numeric), 3) as lng, count(*) as order_count
from orders
where created_at >= now() - interval '30 days'
group by lat, lng;