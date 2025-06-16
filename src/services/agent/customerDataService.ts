
import { supabase } from "@/integrations/supabase/client";

export class AgentCustomerDataService {
  // حفظ بيانات العميل مباشرة
  static async saveCustomerData(clientId: string, data: any): Promise<boolean> {
    try {
      console.log('حفظ بيانات العميل:', { clientId, data });

      // حفظ في جدول customer_profiles
      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: clientId,
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
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', clientId)
        .single();

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
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', clientId)
        .single();

      // جلب بيانات العميل من جدول clients
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', clientId)
        .single();

      // جلب بيانات الاشتراك
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('client_id', clientData?.id)
        .eq('status', 'active')
        .single();

      // جلب تاريخ المحادثات
      const { data: conversationHistory } = await supabase
        .from('conversation_messages')
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
- اسم الشركة: ${completeProfile.customerProfile.company_name || 'غير محدد'}
- الصناعة: ${completeProfile.customerProfile.industry || 'غير محدد'}
- حجم الشركة: ${completeProfile.customerProfile.company_size || 'غير محدد'}
- الموقع الإلكتروني: ${completeProfile.customerProfile.website_url || 'غير محدد'}

الخبرة التسويقية:
- مستوى الخبرة: ${completeProfile.customerProfile.marketing_experience_level || 'غير محدد'}
- حجم فريق التسويق: ${completeProfile.customerProfile.marketing_team_size || 'غير محدد'}
- الأنشطة التسويقية الحالية: ${JSON.stringify(completeProfile.customerProfile.current_marketing_activities || [])}
- الأدوات المستخدمة: ${JSON.stringify(completeProfile.customerProfile.marketing_tools_used || [])}

الأهداف والاستراتيجية:
- الأهداف التسويقية: ${JSON.stringify(completeProfile.customerProfile.marketing_goals || [])}
- الجمهور المستهدف: ${completeProfile.customerProfile.target_audience || 'غير محدد'}
- القنوات المفضلة: ${JSON.stringify(completeProfile.customerProfile.preferred_marketing_channels || [])}
- نقاط الضعف: ${JSON.stringify(completeProfile.customerProfile.marketing_pain_points || [])}

الميزانية:
- الميزانية الشهرية: ${completeProfile.customerProfile.monthly_marketing_budget || 'غير محدد'}
- تاريخ الميزانية: ${completeProfile.customerProfile.marketing_budget_history || 'غير محدد'}

معلومات الاشتراك:
- نوع الخطة: ${completeProfile.subscriptionData?.subscription_plans?.plan_name || 'غير محدد'}
- حالة الاشتراك: ${completeProfile.subscriptionData?.status || 'غير محدد'}
- تاريخ البداية: ${completeProfile.subscriptionData?.start_date || 'غير محدد'}
- تاريخ الانتهاء: ${completeProfile.subscriptionData?.end_date || 'غير محدد'}

التفضيلات:
- اللغة المفضلة: ${completeProfile.customerProfile.preferred_language || 'ar'}
- تفضيلات التواصل: ${JSON.stringify(completeProfile.customerProfile.communication_preferences || {})}

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
        .single();

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
