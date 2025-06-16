
import { supabase } from "@/integrations/supabase/client";

export interface TokenUsage {
  tokensUsed: number;
  remainingTokens: number;
  isLimitReached: boolean;
  accountType: 'free' | 'paid' | 'guest';
}

export class TokenService {
  private static readonly FREE_ACCOUNT_LIMIT = 5000;
  private static readonly GUEST_LIMIT = 100;

  // تتبع استخدام التوكنز
  static async trackTokenUsage(clientId: string, tokensUsed: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // إدراج أو تحديث استخدام التوكنز لليوم
      const { error } = await supabase
        .from('feature_usage')
        .upsert({
          client_id: clientId,
          feature_name: 'chat_tokens',
          usage_count: tokensUsed,
          usage_date: today,
          metadata: {
            tracked_at: new Date().toISOString()
          }
        }, {
          onConflict: 'client_id,feature_name,usage_date',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('خطأ في تتبع التوكنز:', error);
      }
    } catch (error) {
      console.error('خطأ في خدمة التوكنز:', error);
    }
  }

  // فحص حد التوكنز المتاح
  static async checkTokenLimit(clientId: string): Promise<TokenUsage> {
    try {
      // تحديد نوع الحساب
      const accountType = clientId.startsWith('public-') ? 'guest' : 'free';
      const limit = accountType === 'guest' ? this.GUEST_LIMIT : this.FREE_ACCOUNT_LIMIT;

      if (accountType === 'guest') {
        // للضيوف، نحسب استخدام الجلسة الحالية فقط
        const sessionUsage = parseInt(localStorage.getItem(`guest_tokens_${clientId}`) || '0');
        
        return {
          tokensUsed: sessionUsage,
          remainingTokens: Math.max(0, limit - sessionUsage),
          isLimitReached: sessionUsage >= limit,
          accountType
        };
      }

      // للحسابات المسجلة، نجلب البيانات من قاعدة البيانات
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('feature_usage')
        .select('usage_count')
        .eq('client_id', clientId)
        .eq('feature_name', 'chat_tokens')
        .eq('usage_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('خطأ في جلب استخدام التوكنز:', error);
      }

      const tokensUsed = data?.usage_count || 0;

      return {
        tokensUsed,
        remainingTokens: Math.max(0, limit - tokensUsed),
        isLimitReached: tokensUsed >= limit,
        accountType
      };
    } catch (error) {
      console.error('خطأ في فحص حد التوكنز:', error);
      return {
        tokensUsed: 0,
        remainingTokens: 0,
        isLimitReached: true,
        accountType: 'guest'
      };
    }
  }

  // تحديث استخدام الضيوف محلياً
  static updateGuestTokenUsage(clientId: string, tokensUsed: number): void {
    if (clientId.startsWith('public-')) {
      const currentUsage = parseInt(localStorage.getItem(`guest_tokens_${clientId}`) || '0');
      localStorage.setItem(`guest_tokens_${clientId}`, (currentUsage + tokensUsed).toString());
    }
  }

  // إنشاء حساب مجاني جديد
  static async createFreeAccount(email: string, userData: any): Promise<{ success: boolean; clientId?: string; error?: string }> {
    try {
      // تسجيل المستخدم
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8), // كلمة مرور مؤقتة
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });

      if (authError || !authData.user) {
        return { success: false, error: authError?.message || 'فشل في إنشاء الحساب' };
      }

      // إنشاء سجل العميل
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: authData.user.id,
          name: userData.name || email.split('@')[0],
          email: email,
          quota_limit: this.FREE_ACCOUNT_LIMIT,
          quota_used: 0,
          active: true
        })
        .select()
        .single();

      if (clientError || !clientData) {
        return { success: false, error: 'فشل في إنشاء بيانات العميل' };
      }

      // حفظ بيانات العميل في customer_profiles
      await supabase
        .from('customer_profiles')
        .insert({
          customer_id: authData.user.id,
          company_name: userData.company_name,
          industry: userData.industry,
          target_audience: userData.target_audience,
          marketing_goals: userData.marketing_goals || [],
          marketing_experience_level: userData.experience_level,
          monthly_marketing_budget: userData.budget_range,
          preferred_language: 'ar'
        });

      return { success: true, clientId: clientData.id };
    } catch (error) {
      console.error('خطأ في إنشاء الحساب المجاني:', error);
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }
}
