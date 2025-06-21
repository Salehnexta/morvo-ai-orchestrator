
import { supabase } from "@/integrations/supabase/client";

export class AgentCustomerDataService {
  // حفظ بيانات العميل مباشرة
  static async saveCustomerData(clientId: string, data: any): Promise<boolean> {
    try {
      console.log('حفظ بيانات العميل:', { clientId, data });

      // حفظ في جدول client_profiles
      const { error } = await supabase
        .from('client_profiles')
        .upsert({
          client_id: clientId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('خطأ في حفظ بيانات العميل:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('خطأ في خدمة حفظ البيانات:', error);
      return false;
    }
  }

  // استعلام عن بيانات العميل
  static async getCustomerData(clientId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('خطأ في استعلام بيانات العميل:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('خطأ في خدمة استعلام البيانات:', error);
      return null;
    }
  }

  // استعلام شامل عن جميع بيانات العميل والاشتراك
  static async getCompleteCustomerProfile(clientId: string): Promise<any> {
    try {
      // جلب بيانات العميل
      const { data: customerProfile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      // جلب بيانات العميل من جدول clients
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', clientId)
        .maybeSingle();

      // جلب بيانات الاشتراك
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('client_id', clientData?.id)
        .eq('status', 'active')
        .maybeSingle();

      // جلب تاريخ المحادثات
      const { data: conversationHistory } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(20);

      return {
        customerProfile,
        clientData,
        subscriptionData,
        conversationHistory,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('خطأ في جلب البيانات الشاملة:', error);
      return null;
    }
  }

  // إرسال بيانات العميل الكاملة للوكيل
  static async enrichAgentContext(clientId: string, message: string): Promise<string> {
    try {
      const completeProfile = await this.getCompleteCustomerProfile(clientId);
      
      if (completeProfile && completeProfile.customerProfile) {
        const context = `
=== ملف العميل الكامل ===
معلومات الشركة:
- الصناعة: ${completeProfile.customerProfile.industry || 'غير محدد'}
- حجم الشركة: ${completeProfile.customerProfile.company_size || 'غير محدد'}

الخبرة التسويقية:
- مستوى الخبرة: ${completeProfile.customerProfile.marketing_experience || 'غير محدد'}
- حجم فريق التسويق: ${completeProfile.customerProfile.team_size || 'غير محدد'}
- الأدوات المستخدمة: ${JSON.stringify(completeProfile.customerProfile.current_marketing_tools || [])}

الأهداف والاستراتيجية:
- الهدف الأساسي: ${completeProfile.customerProfile.primary_goal || 'غير محدد'}
- الجمهور المستهدف: ${completeProfile.customerProfile.target_audience || 'غير محدد'}
- المنطقة المستهدفة: ${completeProfile.customerProfile.target_region || 'غير محدد'}

الميزانية:
- الميزانية الشهرية: ${completeProfile.customerProfile.marketing_budget || 'غير محدد'}

معلومات الاشتراك:
- نوع الخطة: ${completeProfile.subscriptionData?.subscription_plans?.plan_name || 'غير محدد'}
- حالة الاشتراك: ${completeProfile.subscriptionData?.status || 'غير محدد'}

تاريخ التفاعل:
- عدد الرسائل السابقة: ${completeProfile.conversationHistory?.length || 0}
- آخر تفاعل: ${completeProfile.conversationHistory?.[0]?.created_at || 'لا يوجد'}

=== الرسالة الحالية ===
${message}

=== تعليمات للوكيل ===
- استخدم هذه المعلومات لتقديم نصائح مخصصة ومناسبة لحجم الشركة وخبرتها
- راعي الميزانية المتاحة عند اقتراح الحلول
- اشر إلى الأنشطة التسويقية الحالية عند التخطيط
- قدم حلول متدرجة حسب مستوى الخبرة
- اذكر النتائج السابقة إذا كانت متوفرة
`;
        return context;
      }

      return message;
    } catch (error) {
      console.error('خطأ في إثراء سياق الوكيل:', error);
      return message;
    }
  }

  // تحديث حالة العميل كعميل مدفوع (للاختبار)
  static async markCustomerAsPaid(userId: string): Promise<boolean> {
    try {
      console.log('تحديث حالة العميل كمدفوع:', userId);
      
      // البحث عن العميل
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!clientData) {
        console.error('لم يتم العثور على العميل');
        return false;
      }

      // تحديث حالة الاشتراك
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('client_id', clientData.id);

      if (updateError) {
        console.error('خطأ في تحديث الاشتراك:', updateError);
        return false;
      }

      console.log('✅ تم تحديث حالة العميل بنجاح');
      return true;
    } catch (error) {
      console.error('خطأ في تحديث حالة العميل:', error);
      return false;
    }
  }
}
