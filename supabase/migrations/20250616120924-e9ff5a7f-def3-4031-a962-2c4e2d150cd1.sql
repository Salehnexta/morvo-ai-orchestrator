
-- إنشاء enum للأدوار
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'moderator');

-- إنشاء جدول أدوار المستخدمين
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_by uuid REFERENCES auth.users(id),
    assigned_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- تفعيل Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- إنشاء دالة للتحقق من الأدوار (Security Definer لتجنب الـ recursive RLS)
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

-- إنشاء دالة للتحقق من دور الأدمن للمستخدم الحالي
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- سياسات الأمان لجدول user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- إنشاء جدول إحصائيات النظام للأدمن
CREATE TABLE public.admin_dashboard_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name text NOT NULL,
    metric_value jsonb NOT NULL DEFAULT '{}',
    calculated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_dashboard_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view dashboard stats" ON public.admin_dashboard_stats
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- إضافة دور الأدمن للمستخدم المحدد بطريقة آمنة
-- أولاً نتحقق من وجود المستخدم، وإذا لم يكن موجوداً نتركه للتسجيل العادي
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT id, 'admin'::app_role, now()
FROM auth.users 
WHERE email = 'saleh@nexta.sa'
AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.users.id AND role = 'admin'::app_role
);
