-- ==========================================
-- SETUP IMAGE SUPPORT (DATABASE + STORAGE)
-- ==========================================

-- 1. Add image_url column to questions
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Create Storage Bucket for images
-- We create it if it doesn't exist. This usually requires postgres permissions.
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage RLS Policies
-- Allow anyone to read images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'question-images');

-- Allow anyone to upload images (since we have a secret admin dashboard)
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'question-images');
