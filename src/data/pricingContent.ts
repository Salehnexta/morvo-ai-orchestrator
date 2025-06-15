
import { Shield, Star, Zap, LucideIcon } from "lucide-react";

export type Plan = {
  id: 'base' | 'pro' | 'business';
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  period: string;
  buttonText: string;
  popular: boolean;
  icon: LucideIcon;
};

export type Feature = {
  name: string;
  base: boolean | string;
  pro: boolean | string;
  business: boolean | string;
  [key: string]: any;
};

export type FeatureCategory = {
  title: string;
  items: Feature[];
};

export type PricingContent = {
  title: string;
  subtitle: string;
  note: string;
  plans: Plan[];
  features: {
    [key: string]: FeatureCategory;
  };
};

export const pricingContent: { [key: string]: PricingContent } = {
    ar: {
      title: "الأسعار",
      subtitle: "اختر الباقة المناسبة لنمو عملك",
      note: "* الأسعار تشمل ضريبة القيمة المضافة. الاشتراك شهري قابل للإلغاء في أي وقت، والسعر ثابت طالما الاشتراك فعّال.",
      plans: [
        {
          id: 'base',
          name: "الأساسي",
          description: "",
          price: "749 ر.س",
          period: "شهرياً",
          buttonText: "ابدأ الآن",
          popular: false,
          icon: Shield
        },
        {
          id: 'pro',
          name: "الاحترافي",
          description: "",
          price: "899 ر.س",
          originalPrice: "1,999 ر.س",
          period: "شهرياً",
          buttonText: "ابدأ الآن",
          popular: true,
          icon: Zap
        },
        {
          id: 'business',
          name: "الأعمال",
          description: "للشركات الكبيرة والجهات الحكوميه",
          price: "",
          period: "شهرياً",
          buttonText: "تواصل معنا",
          popular: false,
          icon: Star
        }
      ],
      features: {
        tokens: {
          title: "الرموز المميزة",
          items: [
            { name: "الرموز الشهرية", base: "10,000", pro: "25,000", business: "50,000" },
            { name: "رموز إضافية", base: "0.05 ر.س لكل رمز", pro: "0.04 ر.س لكل رمز", business: "0.03 ر.س لكل رمز" }
          ]
        },
        socialContent: {
          title: "محتوى وسائل التواصل الاجتماعي بالذكاء الاصطناعي",
          items: [
            { name: "حد الإنتاج", base: "30", pro: "غير محدود", business: "غير محدود" },
            { name: "إنشاء التسميات والصور والفيديو", base: true, pro: true, business: true },
            { name: "أفكار مخصصة للعلامة التجارية", base: true, pro: true, business: true },
            { name: "اقتراحات الترند بالذكاء الاصطناعي", base: true, pro: true, business: true },
            { name: "تحويل الرابط إلى منشور", base: true, pro: true, business: true },
            { name: "إنشاء الهاشتاجات", base: true, pro: true, business: true },
            { name: "أداة التصميم المدمجة", base: true, pro: true, business: true }
          ]
        },
        socialPoster: {
          title: "ناشر وسائل التواصل الاجتماعي",
          items: [
            { name: "ملفات وسائل التواصل للنشر", base: "5", pro: "10 (المزيد عند الطلب)", business: "10 (المزيد عند الطلب)" },
            { name: "المنشورات المجدولة شهرياً", base: "50", pro: "غير محدود", business: "غير محدود" },
            { name: "التقويم التفاعلي", base: true, pro: true, business: true },
            { name: "اقتراحات أفضل وقت للنشر", base: true, pro: true, business: true },
            { name: "قصص إنستغرام والتعليق الأول", base: true, pro: true, business: true },
            { name: "تكامل Bitly ومولد كود UTM", base: true, pro: true, business: true },
            { name: "الوسوم", base: true, pro: true, business: true },
            { name: "خلاصة RSS مخصصة", base: true, pro: true, business: true }
          ]
        },
        socialTracker: {
          title: "متتبع وسائل التواصل الاجتماعي",
          items: [
            { name: "ملفات وسائل التواصل للمراقبة", base: "10", pro: "20 (المزيد عند الطلب)", business: "20 (المزيد عند الطلب)" },
            { name: "تحليل أداء المنافسين", base: false, pro: true, business: true },
            { name: "مراقبة محتوى المنافسين", base: false, pro: true, business: true },
            { name: "عرض المقارنة", base: false, pro: true, business: true },
            { name: "البيانات التاريخية", base: false, pro: true, business: true },
            { name: "تقارير البريد الإلكتروني", base: false, pro: true, business: true },
            { name: "تقارير CSV وPDF بالعلامة البيضاء", base: false, pro: true, business: true }
          ]
        },
        socialAnalytics: {
          title: "تحليلات وسائل التواصل الاجتماعي",
          items: [
            { name: "الأداء حسب المنصة", base: false, pro: true, business: true },
            { name: "تحليلات المنشورات", base: false, pro: true, business: true },
            { name: "الاحتفاظ بالبيانات", base: false, pro: "24 شهر", business: "24 شهر" },
            { name: "تقارير البريد الإلكتروني", base: false, pro: true, business: true },
            { name: "تقارير CSV وPDF بالعلامة البيضاء", base: false, pro: true, business: true }
          ]
        },
        contentInsights: {
          title: "رؤى المحتوى الاجتماعي",
          items: [
            { name: "الأداء حسب المنصة", base: false, pro: true, business: true },
            { name: "الأداء حسب الوسم", base: false, pro: true, business: true },
            { name: "الأداء حسب نوع المنشور", base: false, pro: true, business: true }
          ]
        },
        influencerAnalytics: {
          title: "تحليلات المؤثرين",
          items: [
            { name: "اكتشاف المؤثرين", base: false, pro: false, business: true },
            { name: "تحليلات الأداء", base: false, pro: false, business: true },
            { name: "إدارة الحملات", base: false, pro: false, business: "إضافة" },
            { name: "بحث المنافسين", base: false, pro: false, business: "إضافة" }
          ]
        },
        mediaMonitoring: {
          title: "مراقبة الوسائط",
          items: [
            { name: "الكلمات المفتاحية للمراقبة", base: false, pro: false, business: "2 (المزيد عند الطلب)" },
            { name: "تحليل المشاعر", base: false, pro: false, business: true },
            { name: "ترند الوصول", base: false, pro: false, business: true },
            { name: "تقارير البريد الإلكتروني", base: false, pro: false, business: true }
          ]
        },
        reporting: {
          title: "التقارير",
          items: [
            { name: "التقارير الأساسية", base: "2", pro: "2", business: "2" }
          ]
        }
      }
    },
    en: {
      title: "Pricing",
      subtitle: "Choose the right plan for your business growth",
      note: "* Prices include VAT. Monthly subscription can be cancelled anytime, price remains fixed as long as subscription is active.",
      plans: [
        {
          id: 'base',
          name: "Base",
          description: "",
          price: "199 SAR",
          period: "monthly",
          buttonText: "Get Started",
          popular: false,
          icon: Shield
        },
        {
          id: 'pro',
          name: "Pro",
          description: "",
          price: "299 SAR",
          originalPrice: "599 SAR",
          period: "monthly",
          buttonText: "Get Started",
          popular: true,
          icon: Zap
        },
        {
          id: 'business',
          name: "Business",
          description: "For large enterprises and government entities",
          price: "",
          period: "monthly",
          buttonText: "Contact Us",
          popular: false,
          icon: Star
        }
      ],
      features: {
        tokens: {
          title: "Tokens",
          items: [
            { name: "Monthly tokens", base: "10,000", pro: "25,000", business: "50,000" },
            { name: "Additional tokens", base: "0.02 SAR per token", pro: "0.015 SAR per token", business: "0.01 SAR per token" }
          ]
        },
        socialContent: {
          title: "Social Content AI",
          items: [
            { name: "Generation limit", base: "30", pro: "unlimited", business: "unlimited" },
            { name: "Caption, image, and video generation", base: true, pro: true, business: true },
            { name: "AI-generated ideas tailored to your brand", base: true, pro: true, business: true },
            { name: "AI trend suggestions", base: true, pro: true, business: true },
            { name: "URL into social media post", base: true, pro: true, business: true },
            { name: "Hashtag generation", base: true, pro: true, business: true },
            { name: "Built-in graphic design tool", base: true, pro: true, business: true }
          ]
        },
        socialPoster: {
          title: "Social Poster",
          items: [
            { name: "Social media profiles for posting", base: "5", pro: "10 (more upon request)", business: "10 (more upon request)" },
            { name: "Posts to schedule per month", base: "50", pro: "unlimited", business: "unlimited" },
            { name: "Interactive calendar", base: true, pro: true, business: true },
            { name: "Best time to post suggestions", base: true, pro: true, business: true },
            { name: "Instagram stories, first comment, and link in bio", base: true, pro: true, business: true },
            { name: "Bitly integration and UTM code generator", base: true, pro: true, business: true },
            { name: "Tagging", base: true, pro: true, business: true },
            { name: "Custom RSS feed", base: true, pro: true, business: true }
          ]
        },
        socialTracker: {
          title: "Social Tracker",
          items: [
            { name: "Social media profiles for monitoring", base: "10", pro: "20 (more upon request)", business: "20 (more upon request)" },
            { name: "Competitor performance analysis", base: false, pro: true, business: true },
            { name: "Competitor content monitoring", base: false, pro: true, business: true },
            { name: "Compare view", base: false, pro: true, business: true },
            { name: "Historical data", base: false, pro: true, business: true },
            { name: "Email reports", base: false, pro: true, business: true },
            { name: "CSV and white-labeled PDF reports", base: false, pro: true, business: true }
          ]
        },
        socialAnalytics: {
          title: "Social Analytics",
          items: [
            { name: "Performance by social media platform", base: false, pro: true, business: true },
            { name: "Post analytics", base: false, pro: true, business: true },
            { name: "Data retention", base: false, pro: "24 months", business: "24 months" },
            { name: "Email reports", base: false, pro: true, business: true },
            { name: "CSV and white-labeled PDF reports", base: false, pro: true, business: true }
          ]
        },
        contentInsights: {
          title: "Social Content Insights",
          items: [
            { name: "Performance by social media platform", base: false, pro: true, business: true },
            { name: "Performance by tag", base: false, pro: true, business: true },
            { name: "Performance by post type", base: false, pro: true, business: true }
          ]
        },
        influencerAnalytics: {
          title: "Influencer Analytics",
          items: [
            { name: "Influencer discovery", base: false, pro: false, business: true },
            { name: "Performance analytics", base: false, pro: false, business: true },
            { name: "Campaign management", base: false, pro: false, business: "add-on" },
            { name: "Competitor research", base: false, pro: false, business: "add-on" }
          ]
        },
        mediaMonitoring: {
          title: "Media Monitoring",
          items: [
            { name: "Keywords to monitor", base: false, pro: false, business: "2 (more upon request)" },
            { name: "Sentiment analysis", base: false, pro: false, business: true },
            { name: "Reach trend", base: false, pro: false, business: true },
            { name: "Email reports", base: false, pro: false, business: true }
          ]
        },
        reporting: {
          title: "Reporting",
          items: [
            { name: "Base reports", base: "2", pro: "2", business: "2" }
          ]
        }
      }
    }
  };
