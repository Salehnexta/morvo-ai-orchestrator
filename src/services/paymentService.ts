
import { supabase } from "@/integrations/supabase/client";

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customer_email: string;
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
}

export interface PaymentResult {
  id: string;
  status: 'paid' | 'failed' | 'pending';
  payment_url?: string;
  error?: string;
}

export interface SubscriptionPlan {
  id: string;
  plan_name: string;
  plan_code: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: Record<string, any>;
  limits: Record<string, any>;
}

export class PaymentService {
  // Mock payment plans data
  static getMockPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'starter',
        plan_name: 'الباقة الأساسية',
        plan_code: 'starter',
        description: 'مثالية للشركات الناشئة والأفراد',
        price_monthly: 99,
        price_yearly: 999,
        currency: 'SAR',
        features: {
          agents: ['master_agent', 'customer_service'],
          ai_models: ['gpt-3.5-turbo'],
          integrations: ['basic_analytics'],
          support: 'email'
        },
        limits: {
          monthly_messages: 1000,
          monthly_ai_requests: 500,
          data_storage: '1GB'
        }
      },
      {
        id: 'professional',
        plan_name: 'الباقة الاحترافية',
        plan_code: 'professional',
        description: 'للشركات المتوسطة والفرق المتنامية',
        price_monthly: 199,
        price_yearly: 1999,
        currency: 'SAR',
        features: {
          agents: ['master_agent', 'customer_service', 'sales_agent', 'marketing_agent'],
          ai_models: ['gpt-3.5-turbo', 'gpt-4'],
          integrations: ['advanced_analytics', 'crm_integration'],
          support: 'priority'
        },
        limits: {
          monthly_messages: 5000,
          monthly_ai_requests: 2000,
          data_storage: '10GB'
        }
      },
      {
        id: 'enterprise',
        plan_name: 'باقة المؤسسات',
        plan_code: 'enterprise',
        description: 'للمؤسسات الكبيرة والشركات المتقدمة',
        price_monthly: 499,
        price_yearly: 4999,
        currency: 'SAR',
        features: {
          agents: 'unlimited',
          ai_models: ['gpt-3.5-turbo', 'gpt-4', 'claude-3'],
          integrations: 'all',
          support: 'dedicated'
        },
        limits: {
          monthly_messages: 'unlimited',
          monthly_ai_requests: 'unlimited',
          data_storage: 'unlimited'
        }
      }
    ];
  }

  static async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    console.log('معالجة الدفع:', paymentData);

    try {
      // محاكاة معالجة الدفع
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      // محاكاة التأخير
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // محاكاة نسبة نجاح 90%
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        // حفظ معاملة الدفع في قاعدة البيانات
        const transactionData = {
          id: mockPaymentId,
          client_id: 'mock_client_id', // سيتم استبداله بـ client_id الحقيقي
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'paid' as const,
          payment_method: 'credit_card',
          metadata: {
            plan_id: paymentData.plan_id,
            billing_cycle: paymentData.billing_cycle,
            customer_email: paymentData.customer_email
          }
        };

        const { error: transactionError } = await supabase
          .from('payment_transactions')
          .insert(transactionData);

        if (transactionError) {
          console.error('خطأ في حفظ المعاملة:', transactionError);
        }

        // إنشاء اشتراك جديد
        const subscriptionData = {
          client_id: 'mock_client_id',
          plan_id: paymentData.plan_id,
          status: 'active' as const,
          billing_cycle: paymentData.billing_cycle,
          start_date: new Date().toISOString(),
          end_date: paymentData.billing_cycle === 'yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .insert(subscriptionData);

        if (subscriptionError) {
          console.error('خطأ في إنشاء الاشتراك:', subscriptionError);
        }

        console.log('✅ تم الدفع بنجاح');
        return {
          id: mockPaymentId,
          status: 'paid'
        };
      } else {
        console.log('❌ فشل الدفع');
        return {
          id: mockPaymentId,
          status: 'failed',
          error: 'Payment declined by bank'
        };
      }
    } catch (error) {
      console.error('خطأ في معالجة الدفع:', error);
      return {
        id: `error_${Date.now()}`,
        status: 'failed',
        error: 'Internal payment processing error'
      };
    }
  }

  // Integration with Moyasar (for future implementation)
  static async createMoyasarPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // هذه الدالة للتطبيق المستقبلي مع Moyasar
    // حالياً تستخدم mock data
    
    const moyasarData = {
      amount: paymentData.amount * 100, // Moyasar expects amount in smallest currency unit
      currency: paymentData.currency,
      description: paymentData.description,
      callback_url: `${window.location.origin}/payment/callback`,
      source: {
        type: "creditcard"
      },
      metadata: {
        plan_id: paymentData.plan_id,
        billing_cycle: paymentData.billing_cycle,
        customer_email: paymentData.customer_email
      }
    };

    console.log('Moyasar payment data (mock):', moyasarData);
    
    // سيتم استبدال هذا بـ API call حقيقي للـ Moyasar
    return this.processPayment(paymentData);
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentResult> {
    // محاكاة جلب حالة الدفع
    return {
      id: paymentId,
      status: 'paid'
    };
  }

  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'cancelled',
          end_date: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      return !error;
    } catch (error) {
      console.error('خطأ في إلغاء الاشتراك:', error);
      return false;
    }
  }

  static async getUserSubscriptions(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب الاشتراكات:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('خطأ في جلب الاشتراكات:', error);
      return [];
    }
  }
}
