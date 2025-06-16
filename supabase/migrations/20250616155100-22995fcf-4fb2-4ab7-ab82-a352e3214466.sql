
-- حذف الصفوف المكررة من جدول clients مع الاحتفاظ بأحدثها
DELETE FROM public.clients 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id
    FROM public.clients
    WHERE user_id IS NOT NULL
    ORDER BY user_id, created_at DESC
);

-- الآن إضافة unique constraint على user_id
ALTER TABLE public.clients ADD CONSTRAINT clients_user_id_unique UNIQUE (user_id);

-- التأكد من وجود خطط الاشتراك
INSERT INTO public.subscription_plans (plan_name, plan_code, price_monthly, price_yearly, features, limits, created_at, updated_at) 
VALUES 
(
  'خطة الأعمال', 
  'business', 
  999.00, 
  9990.00,
  '{"agents": ["customer_journey", "digital_expansion", "content_innovator", "strategic_insights", "communication_strategy", "reputation_monitor", "market_pioneer", "performance_optimizer", "relationship_developer"], "ai_models": ["gpt-4", "claude-3"], "integrations": ["unlimited"], "support": "24/7", "custom_reports": true}',
  '{"monthly_messages": "unlimited", "data_sources": "unlimited", "custom_dashboards": "unlimited"}',
  NOW(),
  NOW()
)
ON CONFLICT (plan_code) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = NOW();

-- إنشاء المستخدم والعميل والاشتراك لـ saleh@nexta.sa
DO $$
DECLARE
    user_uuid UUID;
    client_uuid UUID;
    plan_uuid UUID;
BEGIN
    -- الحصول على معرف المستخدم
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'saleh@nexta.sa';
    
    -- الحصول على معرف الخطة
    SELECT id INTO plan_uuid
    FROM subscription_plans
    WHERE plan_code = 'business';
    
    IF user_uuid IS NOT NULL AND plan_uuid IS NOT NULL THEN
        -- إنشاء/تحديث العميل
        INSERT INTO public.clients (name, user_id, active, created_at, updated_at) 
        VALUES ('Saleh Admin', user_uuid, true, NOW(), NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          name = EXCLUDED.name,
          active = EXCLUDED.active,
          updated_at = NOW()
        RETURNING id INTO client_uuid;
        
        -- إذا لم يتم إرجاع معرف العميل، احصل عليه
        IF client_uuid IS NULL THEN
            SELECT id INTO client_uuid FROM clients WHERE user_id = user_uuid;
        END IF;
        
        -- حذف الاشتراكات القديمة وإنشاء اشتراك جديد
        DELETE FROM public.user_subscriptions WHERE user_subscriptions.client_id = client_uuid;
        
        INSERT INTO public.user_subscriptions (
            client_id, 
            plan_id, 
            status, 
            start_date, 
            end_date,
            created_at,
            updated_at
        )
        VALUES (
            client_uuid,
            plan_uuid,
            'active',
            NOW(),
            NOW() + INTERVAL '1 year',
            NOW(),
            NOW()
        );
        
        -- إضافة دور الأدمن
        INSERT INTO public.user_roles (user_id, role, assigned_at) 
        VALUES (user_uuid, 'admin', NOW()) 
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- إنشاء ملف العميل
        INSERT INTO public.customer_profiles (
            customer_id,
            company_name,
            industry,
            company_size,
            marketing_experience_level,
            current_marketing_activities,
            marketing_goals,
            target_audience,
            monthly_marketing_budget,
            preferred_language,
            created_at,
            updated_at
        )
        VALUES (
            user_uuid::varchar,
            'Nexta Company',
            'تقنية المعلومات',
            '50-100',
            'expert',
            '["إعلانات رقمية", "تسويق محتوى"]',
            '["زيادة المبيعات", "توسيع نطاق الوصول"]',
            'الشركات الصغيرة والمتوسطة',
            '10000-50000',
            'ar',
            NOW(),
            NOW()
        )
        ON CONFLICT (customer_id) DO UPDATE SET
          company_name = EXCLUDED.company_name,
          industry = EXCLUDED.industry,
          updated_at = NOW();
          
    END IF;
END $$;
