
-- Create onboarding progress tracking table
CREATE TABLE public.onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL DEFAULT 8,
  completed_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  step_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user journey states table
CREATE TABLE public.user_journey_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  journey_type TEXT NOT NULL DEFAULT 'onboarding',
  current_state TEXT NOT NULL,
  state_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_interaction_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NULL,
  device_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user interactions log table
CREATE TABLE public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL,
  interaction_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  page_url TEXT NULL,
  session_id TEXT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marketing insights table
CREATE TABLE public.marketing_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL,
  insight_title TEXT NOT NULL,
  insight_description TEXT NOT NULL,
  actionable_steps JSONB DEFAULT '[]'::jsonb,
  priority_score INTEGER DEFAULT 5,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  data_sources JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for onboarding_progress
CREATE POLICY "Users can view their own onboarding progress" 
  ON public.onboarding_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding progress" 
  ON public.onboarding_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding progress" 
  ON public.onboarding_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_journey_states
CREATE POLICY "Users can view their own journey states" 
  ON public.user_journey_states 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey states" 
  ON public.user_journey_states 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journey states" 
  ON public.user_journey_states 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_interactions
CREATE POLICY "Users can view their own interactions" 
  ON public.user_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions" 
  ON public.user_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for marketing_insights
CREATE POLICY "Users can view insights for their clients" 
  ON public.marketing_insights 
  FOR SELECT 
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert insights for their clients" 
  ON public.marketing_insights 
  FOR INSERT 
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_onboarding_progress_updated_at 
    BEFORE UPDATE ON public.onboarding_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_journey_states_updated_at 
    BEFORE UPDATE ON public.user_journey_states 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_insights_updated_at 
    BEFORE UPDATE ON public.marketing_insights 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to initialize onboarding for new users
CREATE OR REPLACE FUNCTION initialize_user_onboarding()
RETURNS TRIGGER AS $$
DECLARE
    new_client_id UUID;
BEGIN
    -- Get the client ID for this user
    SELECT id INTO new_client_id
    FROM public.clients
    WHERE user_id = NEW.id
    LIMIT 1;

    -- Only proceed if we found a client
    IF new_client_id IS NOT NULL THEN
        -- Create onboarding progress
        INSERT INTO public.onboarding_progress (
            user_id,
            client_id,
            current_step,
            total_steps,
            completion_percentage
        ) VALUES (
            NEW.id,
            new_client_id,
            1,
            8,
            0
        );

        -- Create initial journey state
        INSERT INTO public.user_journey_states (
            user_id,
            client_id,
            journey_type,
            current_state,
            state_data
        ) VALUES (
            NEW.id,
            new_client_id,
            'onboarding',
            'welcome',
            '{"first_visit": true}'::jsonb
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing user setup trigger to include onboarding initialization
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.setup_user_with_onboarding()
RETURNS TRIGGER AS $$
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

  -- Initialize onboarding progress
  INSERT INTO onboarding_progress (
    user_id,
    client_id,
    current_step,
    total_steps,
    completion_percentage
  ) VALUES (
    NEW.id,
    new_client_id,
    1,
    8,
    0
  );

  -- Create initial journey state
  INSERT INTO user_journey_states (
    user_id,
    client_id,
    journey_type,
    current_state,
    state_data
  ) VALUES (
    NEW.id,
    new_client_id,
    'onboarding',
    'welcome',
    '{"first_visit": true}'::jsonb
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.setup_user_with_onboarding();
