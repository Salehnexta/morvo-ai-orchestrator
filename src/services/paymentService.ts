
import { supabase } from "@/integrations/supabase/client";

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  source: {
    type: string;
    number?: string;
    cvc?: string;
    month?: number;
    year?: number;
    name?: string;
  };
}

interface PaymentResponse {
  id: string;
  status: string;
  amount: number;
  fee: number;
  currency: string;
  refunded: number;
  captured: number;
  refunded_at: null | string;
  captured_at: null | string;
  created_at: string;
  updated_at: string;
  description: string;
  invoice_id: string;
  ip: string;
  callback_url: string;
  source: {
    type: string;
    company: string;
    name: string;
    number: string;
    gateway_id: number;
    reference_number: null | string;
    token: null | string;
    message: null | string;
    transaction_url: string;
  };
}

export class PaymentService {
  private static readonly MOYASAR_API_URL = 'https://api.moyasar.com/v1/payments';
  private static readonly MOCK_MODE = true; // تبديل لوضع التجربة

  static async processPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    if (this.MOCK_MODE) {
      return this.mockProcessPayment(paymentData);
    }

    try {
      const response = await fetch(this.MOYASAR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MOYASAR_API_KEY}` // يجب إعداد هذا في متغيرات البيئة
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.statusText}`);
      }

      const result: PaymentResponse = await response.json();
      
      // حفظ معاملة الدفع في قاعدة البيانات
      await this.savePaymentTransaction(result);
      
      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  private static async mockProcessPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResponse: PaymentResponse = {
      id: `pay_${Date.now()}`,
      status: Math.random() > 0.1 ? 'paid' : 'failed', // 90% نجاح
      amount: paymentData.amount,
      fee: Math.round(paymentData.amount * 0.029), // 2.9% رسوم
      currency: paymentData.currency,
      refunded: 0,
      captured: paymentData.amount,
      refunded_at: null,
      captured_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: paymentData.description,
      invoice_id: `inv_${Date.now()}`,
      ip: '192.168.1.1',
      callback_url: paymentData.callback_url,
      source: {
        type: paymentData.source.type,
        company: 'visa',
        name: paymentData.source.name || 'Test User',
        number: '************1234',
        gateway_id: 1,
        reference_number: null,
        token: null,
        message: null,
        transaction_url: 'https://test.moyasar.com/transaction'
      }
    };

    // حفظ المعاملة التجريبية
    await this.savePaymentTransaction(mockResponse);
    
    return mockResponse;
  }

  private static async savePaymentTransaction(payment: PaymentResponse): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const transactionData = {
        user_id: session.user.id,
        payment_id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        payment_method: payment.source.type,
        description: payment.description,
        metadata: JSON.parse(JSON.stringify({
          fee: payment.fee,
          gateway_id: payment.source.gateway_id,
          transaction_url: payment.source.transaction_url
        })),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('payment_transactions')
        .insert(transactionData);

      if (error) {
        console.error('Error saving payment transaction:', error);
        throw error;
      }

      // إنشاء اشتراك إذا كانت المعاملة ناجحة
      if (payment.status === 'paid') {
        await this.createSubscription(session.user.id, payment);
      }

    } catch (error) {
      console.error('Error in savePaymentTransaction:', error);
      throw error;
    }
  }

  private static async createSubscription(userId: string, payment: PaymentResponse): Promise<void> {
    try {
      // تحديد نوع الخطة بناءً على المبلغ
      let planType = 'basic';
      if (payment.amount >= 50000) planType = 'premium'; // 500 ريال
      else if (payment.amount >= 20000) planType = 'professional'; // 200 ريال

      const subscriptionData = {
        user_id: userId,
        plan_type: planType,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 يوم
        payment_transaction_id: payment.id,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_subscriptions')
        .insert(subscriptionData);

      if (error) {
        console.error('Error creating subscription:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error in createSubscription:', error);
      throw error;
    }
  }

  static async getPaymentHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  static async getCurrentSubscription(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      return null;
    }
  }
}
