-- Multi-region support: regions table and region_id fields
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  settings jsonb default '{}',
  active boolean default true,
  created_at timestamp with time zone default now()
);

alter table if exists public.profiles add column if not exists region_id uuid references regions(id);
alter table if exists public.drivers add column if not exists region_id uuid references regions(id);
alter table if exists public.partners add column if not exists region_id uuid references regions(id);
alter table if exists public.orders add column if not exists region_id uuid references regions(id);

-- Indexes for region queries
create index if not exists idx_profiles_region_id on profiles(region_id);
create index if not exists idx_drivers_region_id on drivers(region_id);
create index if not exists idx_partners_region_id on partners(region_id);
create index if not exists idx_orders_region_id on orders(region_id);
