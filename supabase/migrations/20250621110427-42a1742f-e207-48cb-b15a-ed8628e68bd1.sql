
-- Fix missing columns in agent_memory table
ALTER TABLE agent_memory ADD COLUMN IF NOT EXISTS conversation_id uuid;
ALTER TABLE agent_memory ADD COLUMN IF NOT EXISTS importance_score integer DEFAULT 5;

-- Fix missing columns in onboarding_journeys table  
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_current_sales text;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_customer_sources text;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_biggest_challenge text;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_years_in_business integer;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_industry text;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_company_size text;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_marketing_experience text;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_marketing_budget text;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS answer_primary_goal text;
ALTER TABLE onboarding_journeys ADD COLUMN IF NOT EXISTS is_completed boolean DEFAULT false;

-- Fix customer_profiles table structure
ALTER TABLE customer_profiles ADD COLUMN IF NOT EXISTS customer_id text;
ALTER TABLE customer_profiles ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'ar';
ALTER TABLE customer_profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Create missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_journeys_client_id ON onboarding_journeys(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_client_id ON agent_memory(client_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_customer_id ON customer_profiles(customer_id);

-- Fix RLS policies for proper access control
DROP POLICY IF EXISTS "Users can access their own client data" ON clients;
CREATE POLICY "Users can access their own client data" ON clients
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access their own conversations" ON conversations;
CREATE POLICY "Users can access their own conversations" ON conversations
  FOR ALL USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can access their own messages" ON messages;
CREATE POLICY "Users can access their own messages" ON messages
  FOR ALL USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Enable RLS on tables that need it
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_journeys ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for customer_profiles
DROP POLICY IF EXISTS "Users can manage their own profiles" ON customer_profiles;
CREATE POLICY "Users can manage their own profiles" ON customer_profiles
  FOR ALL USING (
    customer_id = auth.uid()::text OR
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Create RLS policy for onboarding_journeys
DROP POLICY IF EXISTS "Users can access their own onboarding" ON onboarding_journeys;
CREATE POLICY "Users can access their own onboarding" ON onboarding_journeys
  FOR ALL USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Fix any data type inconsistencies
ALTER TABLE clients ALTER COLUMN quota_limit SET DEFAULT 20000;
ALTER TABLE clients ALTER COLUMN quota_used SET DEFAULT 0;

-- Update the setup function to handle the new structure
CREATE OR REPLACE FUNCTION public.setup_user_with_onboarding()
RETURNS TRIGGER
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

  -- Create client record with 20000 tokens
  INSERT INTO clients (
    user_id,
    name,
    email,
    quota_limit,
    quota_used,
    active
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'مستخدم جديد'),
    NEW.email,
    20000,
    0,
    true
  ) RETURNING id INTO new_client_id;

  -- Create free subscription if plans exist
  IF free_plan_id IS NOT NULL THEN
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
  END IF;

  -- Create basic customer profile
  INSERT INTO customer_profiles (
    customer_id,
    client_id,
    preferred_language,
    status
  ) VALUES (
    NEW.id::text,
    new_client_id,
    'ar',
    'active'
  );

  -- Create initial conversation
  INSERT INTO conversations (
    client_id,
    title,
    status
  ) VALUES (
    new_client_id,
    'مرحباً بك في مورفو! 🚀',
    'active'
  );

  RETURN NEW;
END;
$$;
