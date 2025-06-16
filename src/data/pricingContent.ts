
import { Shield, Star, Zap, Gift, LucideIcon } from "lucide-react";

export type Plan = {
  id: 'free' | 'base' | 'pro' | 'business';
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
  free: boolean | string;
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
          id: 'free',
          name: "مجاني",
          description: "للمستخدمين الجدد والتجربة",
          price: "0 ر.س",
          period: "شهرياً",
          buttonText: "ابدأ مجاناً",
          popular: false,
          icon: Gift
        },
        {
          id: 'base',
          name: "الأساسي",
          description: "للشركات الناشئة",
          price: "749 ر.س",
          period: "شهرياً",
          buttonText: "ابدأ الآن",
          popular: false,
          icon: Shield
        },
        {
          id: 'pro',
          name: "الاحترافي",
          description: "الأكثر شعبية للشركات المتوسطة",
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
            { name: "الرموز الشهرية", free: "20,000", base: "50,000", pro: "100,000", business: "200,000" },
            { name: "رموز إضافية", free: "غير متاح", base: "0.05 ر.س لكل رمز", pro: "0.04 ر.س لكل رمز", business: "0.03 ر.س لكل رمز" }
          ]
        },
        socialContent: {
          title: "محتوى وسائل التواصل الاجتماعي بالذكاء الاصطناعي",
          items: [
            { name: "حد الإنتاج", free: "10", base: "30", pro: "غير محدود", business: "غير محدود" },
            { name: "إنشاء التسميات والصور والفيديو", free: true, base: true, pro: true, business: true },
            { name: "أفكار مخصصة للعلامة التجارية", free: false, base: true, pro: true, business: true },
            { name: "اقتراحات الترند بالذكاء الاصطناعي", free: false, base: true, pro: true, business: true },
            { name: "تحويل الرابط إلى منشور", free: false, base: true, pro: true, business: true },
            { name: "إنشاء الهاشتاجات", free: true, base: true, pro: true, business: true },
            { name: "أداة التصميم المدمجة", free: false, base: true, pro: true, business: true }
          ]
        },
        socialPoster: {
          title: "ناشر وسائل التواصل الاجتماعي",
          items: [
            { name: "ملفات وسائل التواصل للنشر", free: "1", base: "5", pro: "10 (المزيد عند الطلب)", business: "10 (المزيد عند الطلب)" },
            { name: "المنشورات المجدولة شهرياً", free: "10", base: "50", pro: "غير محدود", business: "غير محدود" },
            { name: "التقويم التفاعلي", free: false, base: true, pro: true, business: true },
            { name: "اقتراحات أفضل وقت للنشر", free: false, base: true, pro: true, business: true },
            { name: "قصص إنستغرام والتعليق الأول", free: false, base: true, pro: true, business: true },
            { name: "تكامل Bitly ومولد كود UTM", free: false, base: true, pro: true, business: true },
            { name: "الوسوم", free: false, base: true, pro: true, business: true },
            { name: "خلاصة RSS مخصصة", free: false, base: true, pro: true, business: true }
          ]
        },
        socialTracker: {
          title: "متتبع وسائل التواصل الاجتماعي",
          items: [
            { name: "ملفات وسائل التواصل للمراقبة", free: "2", base: "10", pro: "20 (المزيد عند الطلب)", business: "20 (المزيد عند الطلب)" },
            { name: "تحليل أداء المنافسين", free: false, base: false, pro: true, business: true },
            { name: "مراقبة محتوى المنافسين", free: false, base: false, pro: true, business: true },
            { name: "عرض المقارنة", free: false, base: false, pro: true, business: true },
            { name: "البيانات التاريخية", free: false, base: false, pro: true, business: true },
            { name: "تقارير البريد الإلكتروني", free: false, base: false, pro: true, business: true },
            { name: "تقارير CSV وPDF بالعلامة البيضاء", free: false, base: false, pro: true, business: true }
          ]
        },
        socialAnalytics: {
          title: "تحليلات وسائل التواصل الاجتماعي",
          items: [
            { name: "الأداء حسب المنصة", free: false, base: false, pro: true, business: true },
            { name: "تحليلات المنشورات", free: false, base: false, pro: true, business: true },
            { name: "الاحتفاظ بالبيانات", free: "7 أيام", base: "30 يوم", pro: "24 شهر", business: "24 شهر" },
            { name: "تقارير البريد الإلكتروني", free: false, base: false, pro: true, business: true },
            { name: "تقارير CSV وPDF بالعلامة البيضاء", free: false, base: false, pro: true, business: true }
          ]
        },
        contentInsights: {
          title: "رؤى المحتوى الاجتماعي",
          items: [
            { name: "الأداء حسب المنصة", free: false, base: false, pro: true, business: true },
            { name: "الأداء حسب الوسم", free: false, base: false, pro: true, business: true },
            { name: "الأداء حسب نوع المنشور", free: false, base: false, pro: true, business: true }
          ]
        },
        influencerAnalytics: {
          title: "تحليلات المؤثرين",
          items: [
            { name: "اكتشاف المؤثرين", free: false, base: false, pro: false, business: true },
            { name: "تحليلات الأداء", free: false, base: false, pro: false, business: true },
            { name: "إدارة الحملات", free: false, base: false, pro: false, business: "إضافة" },
            { name: "بحث المنافسين", free: false, base: false, pro: false, business: "إضافة" }
          ]
        },
        mediaMonitoring: {
          title: "مراقبة الوسائط",
          items: [
            { name: "الكلمات المفتاحية للمراقبة", free: false, base: false, pro: false, business: "2 (المزيد عند الطلب)" },
            { name: "تحليل المشاعر", free: false, base: false, pro: false, business: true },
            { name: "ترند الوصول", free: false, base: false, pro: false, business: true },
            { name: "تقارير البريد الإلكتروني", free: false, base: false, pro: false, business: true }
          ]
        },
        reporting: {
          title: "التقارير",
          items: [
            { name: "التقارير الأساسية", free: "1", base: "2", pro: "2", business: "2" }
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
          id: 'free',
          name: "Free",
          description: "For new users and trial",
          price: "0 SAR",
          period: "monthly",
          buttonText: "Start Free",
          popular: false,
          icon: Gift
        },
        {
          id: 'base',
          name: "Base",
          description: "For startups",
          price: "749 SAR",
          period: "monthly",
          buttonText: "Get Started",
          popular: false,
          icon: Shield
        },
        {
          id: 'pro',
          name: "Pro",
          description: "Most popular for medium businesses",
          price: "899 SAR",
          originalPrice: "1,999 SAR",
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
            { name: "Monthly tokens", free: "20,000", base: "50,000", pro: "100,000", business: "200,000" },
            { name: "Additional tokens", free: "Not available", base: "0.05 SAR per token", pro: "0.04 SAR per token", business: "0.03 SAR per token" }
          ]
        },
        socialContent: {
          title: "Social Content AI",
          items: [
            { name: "Generation limit", free: "10", base: "30", pro: "unlimited", business: "unlimited" },
            { name: "Caption, image, and video generation", free: true, base: true, pro: true, business: true },
            { name: "AI-generated ideas tailored to your brand", free: false, base: true, pro: true, business: true },
            { name: "AI trend suggestions", free: false, base: true, pro: true, business: true },
            { name: "URL into social media post", free: false, base: true, pro: true, business: true },
            { name: "Hashtag generation", free: true, base: true, pro: true, business: true },
            { name: "Built-in graphic design tool", free: false, base: true, pro: true, business: true }
          ]
        },
        socialPoster: {
          title: "Social Poster",
          items: [
            { name: "Social media profiles for posting", free: "1", base: "5", pro: "10 (more upon request)", business: "10 (more upon request)" },
            { name: "Posts to schedule per month", free: "10", base: "50", pro: "unlimited", business: "unlimited" },
            { name: "Interactive calendar", free: false, base: true, pro: true, business: true },
            { name: "Best time to post suggestions", free: false, base: true, pro: true, business: true },
            { name: "Instagram stories, first comment, and link in bio", free: false, base: true, pro: true, business: true },
            { name: "Bitly integration and UTM code generator", free: false, base: true, pro: true, business: true },
            { name: "Tagging", free: false, base: true, pro: true, business: true },
            { name: "Custom RSS feed", free: false, base: true, pro: true, business: true }
          ]
        },
        socialTracker: {
          title: "Social Tracker",
          items: [
            { name: "Social media profiles for monitoring", free: "2", base: "10", pro: "20 (more upon request)", business: "20 (more upon request)" },
            { name: "Competitor performance analysis", free: false, base: false, pro: true, business: true },
            { name: "Competitor content monitoring", free: false, base: false, pro: true, business: true },
            { name: "Compare view", free: false, base: false, pro: true, business: true },
            { name: "Historical data", free: false, base: false, pro: true, business: true },
            { name: "Email reports", free: false, base: false, pro: true, business: true },
            { name: "CSV and white-labeled PDF reports", free: false, base: false, pro: true, business: true }
          ]
        },
        socialAnalytics: {
          title: "Social Analytics",
          items: [
            { name: "Performance by social media platform", free: false, base: false, pro: true, business: true },
            { name: "Post analytics", free: false, base: false, pro: true, business: true },
            { name: "Data retention", free: "7 days", base: "30 days", pro: "24 months", business: "24 months" },
            { name: "Email reports", free: false, base: false, pro: true, business: true },
            { name: "CSV and white-labeled PDF reports", free: false, base: false, pro: true, business: true }
          ]
        },
        contentInsights: {
          title: "Social Content Insights",
          items: [
            { name: "Performance by social media platform", free: false, base: false, pro: true, business: true },
            { name: "Performance by tag", free: false, base: false, pro: true, business: true },
            { name: "Performance by post type", free: false, base: false, pro: true, business: true }
          ]
        },
        influencerAnalytics: {
          title: "Influencer Analytics",
          items: [
            { name: "Influencer discovery", free: false, base: false, pro: false, business: true },
            { name: "Performance analytics", free: false, base: false, pro: false, business: true },
            { name: "Campaign management", free: false, base: false, pro: false, business: "add-on" },
            { name: "Competitor research", free: false, base: false, pro: false, business: "add-on" }
          ]
        },
        mediaMonitoring: {
          title: "Media Monitoring",
          items: [
            { name: "Keywords to monitor", free: false, base: false, pro: false, business: "2 (more upon request)" },
            { name: "Sentiment analysis", free: false, base: false, pro: false, business: true },
            { name: "Reach trend", free: false, base: false, pro: false, business: true },
            { name: "Email reports", free: false, base: false, pro: false, business: true }
          ]
        },
        reporting: {
          title: "Reporting",
          items: [
            { name: "Base reports", free: "1", base: "2", pro: "2", business: "2" }
          ]
        }
      }
    }
  };
