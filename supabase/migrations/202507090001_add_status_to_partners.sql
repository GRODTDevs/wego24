-- Add a status column to the partners table for admin approval
ALTER TABLE partners ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
