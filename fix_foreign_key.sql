-- Fix foreign key relationship between learning_logs and profiles
-- This allows PostgREST joins to work properly

-- First drop the existing foreign key constraint
ALTER TABLE learning_logs DROP CONSTRAINT IF EXISTS learning_logs_user_id_fkey;

-- Add new foreign key constraint to profiles table
ALTER TABLE learning_logs ADD CONSTRAINT learning_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
