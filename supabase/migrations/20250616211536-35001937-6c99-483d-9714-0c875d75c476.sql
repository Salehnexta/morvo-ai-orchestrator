
-- Phase 1: Fix database schema and existing data

-- 1. Update the default quota_limit for new clients from 1000 to 20000
ALTER TABLE clients ALTER COLUMN quota_limit SET DEFAULT 20000;

-- 2. Update existing clients with 1000 quota_limit to 20000 (free tier should have 20k)
UPDATE clients 
SET quota_limit = 20000 
WHERE quota_limit = 1000;

-- 3. Ensure the setup_free_account_for_user function creates clients with 20000 tokens
CREATE OR REPLACE FUNCTION public.setup_free_account_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_client_id uuid;
  free_plan_id uuid;
BEGIN
  -- Get the free plan ID
  SELECT id INTO free_plan_id
  FROM subscription_plans
  WHERE plan_code = 'free-plan'
  LIMIT 1;

  -- Create client record with 20000 tokens
  INSERT INTO clients (
    user_id,
    name,
    quota_limit,
    quota_used,
    active
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    20000,  -- Updated to 20000 tokens
    0,
    true
  ) RETURNING id INTO new_client_id;

  -- Create free subscription
  INSERT INTO user_subscriptions (
    client_id,
    plan_id,
    status,
    start_date,
    trial_end_date,
    auto_renew
  ) VALUES (
    new_client_id,
    free_plan_id,
    'active',
    NOW(),
    NOW() + INTERVAL '365 days',
    false
  );

  -- Create basic customer profile
  INSERT INTO customer_profiles (
    customer_id,
    preferred_language,
    status
  ) VALUES (
    NEW.id::text,
    'ar',
    'active'
  );

  RETURN NEW;
END;
$function$;

-- 4. Verify the data is correct
SELECT 
  'Database verification:' as check_type,
  COUNT(*) as total_clients,
  AVG(quota_limit) as avg_quota_limit,
  MIN(quota_limit) as min_quota_limit,
  MAX(quota_limit) as max_quota_limit
FROM clients;
