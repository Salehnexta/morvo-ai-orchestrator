
-- Add first_time_setup_completed flag to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS first_time_setup_completed BOOLEAN DEFAULT FALSE;

-- Update existing users to have setup completed (so they don't get redirected)
UPDATE user_profiles 
SET first_time_setup_completed = TRUE 
WHERE first_time_setup_completed IS NULL OR first_time_setup_completed = FALSE;
