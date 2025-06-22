
-- ========================================
-- PHASE 1: CLEAN SLATE - DELETE ALL PUBLIC TABLES
-- ========================================

-- Drop all existing tables in public schema (keeping auth schema intact)
DROP TABLE IF EXISTS public.a2a_messages CASCADE;
DROP TABLE IF EXISTS public.ad_performance_data CASCADE;
DROP TABLE IF EXISTS public.admin_dashboard_stats CASCADE;
DROP TABLE IF EXISTS public.agent_activity_log CASCADE;
DROP TABLE IF EXISTS public.agent_memories CASCADE;
DROP TABLE IF EXISTS public.agent_memory CASCADE;
DROP TABLE IF EXISTS public.agent_metrics CASCADE;
DROP TABLE IF EXISTS public.agent_performance CASCADE;
DROP TABLE IF EXISTS public.agent_results CASCADE;
DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.ai_insights CASCADE;
DROP TABLE IF EXISTS public.ai_model_usage CASCADE;
DROP TABLE IF EXISTS public.analytics_data CASCADE;
DROP TABLE IF EXISTS public.api_usage CASCADE;
DROP TABLE IF EXISTS public.billing_history CASCADE;
DROP TABLE IF EXISTS public.brand24_data CASCADE;
DROP TABLE IF EXISTS public.business_impact CASCADE;
DROP TABLE IF EXISTS public.business_insights CASCADE;
DROP TABLE IF EXISTS public.business_profiles CASCADE;
DROP TABLE IF EXISTS public.chart_data CASCADE;
DROP TABLE IF EXISTS public.client_context CASCADE;
DROP TABLE IF EXISTS public.client_experience CASCADE;
DROP TABLE IF EXISTS public.client_profiles CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.competitive_intelligence CASCADE;
DROP TABLE IF EXISTS public.content_sources_data CASCADE;
DROP TABLE IF EXISTS public.content_strategies CASCADE;
DROP TABLE IF EXISTS public.conversation_messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.cross_agent_context CASCADE;
DROP TABLE IF EXISTS public.cultural_calendar CASCADE;
DROP TABLE IF EXISTS public.cultural_contexts CASCADE;
DROP TABLE IF EXISTS public.customer_profiles CASCADE;
DROP TABLE IF EXISTS public.dashboard_contexts CASCADE;
DROP TABLE IF EXISTS public.email_performance_data CASCADE;
DROP TABLE IF EXISTS public.embeddings CASCADE;
DROP TABLE IF EXISTS public.emotional_contexts CASCADE;
DROP TABLE IF EXISTS public.emotional_journey CASCADE;
DROP TABLE IF EXISTS public.emotional_milestones CASCADE;
DROP TABLE IF EXISTS public.external_api_configs CASCADE;
DROP TABLE IF EXISTS public.external_api_data CASCADE;
DROP TABLE IF EXISTS public.feature_usage CASCADE;
DROP TABLE IF EXISTS public.generated_content CASCADE;
DROP TABLE IF EXISTS public.integrated_analytics CASCADE;
DROP TABLE IF EXISTS public.journey_phase_transitions CASCADE;
DROP TABLE IF EXISTS public.marketing_insights CASCADE;
DROP TABLE IF EXISTS public.marketing_preferences CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.onboarding_journeys CASCADE;
DROP TABLE IF EXISTS public.onboarding_progress CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.user_interactions CASCADE;
DROP TABLE IF EXISTS public.user_journey_states CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;

-- Drop all existing functions that might reference deleted tables
DROP FUNCTION IF EXISTS public.setup_free_account_for_user() CASCADE;
DROP FUNCTION IF EXISTS public.setup_user_with_onboarding() CASCADE;
DROP FUNCTION IF EXISTS public.initialize_user_onboarding() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing types
DROP TYPE IF EXISTS public.app_role CASCADE;

-- ========================================
-- PHASE 2: CREATE CLEAN CORE SYSTEM
-- ========================================

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'premium');

-- ========================================
-- 1. USER_PROFILES - Single Source of Truth
-- ========================================
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Personal Information (USER INPUT ONLY)
  full_name text,
  greeting_preference text DEFAULT 'أستاذ',
  preferred_language text DEFAULT 'ar',
  
  -- Business Identity (USER INPUT ONLY)
  company_name text,
  business_type text,
  industry text,
  
  -- Marketing Profile (USER INPUT ONLY)
  marketing_experience text,
  primary_marketing_goals text[] DEFAULT '{}',
  monthly_marketing_budget text,
  
  -- Target Audience (USER INPUT ONLY)
  target_audience jsonb DEFAULT '{
    "age_range": "",
    "gender": "",
    "interests": []
  }',
  
  -- Business Insights (USER INPUT ONLY)
  unique_selling_points text[] DEFAULT '{}',
  biggest_marketing_challenge text,
  seasonal_peaks text[] DEFAULT '{}',
  revenue_target text,
  expansion_plans text[] DEFAULT '{}',
  current_monthly_revenue text,
  average_order_value numeric,
  customer_acquisition_cost numeric,
  
  -- Website & Company Info (PERPLEXITY OR USER INPUT)
  website_url text,
  company_overview text,
  products_services jsonb DEFAULT '{
    "categories": [],
    "top_products": [],
    "price_range": ""
  }',
  key_team_members jsonb DEFAULT '[]',
  contact_info jsonb DEFAULT '{
    "email": "",
    "phone": "",
    "address": "",
    "social_media": {
      "instagram": "",
      "twitter": "",
      "linkedin": ""
    }
  }',
  business_model text,
  target_market text,
  recent_news text[] DEFAULT '{}',
  case_studies text[] DEFAULT '{}',
  service_areas text[] DEFAULT '{}',
  branch_locations text[] DEFAULT '{}',
  
  -- SE RANKING DATA (AUTOMATED ONLY)
  seo_data jsonb DEFAULT '{
    "domain_analysis": {
      "domain_authority": 0,
      "trust_score": 0,
      "domain_age": "",
      "alexa_rank": 0
    },
    "organic_metrics": {
      "total_keywords": 0,
      "top_10_keywords": 0,
      "organic_traffic": 0,
      "traffic_value": 0,
      "visibility_score": 0
    },
    "keyword_analysis": {
      "branded_keywords": [],
      "non_branded_keywords": [],
      "keyword_gaps": [],
      "trending_keywords": []
    },
    "competitors": [],
    "backlink_metrics": {
      "total_backlinks": 0,
      "referring_domains": 0,
      "dofollow_ratio": 0,
      "anchor_text_distribution": {}
    },
    "technical_audit": {
      "page_speed_score": 0,
      "mobile_friendly": false,
      "ssl_certificate": false,
      "sitemap_status": ""
    },
    "serp_features": {
      "featured_snippets": [],
      "local_pack_presence": false,
      "knowledge_panel": false
    }
  }',
  
  -- Profile Management
  data_completeness_score integer DEFAULT 0,
  onboarding_completed boolean DEFAULT false,
  onboarding_completed_at timestamp with time zone,
  last_seo_update timestamp with time zone,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- 2. CLIENTS - System Management
-- ========================================
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name text NOT NULL,
  email text,
  quota_limit integer DEFAULT 20000,
  quota_used integer DEFAULT 0,
  active boolean DEFAULT true,
  api_key uuid DEFAULT gen_random_uuid(),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- 3. CONVERSATIONS - Chat System
-- ========================================
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title text DEFAULT 'محادثة جديدة',
  status text DEFAULT 'active',
  metadata jsonb DEFAULT '{}',
  last_message_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- 4. MESSAGES - Chat Messages
-- ========================================
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- 5. SEO_DATA - SE Ranking Historical Data
-- ========================================
CREATE TABLE public.seo_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website_url text NOT NULL,
  data_snapshot jsonb NOT NULL,
  collected_at timestamp with time zone DEFAULT now(),
  data_type text DEFAULT 'daily_update',
  created_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- 6. SUBSCRIPTION_PLANS - Billing System
-- ========================================
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL,
  plan_code text UNIQUE NOT NULL,
  description text,
  price_monthly numeric DEFAULT 0,
  price_yearly numeric DEFAULT 0,
  features jsonb DEFAULT '{}',
  limits jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- 7. USER_SUBSCRIPTIONS - User Plans
-- ========================================
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  start_date timestamp with time zone DEFAULT now(),
  end_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- 8. USER_ROLES - Access Control
-- ========================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- ========================================
-- PHASE 3: SETUP RLS POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can manage their own profiles" ON public.user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Clients Policies
CREATE POLICY "Users can manage their own client data" ON public.clients
  FOR ALL USING (auth.uid() = user_id);

-- Conversations Policies
CREATE POLICY "Users can access their own conversations" ON public.conversations
  FOR ALL USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Messages Policies
CREATE POLICY "Users can access their own messages" ON public.messages
  FOR ALL USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- SEO Data Policies
CREATE POLICY "Users can access their own SEO data" ON public.seo_data
  FOR ALL USING (auth.uid() = user_id);

-- User Subscriptions Policies
CREATE POLICY "Users can access their own subscriptions" ON public.user_subscriptions
  FOR ALL USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- User Roles Policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- ========================================
-- PHASE 4: SETUP FUNCTIONS & TRIGGERS
-- ========================================

-- Function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Setup new user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'مستخدم جديد'),
    NEW.email,
    20000,
    0,
    true
  ) RETURNING id INTO new_client_id;

  -- Create user profile
  INSERT INTO user_profiles (
    user_id,
    full_name,
    preferred_language
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    'ar'
  );

  -- Create free subscription if plan exists
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO user_subscriptions (
      client_id,
      plan_id,
      status,
      start_date
    ) VALUES (
      new_client_id,
      free_plan_id,
      'active',
      NOW()
    );
  END IF;

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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- PHASE 5: INSERT DEFAULT DATA
-- ========================================

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_name, plan_code, description, price_monthly, price_yearly, features, limits) VALUES
('الخطة المجانية', 'free-plan', 'خطة مجانية للبداية', 0, 0, 
 '{"basic_chat": true, "limited_analysis": true}', 
 '{"monthly_messages": 100, "seo_updates": 0}'),
('الخطة الأساسية', 'basic-plan', 'خطة أساسية للشركات الصغيرة', 299, 2990,
 '{"unlimited_chat": true, "website_analysis": true, "seo_tracking": true}',
 '{"monthly_messages": "unlimited", "seo_updates": 24}'),
('الخطة المتقدمة', 'premium-plan', 'خطة متقدمة للشركات الكبيرة', 799, 7990,
 '{"everything": true, "priority_support": true, "custom_reports": true}',
 '{"monthly_messages": "unlimited", "seo_updates": "unlimited", "competitors_tracking": 10}');

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_conversations_client_id ON public.conversations(client_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_client_id ON public.messages(client_id);
CREATE INDEX idx_seo_data_user_id ON public.seo_data(user_id);
CREATE INDEX idx_seo_data_website_url ON public.seo_data(website_url);
CREATE INDEX idx_seo_data_collected_at ON public.seo_data(collected_at);

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
SELECT 'تم إنشاء قاعدة البيانات النظيفة بنجاح! 🎉' AS status;
