-- ==========================================
-- Orbit Super Admin & Verified Badges Schema Update
-- Execute this script in the Supabase SQL Editor
-- ==========================================

-- 1. Add role and is_verified columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false NOT NULL;

-- 2. Update RLS policies to give Admins full moderation privileges
CREATE POLICY "Admins can delete any post" 
  ON public.posts FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update any profile" 
  ON public.profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ==========================================
-- SQL QUERY TO PROMOTE YOUR ACCOUNT TO ADMIN:
-- Replace 'YOUR_USERNAME' or 'l7v0l' with your actual username in Orbit
-- ==========================================
-- UPDATE public.profiles 
-- SET role = 'admin', is_verified = true 
-- WHERE username = 'l7v0l';
