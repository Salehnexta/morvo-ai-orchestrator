
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

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
          buttonText: "ابدأ الآن",
          popular: true
        },
        {
          name: "الأعمال",
          description: "شركات تنمو بسرعة وفرق تسويق",
          price: "3,990 ريال",
          period: "شهرياً",
          buttonText: "ابدأ الآن",
          popular: false
        },
        {
          name: "المؤسسة",
          description: "مجموعات كبرى ووكالات",
          price: "سعر مخصّص",
          period: "",
          buttonText: "تواصل معنا",
          popular: false
        }
      ],
      features: {
        sources: {
          title: "المصادر",
          items: [
            { name: "فيسبوك", founder: true, business: true, enterprise: true },
            { name: "إنستغرام", founder: true, business: true, enterprise: true },
            { name: "X (تويتر)", founder: true, business: true, enterprise: true },
            { name: "الأخبار", founder: true, business: true, enterprise: true },
            { name: "المدونات", founder: true, business: true, enterprise: true },
            { name: "منصات اجتماعية أخرى", founder: true, business: true, enterprise: true },
            { name: "Reddit", founder: true, business: true, enterprise: true },
            { name: "لينكدإن", founder: false, business: true, enterprise: true },
            { name: "Medium", founder: false, business: true, enterprise: true },
            { name: "Quora", founder: false, business: true, enterprise: true },
            { name: "يوتيوب", founder: false, business: true, enterprise: true },
            { name: "تيك توك", founder: false, business: true, enterprise: true },
            { name: "المراجعات", founder: false, business: false, enterprise: true },
            { name: "Twitch", founder: false, business: false, enterprise: true },
            { name: "النشرات الإخبارية", founder: false, business: false, enterprise: true }
          ]
        },
        analytics: {
          title: "التحليلات",
          items: [
            { name: "حجم الذِّكر", founder: "2K ذكر/شهر", business: "10K ذكر/شهر", enterprise: "غير محدود" },
            { name: "تتبع التفاعل", founder: true, business: true, enterprise: true },
            { name: "تتبع الوصول", founder: true, business: true, enterprise: true },
            { name: "التحديث", founder: "كل 12 ساعة", business: "كل ساعة", enterprise: "فوري" },
            { name: "وكلاء AI", founder: "9 وكلاء", business: "9 وكلاء", enterprise: "غير محدود" },
            { name: "Active Dashboard™", founder: true, business: true, enterprise: true },
            { name: "تحليل المشاعر بـ AI", founder: true, business: true, enterprise: true },
            { name: "كشف الأحداث", founder: true, business: true, enterprise: true },
            { name: "مساعد العلامة التجارية AI", founder: "محدود", business: "متقدم", enterprise: "كامل" }
          ]
        },
        reporting: {
          title: "التقارير والتنبيهات",
          items: [
            { name: "تقارير يومية", founder: true, business: true, enterprise: true },
            { name: "تقارير أسبوعية", founder: true, business: true, enterprise: true },
            { name: "تنبيهات الأزمات", founder: true, business: true, enterprise: true },
            { name: "تنبيهات الجوال", founder: true, business: true, enterprise: true },
            { name: "تكامل Slack/Teams", founder: false, business: true, enterprise: true },
            { name: "تقارير بيضاء العلامة", founder: false, business: true, enterprise: true },
            { name: "تقارير Excel", founder: false, business: true, enterprise: true },
            { name: "عروض PowerPoint", founder: false, business: true, enterprise: true }
          ]
        },
        support: {
          title: "الدعم والتكامل",
          items: [
            { name: "دعم 24/7", founder: true, business: true, enterprise: true },
            { name: "مقاعد الفريق", founder: "1 مقعد", business: "5 مقاعد", enterprise: "غير محدود" },
            { name: "تكامل ERP", founder: false, business: true, enterprise: true },
            { name: "API كامل", founder: false, business: false, enterprise: true },
            { name: "مدير نجاح مخصّص", founder: false, business: false, enterprise: true },
            { name: "تخصيص كامل", founder: false, business: false, enterprise: true }
          ]
        }
      }
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
          buttonText: "Get Started",
          popular: true
        },
        {
          name: "Business",
          description: "Fast-growing companies and marketing teams",
          price: "3,990 SAR",
          period: "monthly",
          buttonText: "Get Started",
          popular: false
        },
        {
          name: "Enterprise",
          description: "Large corporations and agencies",
          price: "Custom pricing",
          period: "",
          buttonText: "Contact Us",
          popular: false
        }
      ],
      features: {
        sources: {
          title: "Sources",
          items: [
            { name: "Facebook", founder: true, business: true, enterprise: true },
            { name: "Instagram", founder: true, business: true, enterprise: true },
            { name: "X (Twitter)", founder: true, business: true, enterprise: true },
            { name: "News", founder: true, business: true, enterprise: true },
            { name: "Blogs", founder: true, business: true, enterprise: true },
            { name: "Other Socials", founder: true, business: true, enterprise: true },
            { name: "Reddit", founder: true, business: true, enterprise: true },
            { name: "LinkedIn", founder: false, business: true, enterprise: true },
            { name: "Medium", founder: false, business: true, enterprise: true },
            { name: "Quora", founder: false, business: true, enterprise: true },
            { name: "YouTube", founder: false, business: true, enterprise: true },
            { name: "TikTok", founder: false, business: true, enterprise: true },
            { name: "Reviews", founder: false, business: false, enterprise: true },
            { name: "Twitch", founder: false, business: false, enterprise: true },
            { name: "Newsletters", founder: false, business: false, enterprise: true }
          ]
        },
        analytics: {
          title: "Analytics",
          items: [
            { name: "Mentions Volume", founder: "2K mentions/mo", business: "10K mentions/mo", enterprise: "Unlimited" },
            { name: "Engagement Tracking", founder: true, business: true, enterprise: true },
            { name: "Reach Tracking", founder: true, business: true, enterprise: true },
            { name: "Update Frequency", founder: "Every 12h", business: "Every hour", enterprise: "Real-time" },
            { name: "AI Agents", founder: "9 agents", business: "9 agents", enterprise: "Unlimited" },
            { name: "Active Dashboard™", founder: true, business: true, enterprise: true },
            { name: "AI Sentiment Analysis", founder: true, business: true, enterprise: true },
            { name: "Events Detection", founder: true, business: true, enterprise: true },
            { name: "AI Brand Assistant", founder: "Limited", business: "Advanced", enterprise: "Full" }
          ]
        },
        reporting: {
          title: "Reporting & Alerts",
          items: [
            { name: "Daily Reports", founder: true, business: true, enterprise: true },
            { name: "Weekly Reports", founder: true, business: true, enterprise: true },
            { name: "Storm Alerts", founder: true, business: true, enterprise: true },
            { name: "Push Notifications", founder: true, business: true, enterprise: true },
            { name: "Slack/Teams Integration", founder: false, business: true, enterprise: true },
            { name: "White-label Reports", founder: false, business: true, enterprise: true },
            { name: "Excel Reports", founder: false, business: true, enterprise: true },
            { name: "PowerPoint Presentations", founder: false, business: true, enterprise: true }
          ]
        },
        support: {
          title: "Support & Integration",
          items: [
            { name: "24/7 Support", founder: true, business: true, enterprise: true },
            { name: "Team Seats", founder: "1 seat", business: "5 seats", enterprise: "Unlimited" },
            { name: "ERP Integration", founder: false, business: true, enterprise: true },
            { name: "Full API Access", founder: false, business: false, enterprise: true },
            { name: "Dedicated Success Manager", founder: false, business: false, enterprise: true },
            { name: "Full Customization", founder: false, business: false, enterprise: true }
          ]
        }
      }
    }
  };

  const t = content[language];

  const renderFeatureValue = (feature: any, plan: 'founder' | 'business' | 'enterprise') => {
    const value = feature[plan];
    
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-400 mx-auto" />
      );
    }
    
    if (typeof value === 'string') {
      return (
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {value}
        </span>
      );
    }
    
    return null;
  };

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

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {t.plans.map((plan, index) => (
              <Card key={index} className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-blue-500 shadow-lg transform scale-105' : ''
              } ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                {plan.popular && (
                  <div className={`absolute -top-4 ${isRTL ? 'right-4' : 'left-4'} bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium`}>
                    {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                  </div>
                )}
                <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
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

          {/* Feature Comparison Table */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-8`}>
            <h2 className={`text-2xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'ar' ? 'مقارنة تفصيلية للمزايا' : 'Detailed Feature Comparison'}
            </h2>
            
            {Object.entries(t.features).map(([categoryKey, category]) => (
              <div key={categoryKey} className="mb-12">
                <h3 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {category.title}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <th className={`${isRTL ? 'text-right' : 'text-left'} py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {language === 'ar' ? 'الميزة' : 'Feature'}
                        </th>
                        <th className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {t.plans[0].name}
                        </th>
                        <th className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {t.plans[1].name}
                        </th>
                        <th className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {t.plans[2].name}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((feature, featureIndex) => (
                        <tr key={featureIndex} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className={`py-4 ${isRTL ? 'text-right' : 'text-left'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {feature.name}
                          </td>
                          <td className="py-4 text-center">
                            {renderFeatureValue(feature, 'founder')}
                          </td>
                          <td className="py-4 text-center">
                            {renderFeatureValue(feature, 'business')}
                          </td>
                          <td className="py-4 text-center">
                            {renderFeatureValue(feature, 'enterprise')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center mt-12 ${isRTL ? 'text-right' : 'text-left'}`}>
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
