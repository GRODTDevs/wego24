
-- Add image storage bucket for menu items
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create storage policies for menu images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

CREATE POLICY "Authenticated users can upload menu images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their menu images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their menu images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-images' 
  AND auth.role() = 'authenticated'
);

-- Add bulk operations support with better indexing
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_status ON menu_items(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id, is_active);

-- Add category display order management
ALTER TABLE menu_categories 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add menu item variants support (for sizes, options, etc.)
CREATE TABLE IF NOT EXISTS menu_item_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_modifier NUMERIC DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on variants
ALTER TABLE menu_item_variants ENABLE ROW LEVEL SECURITY;

-- Variants policies
CREATE POLICY "Restaurant users can manage their menu item variants"
ON menu_item_variants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM menu_items mi
    JOIN restaurant_users ru ON ru.restaurant_id = mi.restaurant_id
    WHERE mi.id = menu_item_variants.menu_item_id
    AND ru.user_id = auth.uid()
    AND ru.is_active = true
  )
);

CREATE POLICY "Admins can manage all menu item variants"
ON menu_item_variants FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
