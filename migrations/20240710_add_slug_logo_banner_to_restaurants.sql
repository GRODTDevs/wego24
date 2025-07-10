-- Add slug, logo, and banner fields to restaurants table
alter table restaurant_settings add column if not exists slug text unique;
alter table restaurant_settings add column if not exists logo_url text;
alter table restaurant_settings add column if not exists banner_url text;
