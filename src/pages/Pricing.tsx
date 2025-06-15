
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Pricing = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الأسعار",
      subtitle: "اختر الباقة المناسبة لنمو عملك",
      note: "* الأسعار لا تشمل ضريبة القيمة المضافة. الاشتراك شهري قابل للإلغاء في أي وقت، والسعر ثابت طالما الاشتراك فعّال.",
      plans: [
        {
          name: "المؤسِّس",
          description: "روّاد الأعمال والشركات الناشئة",
          price: "1,870 ريال",
          period: "شهرياً",
          features: [
            "٩ وكلاء AI",
            "مصادر بيانات غير محدودة", 
            "Active Dashboard™",
            "دعم 24/7"
          ],
          buttonText: "ابدأ تجربتك المجانية",
          popular: true
        },
        {
          name: "الأعمال",
          description: "شركات تنمو بسرعة وفرق تسويق",
          price: "3,990 ريال",
          period: "شهرياً",
          features: [
            "كل ما في المؤسِّس",
            "5 مقاعد فريق",
            "تقارير بيضاء العلامة",
            "تكامل ERP"
          ],
          buttonText: "ابدأ تجربتك المجانية",
          popular: false
        },
        {
          name: "المؤسسة",
          description: "مجموعات كبرى ووكالات",
          price: "سعر مخصّص",
          period: "",
          features: [
            "كل شيء بلا حدود",
            "API كامل",
            "مدير نجاح مخصّص",
            "تخصيص كامل"
          ],
          buttonText: "تواصل معنا",
          popular: false
        }
      ]
    },
    en: {
      title: "Pricing",
      subtitle: "Choose the right plan for your business growth",
      note: "* Prices do not include VAT. Monthly subscription can be cancelled anytime, price remains fixed as long as subscription is active.",
      plans: [
        {
          name: "Founder",
          description: "Entrepreneurs and startups",
          price: "1,870 SAR",
          period: "monthly",
          features: [
            "9 AI Agents",
            "Unlimited data sources",
            "Active Dashboard™", 
            "24/7 Support"
          ],
          buttonText: "Start Free Trial",
          popular: true
        },
        {
          name: "Business",
          description: "Fast-growing companies and marketing teams",
          price: "3,990 SAR",
          period: "monthly",
          features: [
            "Everything in Founder",
            "5 team seats",
            "White label reports",
            "ERP integration"
          ],
          buttonText: "Start Free Trial",
          popular: false
        },
        {
          name: "Enterprise",
          description: "Large corporations and agencies",
          price: "Custom pricing",
          period: "",
          features: [
            "Everything unlimited",
            "Full API access",
            "Dedicated success manager",
            "Full customization"
          ],
          buttonText: "Contact Us",
          popular: false
        }
      ]
    }
  };

  const t = content[language];

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {t.plans.map((plan, index) => (
              <Card key={index} className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-blue-500 shadow-lg' : ''
              } ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                {plan.popular && (
                  <div className={`absolute -top-4 ${isRTL ? 'right-4' : 'left-4'} bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium`}>
                    الأكثر شعبية
                  </div>
                )}
                <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
                  <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </CardTitle>
                  <CardDescription className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${
                        isRTL ? 'mr-2' : 'ml-2'
                      }`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-center gap-3 ${
                        isRTL ? 'flex-row-reverse text-right' : 'text-left'
                      }`}>
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} max-w-4xl ${
              isRTL ? 'mr-auto' : 'ml-auto'
            }`}>
              {t.note}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
