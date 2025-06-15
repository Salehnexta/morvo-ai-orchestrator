
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Brain, Zap, Target, BarChart, Shield, Clock, Globe } from "lucide-react";

export const Features = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "المميزات",
      subtitle: "اكتشف قوة الذكاء الاصطناعي في التسويق",
      features: [
        {
          icon: Bot,
          title: "9 عملاء ذكاء اصطناعي",
          description: "فريق متكامل من عملاء الذكاء الاصطناعي يعمل على مدار الساعة لتنفيذ استراتيجيتك التسويقية"
        },
        {
          icon: Brain,
          title: "تعلم ذكي",
          description: "يتعلم من بياناتك ويحسن الأداء تلقائياً مع كل تفاعل"
        },
        {
          icon: Zap,
          title: "أسرع 100 مرة",
          description: "سرعة تنفيذ استثنائية مقارنة بالطرق التقليدية"
        },
        {
          icon: Target,
          title: "استهداف دقيق",
          description: "وصول للجمهور المناسب في الوقت المناسب بدقة 94%"
        },
        {
          icon: BarChart,
          title: "تحليلات متقدمة",
          description: "رؤى عميقة وتقارير شاملة لقياس الأداء"
        },
        {
          icon: Shield,
          title: "أمان عالي",
          description: "حماية متقدمة لبياناتك واستراتيجياتك التسويقية"
        },
        {
          icon: Clock,
          title: "متاح 24/7",
          description: "يعمل دون توقف لضمان استمرارية حملاتك التسويقية"
        },
        {
          icon: Globe,
          title: "دعم متعدد اللغات",
          description: "يدعم العربية والإنجليزية وعدة لغات أخرى"
        }
      ]
    },
    en: {
      title: "Features",
      subtitle: "Discover the power of AI in marketing",
      features: [
        {
          icon: Bot,
          title: "9 AI Agents",
          description: "Complete team of AI agents working 24/7 to execute your marketing strategy"
        },
        {
          icon: Brain,
          title: "Smart Learning",
          description: "Learns from your data and automatically improves performance with every interaction"
        },
        {
          icon: Zap,
          title: "100x Faster",
          description: "Exceptional execution speed compared to traditional methods"
        },
        {
          icon: Target,
          title: "Precise Targeting",
          description: "Reach the right audience at the right time with 94% accuracy"
        },
        {
          icon: BarChart,
          title: "Advanced Analytics",
          description: "Deep insights and comprehensive reports to measure performance"
        },
        {
          icon: Shield,
          title: "High Security",
          description: "Advanced protection for your data and marketing strategies"
        },
        {
          icon: Clock,
          title: "Available 24/7",
          description: "Works non-stop to ensure continuity of your marketing campaigns"
        },
        {
          icon: Globe,
          title: "Multi-language Support",
          description: "Supports Arabic, English, and several other languages"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <MainLayout>
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.title}
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl ${
              isRTL ? 'mr-auto' : 'ml-auto'
            }`}>
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.map((feature, index) => (
              <Card key={index} className={`transition-all duration-300 hover:shadow-lg ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
              }`}>
                <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 ${
                    isRTL ? 'mr-auto' : 'ml-0'
                  }`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${
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
