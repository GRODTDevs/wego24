-- Partner API keys for secure API access
create table if not exists public.partner_api_keys (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id),
  api_key text not null unique,
  active boolean default true,
  created_at timestamp with time zone default now()
);

create index if not exists idx_partner_api_keys_partner_id on partner_api_keys(partner_id);
create index if not exists idx_partner_api_keys_api_key on partner_api_keys(api_key);
