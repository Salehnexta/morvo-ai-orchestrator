
import { supabase } from "@/integrations/supabase/client";
import { AgentResponse } from "./types";
import { AgentCustomerDataService } from "./customerDataService";

export class AgentResponseHandler {
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
        await AgentCustomerDataService.saveCustomerData(clientId, response.data);
      }

      return true;
    } catch (error) {
      console.error('خطأ في معالجة استجابة العميل:', error);
      return false;
    }
  }
}
