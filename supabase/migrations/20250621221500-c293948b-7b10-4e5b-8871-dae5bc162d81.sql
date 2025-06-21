
-- First, let's consolidate all customer/client profile data into a single user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  company_name text,
  industry text,
  business_type text,
  company_size text,
  website_url text,
  
  -- Location & Contact
  address_location text,
  contact_information jsonb DEFAULT '{}'::jsonb,
  social_media_accounts jsonb DEFAULT '{}'::jsonb,
  
  -- Business Details
  company_overview text,
  core_offerings text,
  technical_products text,
  product_descriptions text,
  business_focus text,
  years_in_business integer,
  founded_year integer,
  monthly_revenue numeric,
  
  -- Marketing Information
  marketing_experience text,
  marketing_budget text,
  current_marketing_budget numeric,
  marketing_priority text,
  primary_goal text,
  biggest_challenge text,
  competitive_advantage text,
  current_marketing_tools jsonb DEFAULT '[]'::jsonb,
  primary_marketing_goals text[] DEFAULT '{}',
  current_marketing_channels jsonb DEFAULT '{}'::jsonb,
  
  -- Team & Operations
  team_size text,
  current_sales text,
  customer_sources text,
  target_region text,
  best_sales_season text,
  most_profitable_product text,
  
  -- Additional Data
  target_audience jsonb DEFAULT '{}'::jsonb,
  competitive_advantages text[] DEFAULT '{}',
  main_competitors text[] DEFAULT '{}',
  additional_insights text,
  blog_updates jsonb DEFAULT '[]'::jsonb,
  
  -- Preferences & Settings
  preferred_language text DEFAULT 'ar',
  communication_preferences jsonb DEFAULT '{}'::jsonb,
  personality_profile jsonb DEFAULT '{}'::jsonb,
  
  -- Metadata
  analysis_source text DEFAULT 'manual',
  data_completeness_score integer DEFAULT 0,
  completeness_score double precision DEFAULT 0.0,
  onboarding_completed boolean DEFAULT false,
  onboarding_completed_at timestamp with time zone,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Ensure one profile per user
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to access their own profiles
CREATE POLICY "Users can manage their own profiles" ON public.user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_industry ON public.user_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_size ON public.user_profiles(company_size);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

-- Migrate existing data from client_profiles to user_profiles
INSERT INTO public.user_profiles (
  user_id, company_name, industry, business_type, company_size, website_url,
  marketing_experience, marketing_budget, marketing_priority, primary_goal,
  biggest_challenge, competitive_advantage, team_size, current_sales,
  customer_sources, target_region, best_sales_season, most_profitable_product,
  years_in_business, current_marketing_tools, communication_preferences,
  personality_profile, data_completeness_score, completeness_score,
  created_at, updated_at
)
SELECT 
  c.user_id, cp.industry as company_name, cp.industry, c.business_type, cp.company_size, c.company_name as website_url,
  cp.marketing_experience, cp.marketing_budget, cp.marketing_priority, cp.primary_goal,
  cp.biggest_challenge, cp.competitive_advantage, cp.team_size, cp.current_sales,
  cp.customer_sources, cp.target_region, cp.best_sales_season, cp.most_profitable_product,
  cp.years_in_business, cp.current_marketing_tools, cp.communication_preferences,
  cp.personality_profile, 0, cp.completeness_score,
  cp.created_at, cp.updated_at
FROM public.client_profiles cp
JOIN public.clients c ON c.id = cp.client_id
WHERE c.user_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Migrate data from customer_profiles
INSERT INTO public.user_profiles (
  user_id, preferred_language, created_at, updated_at
)
SELECT 
  user_id, preferred_language, created_at, updated_at
FROM public.customer_profiles
WHERE user_id IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
  preferred_language = EXCLUDED.preferred_language;

-- Migrate data from business_profiles
INSERT INTO public.user_profiles (
  user_id, company_name, industry, business_type, company_size, website_url,
  address_location, founded_year, monthly_revenue, current_marketing_budget,
  target_audience, primary_marketing_goals, current_marketing_channels,
  competitive_advantages, main_competitors, onboarding_completed,
  onboarding_completed_at, created_at, updated_at
)
SELECT 
  c.user_id, bp.company_name, bp.industry, bp.business_type, bp.company_size, bp.website_url,
  bp.location, bp.founded_year, bp.monthly_revenue, bp.current_marketing_budget,
  bp.target_audience, bp.primary_marketing_goals, bp.current_marketing_channels,
  bp.competitive_advantages, bp.main_competitors, bp.onboarding_completed,
  bp.onboarding_completed_at, bp.created_at, bp.updated_at
FROM public.business_profiles bp
JOIN public.clients c ON c.id = bp.client_id
WHERE c.user_id IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
  company_name = COALESCE(EXCLUDED.company_name, user_profiles.company_name),
  industry = COALESCE(EXCLUDED.industry, user_profiles.industry),
  business_type = COALESCE(EXCLUDED.business_type, user_profiles.business_type),
  company_size = COALESCE(EXCLUDED.company_size, user_profiles.company_size),
  website_url = COALESCE(EXCLUDED.website_url, user_profiles.website_url),
  address_location = COALESCE(EXCLUDED.address_location, user_profiles.address_location),
  founded_year = COALESCE(EXCLUDED.founded_year, user_profiles.founded_year),
  monthly_revenue = COALESCE(EXCLUDED.monthly_revenue, user_profiles.monthly_revenue),
  current_marketing_budget = COALESCE(EXCLUDED.current_marketing_budget, user_profiles.current_marketing_budget),
  target_audience = COALESCE(EXCLUDED.target_audience, user_profiles.target_audience),
  primary_marketing_goals = COALESCE(EXCLUDED.primary_marketing_goals, user_profiles.primary_marketing_goals),
  current_marketing_channels = COALESCE(EXCLUDED.current_marketing_channels, user_profiles.current_marketing_channels),
  competitive_advantages = COALESCE(EXCLUDED.competitive_advantages, user_profiles.competitive_advantages),
  main_competitors = COALESCE(EXCLUDED.main_competitors, user_profiles.main_competitors),
  onboarding_completed = COALESCE(EXCLUDED.onboarding_completed, user_profiles.onboarding_completed),
  onboarding_completed_at = COALESCE(EXCLUDED.onboarding_completed_at, user_profiles.onboarding_completed_at);
