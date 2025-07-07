
-- Add additional columns to drivers table for enhanced profile management
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS postal_code text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS emergency_contact_name text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS emergency_contact_phone text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_expiry_date date;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS insurance_expiry_date date;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS background_check_status text DEFAULT 'pending';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS registration_status text DEFAULT 'pending';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS approved_by uuid;

-- Create driver documents table for file management
CREATE TABLE IF NOT EXISTS driver_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  document_url text NOT NULL,
  document_name text NOT NULL,
  file_size integer,
  uploaded_at timestamp with time zone DEFAULT now(),
  verified_at timestamp with time zone,
  verified_by uuid,
  status text DEFAULT 'pending' -- pending, approved, rejected
);

-- Create driver locations table for real-time tracking
CREATE TABLE IF NOT EXISTS driver_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  accuracy numeric,
  heading numeric,
  speed numeric,
  timestamp timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create driver performance metrics table
CREATE TABLE IF NOT EXISTS driver_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE NOT NULL,
  metric_date date NOT NULL,
  total_deliveries integer DEFAULT 0,
  successful_deliveries integer DEFAULT 0,
  cancelled_deliveries integer DEFAULT 0,
  average_delivery_time interval,
  total_earnings numeric DEFAULT 0,
  customer_rating_average numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  on_time_percentage numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(driver_id, metric_date)
);

-- Enable RLS on new tables
ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_performance ENABLE ROW LEVEL SECURITY;

-- RLS policies for driver_documents
CREATE POLICY "Drivers can view their own documents" 
  ON driver_documents FOR SELECT 
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Drivers can insert their own documents" 
  ON driver_documents FOR INSERT 
  WITH CHECK (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all driver documents" 
  ON driver_documents FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for driver_locations
CREATE POLICY "Drivers can insert their own location data" 
  ON driver_locations FOR INSERT 
  WITH CHECK (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Drivers can view their own location data" 
  ON driver_locations FOR SELECT 
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all location data" 
  ON driver_locations FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for driver_performance
CREATE POLICY "Drivers can view their own performance data" 
  ON driver_performance FOR SELECT 
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all performance data" 
  ON driver_performance FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_driver_documents_driver_id ON driver_documents(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_timestamp ON driver_locations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_driver_performance_driver_id ON driver_performance(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_performance_date ON driver_performance(metric_date DESC);

-- Add storage bucket for driver documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('driver-documents', 'driver-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for driver documents
CREATE POLICY "Drivers can upload their own documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'driver-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Drivers can view their own documents" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'driver-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage all driver documents" 
  ON storage.objects FOR ALL 
  USING (bucket_id = 'driver-documents' AND has_role(auth.uid(), 'admin'::app_role));
