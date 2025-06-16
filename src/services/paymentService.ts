
import { supabase } from "@/integrations/supabase/client";

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customer_name: string;
  customer_email: string;
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
}

export interface MockPaymentResponse {
  id: string;
  status: 'paid' | 'failed' | 'pending';
  amount: number;
  currency: string;
  created_at: string;
  source: {
    type: 'creditcard' | 'stcpay' | 'applepay';
    company: string;
    name: string;
    number: string;
  };
}

export class PaymentService {
  private static readonly MOYASAR_API_URL = 'https://api.moyasar.com/v1/payments';
  private static readonly MOCK_MODE = true; // تغيير إلى false للاستخدام الحقيقي

  static async processPayment(paymentData: PaymentData): Promise<MockPaymentResponse> {
    if (this.MOCK_MODE) {
      return this.mockPayment(paymentData);
    } else {
      return this.realPayment(paymentData);
    }
  }

  private static async mockPayment(paymentData: PaymentData): Promise<MockPaymentResponse> {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 2000));

    // محاكاة نتائج مختلفة
    const random = Math.random();
    const status = random > 0.1 ? 'paid' : 'failed'; // 90% نجاح

    const mockResponse: MockPaymentResponse = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status,
      amount: paymentData.amount * 100, // Moyasar يستخدم الهللات
      currency: paymentData.currency,
      created_at: new Date().toISOString(),
      source: {
        type: 'creditcard',
        company: 'visa',
        name: paymentData.customer_name,
        number: '4111 **** **** 1111'
      }
    };

    // حفظ المعاملة في قاعدة البيانات
    await this.saveTransaction(paymentData, mockResponse);

    return mockResponse;
  }

  private static async realPayment(paymentData: PaymentData): Promise<MockPaymentResponse> {
    // التكامل الحقيقي مع Moyasar
    const moyasarData = {
      amount: paymentData.amount * 100, // تحويل إلى هللات
      currency: paymentData.currency,
      description: paymentData.description,
      publishable_api_key: process.env.MOYASAR_PUBLISHABLE_KEY,
      callback_url: `${window.location.origin}/payment/callback`,
      source: {
        type: 'creditcard'
      },
      metadata: {
        plan_id: paymentData.plan_id,
        billing_cycle: paymentData.billing_cycle
      }
    };

    try {
      const response = await fetch(this.MOYASAR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(process.env.MOYASAR_SECRET_KEY + ':')}`
        },
        body: JSON.stringify(moyasarData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Payment failed');
      }

      await this.saveTransaction(paymentData, result);
      return result;
    } catch (error) {
      console.error('خطأ في معالجة الدفع:', error);
      throw error;
    }
  }

  private static async saveTransaction(
    paymentData: PaymentData, 
    response: MockPaymentResponse
  ): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) return;

    // حفظ معاملة الدفع
    const { data: transaction } = await supabase
      .from('payment_transactions')
      .insert({
        client_id: session.user.id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: response.status === 'paid' ? 'completed' : 'failed',
        payment_method: response.source.type,
        moyasar_payment_id: response.id,
        moyasar_response: response,
        metadata: {
          plan_id: paymentData.plan_id,
          billing_cycle: paymentData.billing_cycle,
          customer_name: paymentData.customer_name,
          customer_email: paymentData.customer_email
        }
      })
      .select()
      .single();

    // إنشاء الاشتراك إذا نجح الدفع
    if (response.status === 'paid' && transaction) {
      await this.createSubscription(session.user.id, paymentData, transaction.id);
    }
  }

  private static async createSubscription(
    userId: string, 
    paymentData: PaymentData, 
    transactionId: string
  ): Promise<void> {
    const endDate = new Date();
    if (paymentData.billing_cycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    await supabase
      .from('user_subscriptions')
      .insert({
        client_id: userId,
        plan_id: paymentData.plan_id,
        status: 'active',
        billing_cycle: paymentData.billing_cycle,
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
        payment_method: {
          transaction_id: transactionId
        }
      });
  }

  static async getSubscriptionPlans() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Mock data للخطط
  static getMockPlans() {
    return [
      {
        id: 'basic',
        plan_name: 'الخطة الأساسية',
        plan_code: 'basic',
        price_monthly: 99,
        price_yearly: 990,
        currency: 'SAR',
        description: 'مثالية للشركات الصغيرة',
        features: {
          agents: ['customer_service', 'marketing_advisor'],
          monthly_messages: 1000,
          ai_models: ['gpt-3.5-turbo'],
          integrations: ['basic_analytics']
        },
        limits: {
          messages: 1000,
          reports: 10,
          projects: 1
        }
      },
      {
        id: 'professional',
        plan_name: 'الخطة المهنية',
        plan_code: 'professional',
        price_monthly: 199,
        price_yearly: 1990,
        currency: 'SAR',
        description: 'للشركات المتوسطة',
        features: {
          agents: ['customer_service', 'marketing_advisor', 'data_analyst'],
          monthly_messages: 5000,
          ai_models: ['gpt-4', 'claude-3'],
          integrations: ['advanced_analytics', 'social_media']
        },
        limits: {
          messages: 5000,
          reports: 50,
          projects: 5
        }
      },
      {
        id: 'enterprise',
        plan_name: 'خطة المؤسسات',
        plan_code: 'enterprise',
        price_monthly: 499,
        price_yearly: 4990,
        currency: 'SAR',
        description: 'للشركات الكبيرة',
        features: {
          agents: 'unlimited',
          monthly_messages: 'unlimited',
          ai_models: ['gpt-4', 'claude-3', 'custom_models'],
          integrations: 'all'
        },
        limits: {
          messages: 'unlimited',
          reports: 'unlimited',
          projects: 'unlimited'
        }
      }
    ];
  }
}
