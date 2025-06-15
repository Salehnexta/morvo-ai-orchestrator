import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Brain, Zap, Target, BarChart, Shield, Clock, Globe, Activity } from "lucide-react";

export const Features = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "المميزات",
      subtitle: "لوحة قيادة حيّة يقودها ذكاء صناعي فائق",
      features: [
        {
          icon: Activity,
          title: "Active Dashboard™",
          description: "أرقام لحظيّة وتوصيات جاهزة بدون تحديث يدوي"
        },
        {
          icon: Bot,
          title: "٩ وكلاء AI متخصّصون",
          description: "SEO، محتوى، إعلانات، بيانات… يتواصلون عبر بروتوكول A2A ويتشاركون الذاكرة عبر MCP"
        },
        {
          icon: Globe,
          title: "مسح 24 قناة رقمية",
          description: "فيسبوك، إنستغرام، تويتر، تيك توك، يوتيوب، لينكدإن، Reddit، المدونات، الأخبار، البودكاست… كلّها في مكان واحد"
        },
        {
          icon: BarChart,
          title: "تحليلات ذكيّة متكاملة",
          description: "حجم الذِّكر، التفاعل، الوصول، سحابة الكلمات، تحليل المؤثّرين، Presence Score، وقيمة AVE الإعلانية"
        },
        {
          icon: Brain,
          title: "ذكاء مشاعر ومواضيع",
          description: "يلتقط المزاج العام (إيجابي/سلبي) ويكشف الترندات قبل المنافسين"
        },
        {
          icon: Zap,
          title: "AI Insights & Alerts",
          description: "نصائح تنفيذية وتنبيهات أزمات لحظيّة مع خطّة استجابة مقترَحة"
        },
        {
          icon: Target,
          title: "تقارير بيضاء العلامة",
          description: "PDF، Excel، PowerPoint جاهزة لعملائك بعلامتك الخاصّة"
        },
        {
          icon: Clock,
          title: "تكاملات سريعة",
          description: "Slack، Microsoft Teams، WooCommerce، Shopify، Zapier"
        },
        {
          icon: Shield,
          title: "أمان على مستوى المؤسسات",
          description: "تشفير 256-bit، توافق GDPR و ISO 27001"
        }
      ]
    },
    en: {
      title: "Features",
      subtitle: "Live command center powered by superior artificial intelligence",
      features: [
        {
          icon: Activity,
          title: "Active Dashboard™",
          description: "Real-time numbers and ready recommendations without manual updates"
        },
        {
          icon: Bot,
          title: "9 Specialized AI Agents",
          description: "SEO, content, ads, data... communicating via A2A protocol and sharing memory via MCP"
        },
        {
          icon: Globe,
          title: "24 Digital Channel Scanning",
          description: "Facebook, Instagram, Twitter, TikTok, YouTube, LinkedIn, Reddit, blogs, news, podcasts... all in one place"
        },
        {
          icon: BarChart,
          title: "Integrated Smart Analytics",
          description: "Mention volume, engagement, reach, word clouds, influencer analysis, Presence Score, and AVE advertising value"
        },
        {
          icon: Brain,
          title: "Sentiment & Topic Intelligence",
          description: "Captures general mood (positive/negative) and discovers trends before competitors"
        },
        {
          icon: Zap,
          title: "AI Insights & Alerts",
          description: "Actionable advice and instant crisis alerts with suggested response plan"
        },
        {
          icon: Target,
          title: "White Label Reports",
          description: "PDF, Excel, PowerPoint ready for your clients with your own branding"
        },
        {
          icon: Clock,
          title: "Quick Integrations",
          description: "Slack, Microsoft Teams, WooCommerce, Shopify, Zapier"
        },
        {
          icon: Shield,
          title: "Enterprise-Level Security",
          description: "256-bit encryption, GDPR and ISO 27001 compliance"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <MainLayout>
      <div className={`py-16 font-cairo ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16`}>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 font-cairo ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.title}
            </h1>
            <p className={`text-xl font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.map((feature, index) => (
              <Card key={index} className={`transition-all duration-300 hover:shadow-lg font-cairo ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
              }`}>
                <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 ${
                    isRTL ? 'mr-auto' : 'ml-0'
                  }`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className={`font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Features;
