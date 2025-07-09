-- Chat support tables for Supabase
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  participants jsonb not null, -- array of user ids
  type text not null default 'customer-driver', -- or 'customer-support', 'escalated'
  status text not null default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  sender_id uuid references profiles(id),
  message text not null,
  created_at timestamp with time zone default now(),
  read_by jsonb default '[]', -- array of user ids
  attachments jsonb default null
);

-- Index for fast chat lookup
create index if not exists idx_chat_messages_chat_id on chat_messages(chat_id);
create index if not exists idx_chats_order_id on chats(order_id);
