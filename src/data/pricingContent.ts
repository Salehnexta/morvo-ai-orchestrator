
export interface Plan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaAction: string;
}

export interface FeatureItem {
  name: string;
  base: boolean | string;
  pro: boolean | string;
  business: boolean | string;
}

export interface FeatureCategory {
  title: string;
  items: FeatureItem[];
}

export const pricingContent = {
  ar: {
    title: "ابدأ رحلتك مع مورفو",
    subtitle: "احصل على 20,000 توكن مجاناً لتجربة كاملة",
    plans: [
      {
        id: "free",
        name: "حساب مجاني",
        price: "مجاناً",
        period: "20,000 توكن",
        description: "ابدأ رحلتك مع مورفو واكتشف قوة الذكاء الاصطناعي",
        features: [
          "20,000 توكن مجاناً",
          "الوصول لجميع وكلاء AI التسعة",
          "لوحة تحكم تفاعلية",
          "دعم فني متاح",
          "تجربة كاملة بلا قيود"
        ],
        isPopular: true,
        ctaText: "ابدأ الآن مجاناً",
        ctaAction: "start-free"
      }
    ],
    features: [],
    note: "بعد استنفاد التوكنز المجانية، يمكنك الترقية للحصول على توكنز إضافية"
  },
  en: {
    title: "Start Your Journey with Morvo",
    subtitle: "Get 20,000 free tokens for a complete experience",
    plans: [
      {
        id: "free",
        name: "Free Account",
        price: "Free",
        period: "20,000 tokens",
        description: "Start your journey with Morvo and discover the power of AI",
        features: [
          "20,000 free tokens",
          "Access to all 9 AI agents",
          "Interactive dashboard",
          "Technical support available",
          "Complete experience without limits"
        ],
        isPopular: true,
        ctaText: "Start Now for Free",
        ctaAction: "start-free"
      }
    ],
    features: [],
    note: "After using your free tokens, you can upgrade to get additional tokens"
  }
};
