-- ==========================================
-- Orbit Microblogging Platform - Database Schema
-- Execute this script in the Supabase SQL Editor
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS / PROFILES TABLE
-- Linked to Supabase Auth users (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. FOLLOWERS TABLE
CREATE TABLE IF NOT EXISTS public.followers (
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT prevent_self_follow CHECK (follower_id <> following_id)
);

-- 4. LIKES TABLE
CREATE TABLE IF NOT EXISTS public.likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- INDEXES FOR FAST QUERIES
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_followers_following ON public.followers(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_post ON public.likes(post_id);

-- TRIGGER & FUNCTION FOR AUTOMATIC PROFILE CREATION ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::text FROM 1 FOR 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Orbit User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- POLICIES: PROFILES
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POLICIES: POSTS
CREATE POLICY "Posts are viewable by everyone" 
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" 
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- POLICIES: FOLLOWERS
CREATE POLICY "Followers are viewable by everyone" 
  ON public.followers FOR SELECT USING (true);

CREATE POLICY "Authenticated users can follow" 
  ON public.followers FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Authenticated users can unfollow" 
  ON public.followers FOR DELETE USING (auth.uid() = follower_id);

-- POLICIES: LIKES
CREATE POLICY "Likes are viewable by everyone" 
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" 
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can unlike" 
  ON public.likes FOR DELETE USING (auth.uid() = user_id);
