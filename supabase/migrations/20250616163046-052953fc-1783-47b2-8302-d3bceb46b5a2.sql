
-- إنشاء جدول profiles إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- تفعيل Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة إذا وجدت وإنشاء سياسات جديدة
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- إنشاء سياسة للمستخدمين لرؤية ملفاتهم الشخصية
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- إنشاء سياسة للمستخدمين لتحديث ملفاتهم الشخصية  
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- التأكد من وجود العميل ورقم المعرف الصحيح
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
    
    IF user_uuid IS NOT NULL THEN
        -- إنشاء ملف شخصي إذا لم يكن موجوداً
        INSERT INTO public.profiles (id, first_name, last_name)
        VALUES (user_uuid, 'صالح', 'نكستا')
        ON CONFLICT (id) DO NOTHING;
        
        -- التأكد من وجود عميل مرتبط بالمستخدم
        SELECT id INTO client_uuid 
        FROM public.clients 
        WHERE user_id = user_uuid;
        
        -- إنشاء عميل إذا لم يكن موجوداً
        IF client_uuid IS NULL THEN
            INSERT INTO public.clients (id, user_id, name, active, quota_limit, quota_used)
            VALUES (gen_random_uuid(), user_uuid, 'صالح نكستا', true, 999999, 0)
            RETURNING id INTO client_uuid;
        END IF;
        
        -- الحصول على خطة الأعمال
        SELECT id INTO plan_uuid
        FROM public.subscription_plans
        WHERE plan_code = 'business' OR plan_name LIKE '%Pro%' OR plan_name LIKE '%Business%'
        LIMIT 1;
        
        -- إنشاء خطة افتراضية إذا لم تكن موجودة
        IF plan_uuid IS NULL THEN
            INSERT INTO public.subscription_plans (
                plan_name, plan_code, description, price_monthly, price_yearly, 
                features, limits, is_active, trial_days
            )
            VALUES (
                'خطة الأعمال', 'business', 'خطة شاملة للأعمال',
                999.00, 9990.00,
                '{"unlimited_agents": true, "priority_support": true, "advanced_analytics": true}',
                '{"messages_per_day": 999999, "agents_access": "unlimited"}',
                true, 0
            )
            RETURNING id INTO plan_uuid;
        END IF;
        
        -- حذف الاشتراكات السابقة وإنشاء اشتراك جديد نشط
        DELETE FROM public.user_subscriptions WHERE client_id = client_uuid;
        
        INSERT INTO public.user_subscriptions (
            client_id, plan_id, status, start_date, end_date, 
            billing_cycle, auto_renew, trial_end_date
        )
        VALUES (
            client_uuid, plan_uuid, 'active', NOW(), 
            NOW() + INTERVAL '1 year', 'yearly', true, NULL
        );
        
        -- التأكد من دور الأدمن
        INSERT INTO public.user_roles (user_id, role, assigned_at)
        VALUES (user_uuid, 'admin', NOW())
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- تحديث معلومات العميل
        UPDATE public.clients 
        SET 
            active = true,
            quota_limit = 999999,
            quota_used = 0,
            updated_at = NOW()
        WHERE id = client_uuid;
        
    END IF;
END $$;
