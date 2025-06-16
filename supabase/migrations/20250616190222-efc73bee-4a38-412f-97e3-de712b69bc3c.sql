
-- Fix the setup_free_account_for_user function by removing the email column insertion
-- which doesn't exist in the clients table
CREATE OR REPLACE FUNCTION public.setup_free_account_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_client_id uuid;
  free_plan_id uuid;
BEGIN
  -- Get the free plan ID
  SELECT id INTO free_plan_id
  FROM subscription_plans
  WHERE plan_code = 'free-plan'
  LIMIT 1;

  -- Create client record (removed email column since it doesn't exist)
  INSERT INTO clients (
    user_id,
    name,
    quota_limit,
    quota_used,
    active
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    20000,
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
    NOW() + INTERVAL '365 days', -- 1 year free trial
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
$$;
