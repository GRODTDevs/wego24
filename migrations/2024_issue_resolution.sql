-- Automated Issue Resolution: order_issues and logs
create table if not exists public.order_issues (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  type text not null, -- e.g. 'late', 'failed', 'complaint'
  status text not null default 'open',
  detected_at timestamp with time zone default now(),
  resolved_at timestamp with time zone,
  resolution text,
  escalated boolean default false,
  notes text
);

create table if not exists public.issue_resolution_logs (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references order_issues(id),
  action text not null, -- e.g. 'refund', 'reassign', 'escalate', 'manual-override'
  performed_by uuid references profiles(id),
  performed_at timestamp with time zone default now(),
  details jsonb
);

create index if not exists idx_order_issues_order_id on order_issues(order_id);
create index if not exists idx_issue_resolution_logs_issue_id on issue_resolution_logs(issue_id);
