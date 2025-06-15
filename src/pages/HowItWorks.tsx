
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Play, Settings, BarChart, Rocket, Clock, Zap } from "lucide-react";

export const HowItWorks = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "كيف يعمل مورفو",
      subtitle: "6 خطوات بسيطة للحصول على ذكاء تسويقي فائق",
      steps: [
        {
          icon: Clock,
          title: "تسجيل فوري (≤ 2 دقيقة)",
          description: "املأ بريدك → تبدأ فترة تجريبية مجانية 14 يوماً",
          number: "01"
        },
        {
          icon: Settings,
          title: "ربط القنوات بضغطة",
          description: "شبّك حساباتك الاجتماعيّة ومتجرك الإلكتروني؛ يبدأ جمع البيانات مباشرة",
          number: "02"
        },
        {
          icon: BarChart,
          title: "تعلّم تلقائي",
          description: "وكلاء AI يتبادلون المعرفة عبر A2A، وMCP يبني ملفاً حيّاً لكل منتج وجمهور",
          number: "03"
        },
        {
          icon: Play,
          title: "لوحة تتحرّك أمامك",
          description: "تشاهد الإحصاءات تتحدّث كل ثانية بدون أي تحديث يدوي",
          number: "04"
        },
        {
          icon: Zap,
          title: "أوامر طبيعية",
          description: "قل: «فعّل حملة خصم 20 ٪» → مورفو يوزّع الميزانية ويجدول المحتوى أوتوماتيكياً",
          number: "05"
        },
        {
          icon: Rocket,
          title: "ذكاء ينمو يومياً",
          description: "كل تفاعل جديد = توصية أذكى، وكل حملة ناجحة = خوارزمية أدقّ",
          number: "06"
        }
      ]
    },
    en: {
      title: "How Morvo Works",
      subtitle: "6 simple steps to get superior marketing intelligence",
      steps: [
        {
          icon: Clock,
          title: "Instant Registration (≤ 2 minutes)",
          description: "Fill in your email → Start a free 14-day trial",
          number: "01"
        },
        {
          icon: Settings,
          title: "One-Click Channel Connection",
          description: "Connect your social accounts and e-store; data collection starts immediately",
          number: "02"
        },
        {
          icon: BarChart,
          title: "Automatic Learning",
          description: "AI agents exchange knowledge via A2A, and MCP builds a live profile for each product and audience",
          number: "03"
        },
        {
          icon: Play,
          title: "Dashboard That Moves Before You",
          description: "Watch statistics update every second without any manual refresh",
          number: "04"
        },
        {
          icon: Zap,
          title: "Natural Commands",
          description: "Say: 'Activate 20% discount campaign' → Morvo distributes budget and schedules content automatically",
          number: "05"
        },
        {
          icon: Rocket,
          title: "Intelligence That Grows Daily",
          description: "Every new interaction = smarter recommendation, every successful campaign = more accurate algorithm",
          number: "06"
        }
      ]
    }
  };

  const t = content[language];
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <MainLayout>
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
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

          <div className="space-y-12">
            {t.steps.map((step, index) => (
              <div key={index} className={`flex items-center gap-8 ${
                index % 2 === 1 && !isRTL ? 'flex-row-reverse' : ''
              } ${index % 2 === 1 && isRTL ? 'flex-row' : ''}`}>
                <div className="flex-1">
                  <Card className={`transition-all duration-300 hover:shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'
                  }`}>
                    <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
                      <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className={`text-6xl font-bold text-gray-300 ${theme === 'dark' ? 'text-gray-600' : ''}`}>
                          {step.number}
                        </div>
                      </div>
                      <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}>
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
                
                {index < t.steps.length - 1 && (
                  <div className={`hidden md:flex ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                    <ArrowIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HowItWorks;
