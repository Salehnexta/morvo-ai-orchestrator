
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export const Pricing = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الأسعار",
      subtitle: "اختر الباقة المناسبة لعملك",
      monthly: "شهرياً",
      yearly: "سنوياً",
      save: "وفر 20%",
      getStarted: "ابدأ الآن",
      popular: "الأكثر شعبية",
      plans: [
        {
          name: "المبتدئ",
          price: "99",
          period: "شهر",
          description: "مثالي للشركات الصغيرة",
          features: [
            "3 عملاء ذكاء اصطناعي",
            "1000 تفاعل شهرياً",
            "تقارير أساسية",
            "دعم فني عبر البريد",
            "تكامل مع منصة واحدة"
          ]
        },
        {
          name: "المحترف",
          price: "299",
          period: "شهر",
          description: "الأنسب للشركات المتوسطة",
          features: [
            "6 عملاء ذكاء اصطناعي",
            "5000 تفاعل شهرياً",
            "تقارير متقدمة",
            "دعم فني مباشر",
            "تكامل مع 5 منصات",
            "تحليلات تنبؤية"
          ],
          popular: true
        },
        {
          name: "المؤسسي",
          price: "699",
          period: "شهر",
          description: "للشركات الكبيرة والمؤسسات",
          features: [
            "9 عملاء ذكاء اصطناعي",
            "تفاعلات غير محدودة",
            "تقارير مخصصة",
            "مدير حساب مخصص",
            "تكامل غير محدود",
            "تحليلات الذكاء الاصطناعي",
            "API مخصص"
          ]
        }
      ]
    },
    en: {
      title: "Pricing",
      subtitle: "Choose the right plan for your business",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save 20%",
      getStarted: "Get Started",
      popular: "Most Popular",
      plans: [
        {
          name: "Starter",
          price: "99",
          period: "month",
          description: "Perfect for small businesses",
          features: [
            "3 AI Agents",
            "1,000 interactions/month",
            "Basic reports",
            "Email support",
            "1 platform integration"
          ]
        },
        {
          name: "Professional",
          price: "299",
          period: "month",
          description: "Best for medium businesses",
          features: [
            "6 AI Agents",
            "5,000 interactions/month",
            "Advanced reports",
            "Live support",
            "5 platform integrations",
            "Predictive analytics"
          ],
          popular: true
        },
        {
          name: "Enterprise",
          price: "699",
          period: "month",
          description: "For large companies and enterprises",
          features: [
            "9 AI Agents",
            "Unlimited interactions",
            "Custom reports",
            "Dedicated account manager",
            "Unlimited integrations",
            "AI analytics",
            "Custom API"
          ]
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {t.plans.map((plan, index) => (
              <Card key={index} className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 scale-105' 
                  : ''
              } ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                {plan.popular && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${
                    isRTL ? 'right-1/2 translate-x-1/2' : ''
                  }`}>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      {t.popular}
                    </div>
                  </div>
                )}
                
                <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'} pt-8`}>
                  <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </CardTitle>
                  <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-gray-500 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                      /{plan.period}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {t.getStarted}
                  </Button>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className={`flex items-center gap-3 ${
                        isRTL ? 'flex-row-reverse text-right' : 'text-left'
                      }`}>
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
