
-- Add company_size column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN company_size text;
