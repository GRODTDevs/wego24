-- Live package tracking: driver location table
create table if not exists public.driver_locations (
  driver_id uuid references drivers(id),
  order_id uuid references orders(id),
  lat double precision not null,
  lng double precision not null,
  updated_at timestamp with time zone default now(),
  primary key (driver_id, order_id)
);

create index if not exists idx_driver_locations_order_id on driver_locations(order_id);
create index if not exists idx_driver_locations_driver_id on driver_locations(driver_id);
