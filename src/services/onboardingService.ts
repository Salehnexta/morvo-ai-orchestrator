
export interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'multiple_choice';
  options?: Array<{ value: string; label: string; }>;
  required: boolean;
}

export interface OnboardingResponse {
  questions: OnboardingQuestion[];
  total_questions: number;
}

export class OnboardingService {
  private static baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://morvo-production.up.railway.app'
    : 'http://localhost:8001';

  static async getOnboardingQuestions(): Promise<OnboardingResponse> {
    try {
      const response = await fetch(`${this.baseURL}/v1/onboarding/questions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching onboarding questions:', error);
      // Fallback to default questions if API fails
      return {
        questions: [
          {
            id: '1',
            question: 'ما هو اسم شركتك أو مشروعك؟',
            type: 'text',
            required: true
          },
          {
            id: '2', 
            question: 'في أي قطاع تعمل شركتك؟',
            type: 'choice',
            options: [
              { value: 'technology', label: 'التقنية والبرمجيات' },
              { value: 'retail', label: 'التجارة والبيع بالتجزئة' },
              { value: 'healthcare', label: 'الرعاية الصحية' },
              { value: 'education', label: 'التعليم' },
              { value: 'finance', label: 'الخدمات المالية' },
              { value: 'other', label: 'أخرى' }
            ],
            required: true
          },
          {
            id: '3',
            question: 'ما هو حجم فريق العمل في شركتك؟',
            type: 'choice',
            options: [
              { value: '1-5', label: '1-5 موظفين' },
              { value: '6-20', label: '6-20 موظف' },
              { value: '21-50', label: '21-50 موظف' },
              { value: '50+', label: 'أكثر من 50 موظف' }
            ],
            required: true
          },
          {
            id: '4',
            question: 'ما هي الميزانية الشهرية المخصصة للتسويق؟',
            type: 'choice',
            options: [
              { value: 'under-5000', label: 'أقل من 5,000 ريال' },
              { value: '5000-15000', label: '5,000 - 15,000 ريال' },
              { value: '15000-50000', label: '15,000 - 50,000 ريال' },
              { value: 'over-50000', label: 'أكثر من 50,000 ريال' }
            ],
            required: true
          },
          {
            id: '5',
            question: 'ما هو هدفك الأساسي من التسويق الرقمي؟',
            type: 'choice',
            options: [
              { value: 'brand-awareness', label: 'زيادة الوعي بالعلامة التجارية' },
              { value: 'lead-generation', label: 'توليد العملاء المحتملين' },
              { value: 'sales-increase', label: 'زيادة المبيعات' },
              { value: 'customer-retention', label: 'الاحتفاظ بالعملاء' }
            ],
            required: true
          }
        ],
        total_questions: 5
      };
    }
  }

  static async saveOnboardingProgress(userId: string, questionId: string, answer: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/v1/customer/profile/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: questionId,
          answer: answer,
          timestamp: new Date().toISOString()
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      return false;
    }
  }
}
