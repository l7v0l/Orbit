-- ==========================================
-- Orbit Multi-Media & Bookmarks Schema Update
-- Execute this script in the Supabase SQL Editor
-- ==========================================

-- 1. Add media_urls array and media_type to posts table
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';

-- 2. Create Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- Index for fast user bookmark queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);

-- Enable RLS for Bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Bookmarks
CREATE POLICY "Users can view their own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can add bookmarks" 
  ON public.bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete bookmarks" 
  ON public.bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- ==========================================
-- SUPABASE STORAGE BUCKET INSTRUCTIONS:
-- 1. Go to Supabase Dashboard -> Storage -> Buckets
-- 2. Click "New Bucket" and enter name: orbit_media
-- 3. Toggle "Public Bucket" to ON (so uploaded images/videos have public URLs).
-- ==========================================
