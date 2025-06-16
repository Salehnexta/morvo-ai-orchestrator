
-- Add missing columns to customer_profiles table
ALTER TABLE public.customer_profiles 
ADD COLUMN IF NOT EXISTS company_size character varying,
ADD COLUMN IF NOT EXISTS marketing_goals jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS target_audience text,
ADD COLUMN IF NOT EXISTS monthly_marketing_budget character varying,
ADD COLUMN IF NOT EXISTS preferred_language character varying DEFAULT 'ar';

-- Update existing records to have default values for new columns
UPDATE public.customer_profiles 
SET 
  company_size = COALESCE(company_size, ''),
  marketing_goals = COALESCE(marketing_goals, '[]'::jsonb),
  target_audience = COALESCE(target_audience, ''),
  monthly_marketing_budget = COALESCE(monthly_marketing_budget, ''),
  preferred_language = COALESCE(preferred_language, 'ar')
WHERE 
  company_size IS NULL 
  OR marketing_goals IS NULL 
  OR target_audience IS NULL 
  OR monthly_marketing_budget IS NULL 
  OR preferred_language IS NULL;
