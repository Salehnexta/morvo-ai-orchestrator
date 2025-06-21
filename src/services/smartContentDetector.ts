
export interface ContentIntent {
  type: 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'chart' | 'plan' | 'default';
  confidence: number;
  keywords: string[];
  suggestedActions?: string[];
}

export interface DetectionResult {
  primary: ContentIntent;
  secondary?: ContentIntent;
  contextData?: any;
}

export class SmartContentDetector {
  private static readonly INTENT_PATTERNS = {
    analytics: {
      keywords: ['تحليل', 'إحصائي', 'أداء', 'نتائج', 'مقاييس', 'analytics', 'performance', 'metrics', 'stats', 'data', 'report', 'رقم', 'معدل', 'نسبة'],
      phrases: ['كيف الأداء', 'عرض النتائج', 'التحليلات', 'show analytics', 'performance report'],
      weight: 1.0
    },
    'content-creator': {
      keywords: ['محتوى', 'منشور', 'كتابة', 'إنشاء', 'content', 'post', 'create', 'write', 'caption', 'social', 'تصميم', 'نص'],
      phrases: ['اكتب منشور', 'إنشاء محتوى', 'create content', 'write post', 'social media'],
      weight: 1.0
    },
    calendar: {
      keywords: ['جدولة', 'موعد', 'تاريخ', 'calendar', 'schedule', 'plan', 'time', 'date', 'appointment', 'متى', 'وقت'],
      phrases: ['جدولة المنشورات', 'تحديد موعد', 'schedule posts', 'plan content'],
      weight: 1.0
    },
    campaign: {
      keywords: ['حملة', 'إعلان', 'تسويق', 'campaign', 'advertisement', 'promotion', 'marketing', 'إعلانات', 'ترويج'],
      phrases: ['إنشاء حملة', 'حملة تسويقية', 'create campaign', 'marketing campaign'],
      weight: 1.0
    },
    chart: {
      keywords: ['رسم', 'بياني', 'جرافيك', 'chart', 'graph', 'visualization', 'مخطط', 'رسوم'],
      phrases: ['رسم بياني', 'عرض الرسم', 'show chart', 'create graph'],
      weight: 1.0
    },
    plan: {
      keywords: ['خطة', 'استراتيجية', 'plan', 'strategy', 'roadmap', 'خارطة', 'مخطط', 'هدف'],
      phrases: ['وضع خطة', 'استراتيجية تسويقية', 'create plan', 'marketing strategy'],
      weight: 1.0
    }
  };

  static detectIntent(message: string, conversationHistory: string[] = []): DetectionResult {
    const normalizedMessage = message.toLowerCase().trim();
    const scores: { [key: string]: number } = {};

    // Initialize scores
    Object.keys(this.INTENT_PATTERNS).forEach(intent => {
      scores[intent] = 0;
    });

    // Keyword matching
    Object.entries(this.INTENT_PATTERNS).forEach(([intent, pattern]) => {
      pattern.keywords.forEach(keyword => {
        if (normalizedMessage.includes(keyword.toLowerCase())) {
          scores[intent] += pattern.weight * 0.6;
        }
      });

      pattern.phrases.forEach(phrase => {
        if (normalizedMessage.includes(phrase.toLowerCase())) {
          scores[intent] += pattern.weight * 1.2;
        }
      });
    });

    // Context from conversation history
    if (conversationHistory.length > 0) {
      const recentContext = conversationHistory.slice(-3).join(' ').toLowerCase();
      Object.entries(this.INTENT_PATTERNS).forEach(([intent, pattern]) => {
        pattern.keywords.forEach(keyword => {
          if (recentContext.includes(keyword.toLowerCase())) {
            scores[intent] += pattern.weight * 0.3;
          }
        });
      });
    }

    // Find the highest scoring intent
    const sortedIntents = Object.entries(scores)
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a);

    if (sortedIntents.length === 0) {
      return {
        primary: {
          type: 'default',
          confidence: 1.0,
          keywords: []
        }
      };
    }

    const [primaryIntent, primaryScore] = sortedIntents[0];
    const primary: ContentIntent = {
      type: primaryIntent as ContentIntent['type'],
      confidence: Math.min(primaryScore / 2, 1.0),
      keywords: this.INTENT_PATTERNS[primaryIntent as keyof typeof this.INTENT_PATTERNS].keywords.filter(k => 
        normalizedMessage.includes(k.toLowerCase())
      )
    };

    // Secondary intent if confidence is close
    let secondary: ContentIntent | undefined;
    if (sortedIntents.length > 1) {
      const [secondaryIntent, secondaryScore] = sortedIntents[1];
      if (secondaryScore >= primaryScore * 0.7) {
        secondary = {
          type: secondaryIntent as ContentIntent['type'],
          confidence: Math.min(secondaryScore / 2, 1.0),
          keywords: this.INTENT_PATTERNS[secondaryIntent as keyof typeof this.INTENT_PATTERNS].keywords.filter(k => 
            normalizedMessage.includes(k.toLowerCase())
          )
        };
      }
    }

    return {
      primary,
      secondary,
      contextData: this.extractContextData(message, primary.type)
    };
  }

  private static extractContextData(message: string, intentType: ContentIntent['type']): any {
    const contextData: any = {};

    switch (intentType) {
      case 'analytics':
        // Extract time periods, metrics mentioned, etc.
        if (message.includes('شهر') || message.includes('month')) {
          contextData.period = 'monthly';
        } else if (message.includes('أسبوع') || message.includes('week')) {
          contextData.period = 'weekly';
        }
        break;

      case 'content-creator':
        // Extract platform mentions
        if (message.includes('انستغرام') || message.includes('instagram')) {
          contextData.platform = 'instagram';
        } else if (message.includes('تويتر') || message.includes('twitter')) {
          contextData.platform = 'twitter';
        }
        break;

      case 'campaign':
        // Extract budget mentions, target audience, etc.
        const budgetMatch = message.match(/(\d+)\s*(ريال|dollar|$)/i);
        if (budgetMatch) {
          contextData.budget = budgetMatch[1];
        }
        break;
    }

    return contextData;
  }

  static getSuggestedActions(intent: ContentIntent): string[] {
    const actionMap = {
      analytics: [
        'عرض إحصائيات الأداء',
        'تحليل البيانات الشهرية',
        'مقارنة النتائج',
        'تصدير التقرير'
      ],
      'content-creator': [
        'إنشاء منشور جديد',
        'كتابة تغريدة',
        'تصميم قصة',
        'جدولة المحتوى'
      ],
      calendar: [
        'عرض الجدول الزمني',
        'إضافة موعد جديد',
        'تعديل المواعيد',
        'تذكيرات'
      ],
      campaign: [
        'إنشاء حملة جديدة',
        'تحسين الإعلانات',
        'تحليل النتائج',
        'تعديل الميزانية'
      ],
      chart: [
        'إنشاء رسم بياني',
        'تحليل الاتجاهات',
        'مقارنة البيانات',
        'حفظ الرسم'
      ],
      plan: [
        'وضع استراتيجية',
        'تحديد الأهداف',
        'جدولة المهام',
        'متابعة التقدم'
      ],
      default: [
        'بدء محادثة جديدة',
        'عرض المساعدة',
        'الإعدادات'
      ]
    };

    return actionMap[intent.type] || actionMap.default;
  }
}
