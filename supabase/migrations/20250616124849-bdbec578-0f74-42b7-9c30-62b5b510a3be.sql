
-- إنشاء جدول خطط الاشتراك المحدث
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS stripe_price_id_monthly TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id_yearly TEXT,
ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT 7,
ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT false;

-- تحديث البيانات الموجودة
UPDATE subscription_plans SET
  stripe_price_id_monthly = CASE 
    WHEN plan_code = 'base' THEN 'price_base_monthly'
    WHEN plan_code = 'pro' THEN 'price_pro_monthly' 
    WHEN plan_code = 'business' THEN 'price_business_monthly'
  END,
  stripe_price_id_yearly = CASE
    WHEN plan_code = 'base' THEN 'price_base_yearly'
    WHEN plan_code = 'pro' THEN 'price_pro_yearly'
    WHEN plan_code = 'business' THEN 'price_business_yearly'
  END,
  popular = CASE WHEN plan_code = 'pro' THEN true ELSE false END;

-- إنشاء جدول أوامر الشراء
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  plan_id UUID REFERENCES subscription_plans(id),
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  amount NUMERIC NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- تمكين RLS على جدول الأوامر
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان لجدول الأوامر
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update orders" ON public.orders
  FOR UPDATE USING (true);

-- إضافة صلاحيات لـ saleh@nexta.sa
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- البحث عن معرف المستخدم
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'saleh@nexta.sa';
    
    -- إضافة الصلاحيات إذا وُجد المستخدم
    IF user_uuid IS NOT NULL THEN
        -- إضافة دور الأدمن
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (user_uuid, 'admin') 
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- إنشاء ملف عميل إذا لم يكن موجوداً
        INSERT INTO public.clients (name, user_id, active) 
        VALUES ('Saleh Admin', user_uuid, true)
        ON CONFLICT DO NOTHING;
        
        -- إنشاء اشتراك نشط للمستخدم
        INSERT INTO public.user_subscriptions (
            client_id, 
            plan_id, 
            status, 
            start_date, 
            end_date
        )
        SELECT 
            c.id,
            sp.id,
            'active',
            NOW(),
            NOW() + INTERVAL '1 year'
        FROM public.clients c, public.subscription_plans sp
        WHERE c.user_id = user_uuid 
        AND sp.plan_code = 'business'
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
