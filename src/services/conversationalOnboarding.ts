
interface OnboardingQuestion {
  id: string;
  question: string;
  field: string;
  type: 'text' | 'choice';
  options?: string[];
  followUp?: string;
  required: boolean;
}

export class ConversationalOnboarding {
  private static questions: OnboardingQuestion[] = [
    {
      id: 'welcome',
      question: 'مرحباً بك في مورفو! أنا مساعدك الذكي للتسويق الرقمي. لنبدأ بالتعرف عليك أكثر. ما اسم شركتك أو مشروعك؟',
      field: 'company_name',
      type: 'text',
      required: true
    },
    {
      id: 'industry',
      question: 'رائع! في أي قطاع تعمل شركتك؟',
      field: 'industry',
      type: 'choice',
      options: [
        'التقنية والبرمجيات',
        'التجارة والبيع بالتجزئة', 
        'الرعاية الصحية',
        'التعليم',
        'الخدمات المالية',
        'العقارات',
        'المطاعم والأغذية',
        'أخرى'
      ],
      required: true
    },
    {
      id: 'company_size',
      question: 'ما هو حجم فريق العمل في شركتك؟',
      field: 'company_size',
      type: 'choice',
      options: [
        '1-5 موظفين',
        '6-20 موظف',
        '21-50 موظف',
        '51-100 موظف',
        'أكثر من 100 موظف'
      ],
      required: true
    },
    {
      id: 'marketing_budget',
      question: 'ما هي الميزانية الشهرية المخصصة للتسويق؟',
      field: 'marketing_budget',
      type: 'choice',
      options: [
        'أقل من 5,000 ريال',
        '5,000 - 15,000 ريال',
        '15,000 - 50,000 ريال',
        '50,000 - 100,000 ريال',
        'أكثر من 100,000 ريال'
      ],
      required: true
    },
    {
      id: 'marketing_goals',
      question: 'ما هو هدفك الأساسي من التسويق الرقمي؟',
      field: 'primary_marketing_goal',
      type: 'choice',
      options: [
        'زيادة الوعي بالعلامة التجارية',
        'توليد العملاء المحتملين',
        'زيادة المبيعات',
        'الاحتفاظ بالعملاء',
        'دخول أسواق جديدة'
      ],
      required: true
    },
    {
      id: 'target_audience',
      question: 'من هو جمهورك المستهدف؟ يمكنك وصف العملاء الذين تستهدفهم.',
      field: 'target_audience',
      type: 'text',
      required: true
    },
    {
      id: 'marketing_experience',
      question: 'ما مستوى خبرتك في التسويق الرقمي؟',
      field: 'marketing_experience',
      type: 'choice',
      options: [
        'مبتدئ - لا توجد خبرة سابقة',
        'متوسط - بعض الخبرة الأساسية',
        'متقدم - خبرة جيدة',
        'خبير - خبرة واسعة'
      ],
      required: true
    },
    {
      id: 'completion',
      question: 'ممتاز! لقد انتهينا من إعداد ملفك الشخصي. أنا الآن جاهز لمساعدتك في بناء استراتيجية تسويقية ناجحة مخصصة لشركتك. كيف يمكنني مساعدتك اليوم؟',
      field: 'completed',
      type: 'text',
      required: false
    }
  ];

  static getWelcomeMessage(): string {
    return this.questions[0].question;
  }

  static getNextQuestion(answers: Record<string, any>): OnboardingQuestion | null {
    for (const question of this.questions) {
      if (question.field === 'completed') {
        // Check if all required fields are answered
        const allAnswered = this.questions
          .filter(q => q.required && q.field !== 'completed')
          .every(q => answers[q.field]);
        
        if (allAnswered) return question;
      } else if (!answers[question.field]) {
        return question;
      }
    }
    return null;
  }

  static extractAnswerFromText(text: string, question: OnboardingQuestion): string | null {
    if (question.type === 'choice' && question.options) {
      // Find matching option
      const lowerText = text.toLowerCase();
      for (const option of question.options) {
        if (lowerText.includes(option.toLowerCase()) || 
            option.toLowerCase().includes(lowerText)) {
          return option;
        }
      }
      // If no exact match, return the text for manual processing
      return text;
    }
    
    // For text questions, return the full text
    return text.trim();
  }

  static isOnboardingComplete(answers: Record<string, any>): boolean {
    const requiredQuestions = this.questions.filter(q => q.required && q.field !== 'completed');
    return requiredQuestions.every(q => answers[q.field]);
  }

  static formatProfileData(answers: Record<string, any>): any {
    return {
      company_name: answers.company_name,
      industry: answers.industry,
      company_size: answers.company_size,
      marketing_budget: answers.marketing_budget,
      primary_marketing_goal: answers.primary_marketing_goal,
      target_audience: answers.target_audience,
      marketing_experience: answers.marketing_experience,
      onboarding_completed: true,
      onboarding_started: true,
      completed_at: new Date().toISOString()
    };
  }
}
