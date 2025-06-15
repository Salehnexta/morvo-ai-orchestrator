
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Play, Settings, BarChart, Rocket } from "lucide-react";

export const HowItWorks = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "كيف يعمل مورفو",
      subtitle: "4 خطوات بسيطة لثورة تسويقية حقيقية",
      steps: [
        {
          icon: Play,
          title: "ابدأ رحلتك",
          description: "أنشئ حسابك واختر الباقة المناسبة لعملك. عملية بسيطة تستغرق دقائق قليلة",
          number: "01"
        },
        {
          icon: Settings,
          title: "اضبط الإعدادات",
          description: "حدد أهدافك التسويقية ودع عملاء الذكاء الاصطناعي يتعلمون من بياناتك وتفضيلاتك",
          number: "02"
        },
        {
          icon: BarChart,
          title: "راقب الأداء",
          description: "تابع النتائج في الوقت الفعلي واحصل على تقارير مفصلة عن أداء حملاتك",
          number: "03"
        },
        {
          icon: Rocket,
          title: "احصد النتائج",
          description: "شاهد نمو عملك مع زيادة العائد بنسبة 500% وتوفير 90% من الوقت والجهد",
          number: "04"
        }
      ]
    },
    en: {
      title: "How Morvo Works",
      subtitle: "4 simple steps to a real marketing revolution",
      steps: [
        {
          icon: Play,
          title: "Start Your Journey",
          description: "Create your account and choose the right package for your business. A simple process that takes just a few minutes",
          number: "01"
        },
        {
          icon: Settings,
          title: "Configure Settings",
          description: "Set your marketing goals and let AI agents learn from your data and preferences",
          number: "02"
        },
        {
          icon: BarChart,
          title: "Monitor Performance",
          description: "Track results in real-time and get detailed reports on your campaign performance",
          number: "03"
        },
        {
          icon: Rocket,
          title: "Reap Results",
          description: "Watch your business grow with 500% increase in ROI and 90% time and effort savings",
          number: "04"
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
