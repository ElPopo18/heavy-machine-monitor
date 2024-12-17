-- Create a new storage bucket for operator photos
INSERT INTO storage.buckets (id, name)
VALUES ('operators-photos', 'operators-photos')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload operator photos"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'operators-photos'
);

-- Allow authenticated users to read operator photos
CREATE POLICY "Allow authenticated users to read operator photos"
ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'operators-photos'
);