
import { supabase } from "@/integrations/supabase/client";

export interface CustomerData {
  company_name?: string;
  industry?: string;
  marketing_goals?: string[];
  current_challenges?: string[];
  budget_range?: string;
  preferred_contact_method?: string;
  urgency_level?: string;
  specific_requirements?: string[];
}

export class CustomerDataService {
  static async extractAndSaveCustomerData(
    message: string, 
    clientId: string,
    conversationId: string
  ): Promise<void> {
    try {
      // استخراج البيانات من الرسالة باستخدام AI
      const extractedData = this.extractDataFromMessage(message);
      
      if (Object.keys(extractedData).length > 0) {
        // التحقق من وجود ملف تعريف العميل
        const { data: existingProfile } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('customer_id', clientId)
          .single();

        if (existingProfile) {
          // تحديث البيانات الموجودة
          await this.updateCustomerProfile(clientId, extractedData, existingProfile);
        } else {
          // إنشاء ملف تعريف جديد
          await this.createCustomerProfile(clientId, extractedData);
        }

        // حفظ بيانات المحادثة للتحليل
        await this.saveConversationData(clientId, conversationId, message, extractedData);
      }
    } catch (error) {
      console.error('خطأ في حفظ بيانات العميل:', error);
    }
  }

  private static extractDataFromMessage(message: string): CustomerData {
    const data: CustomerData = {};
    const lowerMessage = message.toLowerCase();

    // استخراج اسم الشركة
    const companyPatterns = [
      /شركة\s+([^\s]+)/g,
      /مؤسسة\s+([^\s]+)/g,
      /اسم\s+الشركة\s+([^\s]+)/g,
      /نعمل\s+في\s+([^\s]+)/g
    ];
    
    for (const pattern of companyPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        data.company_name = match[1];
        break;
      }
    }

    // استخراج القطاع
    const industries = {
      'تقنية': 'technology',
      'تجارة': 'retail', 
      'طبية': 'healthcare',
      'تعليم': 'education',
      'مالية': 'finance',
      'عقارات': 'real_estate',
      'مطاعم': 'food',
      'تصنيع': 'manufacturing'
    };

    for (const [arabic, english] of Object.entries(industries)) {
      if (lowerMessage.includes(arabic)) {
        data.industry = english;
        break;
      }
    }

    // استخراج الأهداف التسويقية
    const goals = [];
    const goalKeywords = {
      'زيادة المبيعات': 'increase_sales',
      'جذب عملاء': 'lead_generation', 
      'تحسين العلامة التجارية': 'brand_awareness',
      'توسع': 'market_expansion',
      'تقليل التكلفة': 'cost_optimization'
    };

    for (const [arabic, english] of Object.entries(goalKeywords)) {
      if (lowerMessage.includes(arabic)) {
        goals.push(english);
      }
    }
    if (goals.length > 0) data.marketing_goals = goals;

    // استخراج الميزانية
    if (lowerMessage.includes('ميزانية')) {
      if (lowerMessage.includes('قليلة') || lowerMessage.includes('محدودة')) {
        data.budget_range = 'less_than_1000';
      } else if (lowerMessage.includes('متوسطة')) {
        data.budget_range = '1000_5000';
      } else if (lowerMessage.includes('كبيرة')) {
        data.budget_range = 'more_than_50000';
      }
    }

    // استخراج مستوى الأولوية
    if (lowerMessage.includes('عاجل') || lowerMessage.includes('سريع')) {
      data.urgency_level = 'urgent';
    } else if (lowerMessage.includes('مهم')) {
      data.urgency_level = 'high';
    } else {
      data.urgency_level = 'normal';
    }

    return data;
  }

  private static async updateCustomerProfile(
    clientId: string, 
    newData: CustomerData, 
    existingProfile: any
  ): Promise<void> {
    const updatedData = {
      company_name: newData.company_name || existingProfile.company_name,
      industry: newData.industry || existingProfile.industry,
      marketing_goals: newData.marketing_goals 
        ? [...(existingProfile.marketing_goals || []), ...newData.marketing_goals]
        : existingProfile.marketing_goals,
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('customer_profiles')
      .update(updatedData)
      .eq('customer_id', clientId);
  }

  private static async createCustomerProfile(
    clientId: string, 
    data: CustomerData
  ): Promise<void> {
    await supabase
      .from('customer_profiles')
      .insert({
        customer_id: clientId,
        company_name: data.company_name || '',
        industry: data.industry || '',
        marketing_goals: data.marketing_goals || [],
        budget_range: data.budget_range || '',
        preferred_language: 'ar',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
  }

  private static async saveConversationData(
    clientId: string,
    conversationId: string,
    message: string,
    extractedData: CustomerData
  ): Promise<void> {
    await supabase
      .from('conversation_messages')
      .insert({
        client_id: clientId,
        conversation_id: conversationId,
        content: message,
        sender_type: 'user',
        sender_id: clientId,
        metadata: {
          extracted_data: extractedData,
          analysis_timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      });
  }
}
