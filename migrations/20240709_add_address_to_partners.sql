-- Add address column to partners table if it does not exist
ALTER TABLE partners ADD COLUMN IF NOT EXISTS address text;