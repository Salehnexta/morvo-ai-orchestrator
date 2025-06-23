
-- Add missing columns to user_profiles table for better profile tracking
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS profile_setup_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_setup_completed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS seo_analysis_triggered boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_analysis_completed_at timestamp with time zone;

-- Create an index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_setup_completed ON user_profiles(profile_setup_completed);

-- Update existing profiles to mark them as completed if they have essential data
UPDATE user_profiles 
SET profile_setup_completed = true,
    profile_setup_completed_at = COALESCE(updated_at, created_at)
WHERE company_name IS NOT NULL 
  AND industry IS NOT NULL 
  AND marketing_experience IS NOT NULL
  AND profile_setup_completed = false;

-- Create a function to automatically trigger SEO analysis after profile completion
CREATE OR REPLACE FUNCTION trigger_seo_analysis_after_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- If profile was just marked as completed and has a website URL
  IF NEW.profile_setup_completed = true 
     AND OLD.profile_setup_completed = false 
     AND NEW.website_url IS NOT NULL 
     AND NEW.website_url != '' 
     AND NEW.seo_analysis_triggered = false THEN
    
    -- Mark that SEO analysis should be triggered
    NEW.seo_analysis_triggered = true;
    
    -- Log the trigger event (you can remove this in production)
    RAISE NOTICE 'SEO analysis triggered for user % with website %', NEW.user_id, NEW.website_url;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_seo_analysis ON user_profiles;
CREATE TRIGGER trigger_seo_analysis
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_seo_analysis_after_profile_completion();

-- Ensure seo_data table has proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_seo_data_user_id ON seo_data(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_data_website_url ON seo_data(website_url);
CREATE INDEX IF NOT EXISTS idx_seo_data_collected_at ON seo_data(collected_at DESC);
