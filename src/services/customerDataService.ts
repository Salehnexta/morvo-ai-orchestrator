
import { supabase } from "@/integrations/supabase/client";
import { CustomerData } from "@/services/agent/types";

export class CustomerDataService {
  // Save customer data to client_profiles table
  static async saveCustomerData(clientId: string, data: any): Promise<boolean> {
    try {
      console.log('Saving customer data:', { clientId, data });

      const { error } = await supabase
        .from('client_profiles')
        .upsert({
          client_id: clientId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving customer data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveCustomerData:', error);
      return false;
    }
  }

  // Get customer data from client_profiles table
  static async getCustomerData(clientId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting customer data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCustomerData:', error);
      return null;
    }
  }

  // Get complete customer profile with related data
  static async getCompleteCustomerProfile(clientId: string): Promise<any> {
    try {
      // Get customer profile from client_profiles
      const { data: customerProfile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', clientId)
        .maybeSingle();

      // Get subscription data
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('client_id', clientData?.id)
        .eq('status', 'active')
        .maybeSingle();

      // Get conversation history from messages table
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
      console.error('Error getting complete customer profile:', error);
      return null;
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
      .from('client_profiles')
      .update(updatedData)
      .eq('client_id', clientId);
  }

  private static async createCustomerProfile(
    clientId: string, 
    data: CustomerData
  ): Promise<void> {
    await supabase
      .from('client_profiles')
      .insert({
        client_id: clientId,
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
    // تحويل البيانات إلى JSON متوافق مع Supabase
    const metadata = {
      extracted_data: JSON.parse(JSON.stringify(extractedData)),
      analysis_timestamp: new Date().toISOString()
    };

    await supabase
      .from('conversation_messages')
      .insert({
        client_id: clientId,
        conversation_id: conversationId,
        message_content: message,
        message_type: 'user',
        metadata: metadata,
        created_at: new Date().toISOString()
      });
  }
}
