-- ==========================================
-- Auto-Confirm Emails Query for Supabase Auth
-- Execute this in Supabase SQL Editor
-- ==========================================

-- 1. Confirm the Admin email immediately
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'admin@orbit.com';

-- 2. Confirm any registered user email automatically
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
