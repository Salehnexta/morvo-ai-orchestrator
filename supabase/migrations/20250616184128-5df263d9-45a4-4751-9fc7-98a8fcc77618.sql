
-- Create a default free plan if it doesn't exist
INSERT INTO subscription_plans (
  plan_name,
  plan_code,
  description,
  price_monthly,
  price_yearly,
  currency,
  features,
  limits,
  is_active,
  popular
) 
VALUES (
  'Free Account',
  'free-plan',
  'Get started with 20,000 free tokens and access to all AI agents',
  0,
  0,
  'SAR',
  '{"agents": ["all"], "chat_access": true, "dashboard_access": true, "support": "basic"}',
  '{"chat_tokens": 20000, "monthly_requests": 1000}',
  true,
  true
)
ON CONFLICT (plan_code) DO UPDATE SET
  limits = EXCLUDED.limits,
  features = EXCLUDED.features,
  description = EXCLUDED.description;

-- Create function to automatically set up free account for new users
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

  -- Create client record
  INSERT INTO clients (
    user_id,
    name,
    email,
    quota_limit,
    quota_used,
    active
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
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

-- Create trigger to automatically set up free account when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_setup_free_account ON auth.users;
CREATE TRIGGER on_auth_user_created_setup_free_account
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.setup_free_account_for_user();
