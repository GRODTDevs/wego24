-- Add user_id column to restaurants table if not present
alter table restaurants add column if not exists user_id uuid references profiles(id);
