
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
          }
        ],
        total_questions: 2
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
