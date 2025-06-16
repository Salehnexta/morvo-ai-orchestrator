
import { supabase } from "@/integrations/supabase/client";

export interface AgentCommand {
  type: 'button' | 'form' | 'info_request' | 'save_data' | 'query_data';
  data: any;
  id: string;
}

export interface AgentResponse {
  type: string;
  data: any;
  timestamp: string;
}

export class AgentControlService {
  // معالجة الاستجابات المهيكلة من الوكيل
  static parseAgentResponse(response: string): { 
    message: string; 
    commands: AgentCommand[] 
  } {
    const commands: AgentCommand[] = [];
    let cleanMessage = response;

    // البحث عن أوامر الأزرار [BUTTON:text:action]
    const buttonRegex = /\[BUTTON:([^:]+):([^\]]+)\]/g;
    let buttonMatch;
    while ((buttonMatch = buttonRegex.exec(response)) !== null) {
      commands.push({
        type: 'button',
        id: `btn_${Date.now()}_${Math.random()}`,
        data: {
          buttons: [{
            text: buttonMatch[1],
            action: buttonMatch[2],
            variant: 'default'
          }]
        }
      });
      cleanMessage = cleanMessage.replace(buttonMatch[0], '');
    }

    // البحث عن أوامر النماذج [FORM:title:field1,field2,...]
    const formRegex = /\[FORM:([^:]+):([^\]]+)\]/g;
    let formMatch;
    while ((formMatch = formRegex.exec(response)) !== null) {
      const fields = formMatch[2].split(',').map(field => {
        const [name, type = 'text'] = field.split(':');
        return {
          name: name.trim(),
          label: name.trim(),
          type: type.trim() as 'text' | 'email' | 'tel' | 'number',
          required: true,
          placeholder: `أدخل ${name.trim()}`
        };
      });

      commands.push({
        type: 'form',
        id: `form_${Date.now()}_${Math.random()}`,
        data: {
          title: formMatch[1],
          fields
        }
      });
      cleanMessage = cleanMessage.replace(formMatch[0], '');
    }

    // البحث عن أوامر حفظ البيانات [SAVE_DATA:json]
    const saveDataRegex = /\[SAVE_DATA:([^\]]+)\]/g;
    let saveMatch;
    while ((saveMatch = saveDataRegex.exec(response)) !== null) {
      try {
        const data = JSON.parse(saveMatch[1]);
        commands.push({
          type: 'save_data',
          id: `save_${Date.now()}_${Math.random()}`,
          data
        });
        cleanMessage = cleanMessage.replace(saveMatch[0], '');
      } catch (error) {
        console.error('خطأ في تحليل بيانات SAVE_DATA:', error);
      }
    }

    // البحث عن طلبات المعلومات [INFO:message]
    const infoRegex = /\[INFO:([^\]]+)\]/g;
    let infoMatch;
    while ((infoMatch = infoRegex.exec(response)) !== null) {
      commands.push({
        type: 'info_request',
        id: `info_${Date.now()}_${Math.random()}`,
        data: {
          message: infoMatch[1]
        }
      });
      cleanMessage = cleanMessage.replace(infoMatch[0], '');
    }

    return {
      message: cleanMessage.trim(),
      commands
    };
  }

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

  // معالجة استجابة العميل
  static async processUserResponse(
    clientId: string, 
    response: AgentResponse
  ): Promise<boolean> {
    try {
      console.log('معالجة استجابة العميل:', response);

      // حفظ الاستجابة في قاعدة البيانات
      const { error } = await supabase
        .from('conversation_messages')
        .insert({
          client_id: clientId,
          content: JSON.stringify(response),
          sender_type: 'user',
          sender_id: clientId,
          metadata: {
            response_type: response.type,
            processed: true,
            timestamp: response.timestamp
          },
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('خطأ في حفظ استجابة العميل:', error);
        return false;
      }

      // إذا كانت الاستجابة تحتوي على بيانات نموذج، احفظها
      if (response.type === 'form_submitted' && response.data) {
        await this.saveCustomerData(clientId, response.data);
      }

      return true;
    } catch (error) {
      console.error('خطأ في معالجة استجابة العميل:', error);
      return false;
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
