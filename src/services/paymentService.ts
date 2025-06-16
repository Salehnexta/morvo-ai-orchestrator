
import { supabase } from "@/integrations/supabase/client";

export interface MockPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  invoice_id?: string;
  callback_url?: string;
  payment_method?: {
    type: string;
    company?: string;
    name?: string;
    number?: string;
  };
  source?: {
    type: string;
    company?: string;
    name?: string;
    number?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  source?: {
    type: string;
    name: string;
    number: string;
    cvc: string;
    month: string;
    year: string;
  };
}

export class PaymentService {
  private static readonly MOYASAR_API_URL = 'https://api.moyasar.com/v1';
  private static readonly MOYASAR_PUBLISHABLE_KEY = 'pk_test_moyasar_key'; // Mock key for development

  static async createPayment(request: CreatePaymentRequest): Promise<MockPaymentResponse> {
    try {
      console.log('Creating payment with Moyasar:', request);

      // محاكاة استجابة Moyasar
      const mockResponse: MockPaymentResponse = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        status: Math.random() > 0.1 ? 'paid' : 'failed', // 90% نجاح للاختبار
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        callback_url: request.callback_url,
        payment_method: request.source ? {
          type: request.source.type,
          company: 'visa',
          name: request.source.name,
          number: `****-****-****-${request.source.number.slice(-4)}`
        } : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Mock Moyasar response:', mockResponse);
      return mockResponse;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw new Error('فشل في إنشاء عملية الدفع');
    }
  }

  static async savePaymentTransaction(
    clientId: string,
    subscriptionId: string,
    paymentData: MockPaymentResponse
  ): Promise<void> {
    try {
      // تحويل البيانات إلى JSON متوافق مع Supabase
      const metadata = JSON.parse(JSON.stringify({
        payment_flow: 'moyasar_mock',
        test_mode: true
      }));

      const moyasarResponse = JSON.parse(JSON.stringify(paymentData));

      await supabase
        .from('payment_transactions')
        .insert({
          client_id: clientId,
          subscription_id: subscriptionId,
          moyasar_payment_id: paymentData.id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          payment_method: paymentData.payment_method?.type || 'card',
          moyasar_response: moyasarResponse,
          metadata: metadata
        });

      console.log('Payment transaction saved successfully');
    } catch (error) {
      console.error('Error saving payment transaction:', error);
      throw error;
    }
  }

  static async createSubscription(
    clientId: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          client_id: clientId,
          plan_id: planId,
          billing_cycle: billingCycle,
          status: 'trial',
          start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days trial
          auto_renew: true
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Subscription created:', data);
      return data.id;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async updateSubscriptionStatus(
    subscriptionId: string,
    status: 'active' | 'inactive' | 'cancelled',
    endDate?: string
  ): Promise<void> {
    try {
      const updateData: any = { status };
      if (endDate) updateData.end_date = endDate;

      await supabase
        .from('user_subscriptions')
        .update(updateData)
        .eq('id', subscriptionId);

      console.log('Subscription status updated');
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  static async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  }

  static getMockPlans() {
    return [
      {
        id: 'plan_starter',
        plan_name: 'الباقة الأساسية',
        plan_code: 'starter',
        price_monthly: 99,
        price_yearly: 990,
        currency: 'SAR',
        description: 'مثالية للشركات الصغيرة والناشئة',
        features: {
          agents: ['marketing_agent', 'customer_service_agent'],
          ai_models: ['gpt-3.5-turbo'],
          integrations: ['basic_analytics'],
          support: 'email'
        },
        limits: {
          messages_per_month: 1000,
          reports_per_month: 10,
          data_sources: 3
        }
      },
      {
        id: 'plan_professional',
        plan_name: 'الباقة الاحترافية',
        plan_code: 'professional',
        price_monthly: 299,
        price_yearly: 2990,
        currency: 'SAR',
        description: 'للشركات المتوسطة التي تحتاج مزيد من الوكلاء',
        features: {
          agents: ['marketing_agent', 'customer_service_agent', 'analytics_agent', 'content_agent'],
          ai_models: ['gpt-4', 'gpt-3.5-turbo'],
          integrations: ['advanced_analytics', 'social_media', 'email_marketing'],
          support: 'priority'
        },
        limits: {
          messages_per_month: 5000,
          reports_per_month: 50,
          data_sources: 10
        }
      },
      {
        id: 'plan_enterprise',
        plan_name: 'باقة المؤسسات',
        plan_code: 'enterprise',
        price_monthly: 999,
        price_yearly: 9990,
        currency: 'SAR',
        description: 'حل شامل للمؤسسات الكبيرة',
        features: {
          agents: 'unlimited',
          ai_models: ['gpt-4', 'gpt-3.5-turbo', 'claude-3'],
          integrations: 'all',
          support: 'dedicated'
        },
        limits: {
          messages_per_month: 'unlimited',
          reports_per_month: 'unlimited',
          data_sources: 'unlimited'
        }
      }
    ];
  }
}
