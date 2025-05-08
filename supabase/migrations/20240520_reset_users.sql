-- Reset users table
-- This migration removes all existing users to start fresh with new registration flow
-- Date: 2024-05-20

-- Delete all users from the users table
DELETE FROM auth.users;

-- Delete all related records from the public.users table
DELETE FROM public.users;

-- Reset identity sequences if needed
ALTER SEQUENCE IF EXISTS public.users_id_seq RESTART WITH 1; 