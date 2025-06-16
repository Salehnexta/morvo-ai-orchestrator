
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

  // إرسال بيانات العميل للوكيل
  static async enrichAgentContext(clientId: string, message: string): Promise<string> {
    try {
      const customerData = await this.getCustomerData(clientId);
      
      if (customerData) {
        const context = `
معلومات العميل المتاحة:
- الاسم: ${customerData.company_name || 'غير محدد'}
- الصناعة: ${customerData.industry || 'غير محدد'}
- الميزانية: ${customerData.budget_range || 'غير محدد'}
- الأهداف التسويقية: ${JSON.stringify(customerData.marketing_goals || [])}

الرسالة الحالية: ${message}
`;
        return context;
      }

      return message;
    } catch (error) {
      console.error('خطأ في إثراء سياق الوكيل:', error);
      return message;
    }
  }
}
