
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
          name: "الأساسي",
          description: "للأفراد والشركات الناشئة",
          price: "199$",
          period: "شهرياً",
          buttonText: "ابدأ الآن",
          popular: false
        },
        {
          name: "الاحترافي",
          description: "للشركات المتنامية",
          price: "299$",
          period: "شهرياً",
          buttonText: "ابدأ الآن",
          popular: true
        },
        {
          name: "الأعمال",
          description: "للمؤسسات الكبيرة",
          price: "399$",
          period: "شهرياً",
          buttonText: "تواصل معنا",
          popular: false
        }
      ],
      features: {
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
            { name: "تحليل أداء المنافسين", base: true, pro: true, business: true },
            { name: "مراقبة محتوى المنافسين", base: true, pro: true, business: true },
            { name: "عرض المقارنة", base: true, pro: true, business: true },
            { name: "البيانات التاريخية", base: true, pro: true, business: true },
            { name: "تقارير البريد الإلكتروني", base: true, pro: true, business: true },
            { name: "تقارير CSV وPDF بالعلامة البيضاء", base: true, pro: true, business: true }
          ]
        },
        socialAnalytics: {
          title: "تحليلات وسائل التواصل الاجتماعي",
          items: [
            { name: "الأداء حسب المنصة", base: true, pro: true, business: true },
            { name: "تحليلات المنشورات", base: true, pro: true, business: true },
            { name: "الاحتفاظ بالبيانات", base: "24 شهر", pro: "24 شهر", business: "24 شهر" },
            { name: "تقارير البريد الإلكتروني", base: true, pro: true, business: true },
            { name: "تقارير CSV وPDF بالعلامة البيضاء", base: true, pro: true, business: true }
          ]
        },
        contentInsights: {
          title: "رؤى المحتوى الاجتماعي",
          items: [
            { name: "الأداء حسب المنصة", base: true, pro: true, business: true },
            { name: "الأداء حسب الوسم", base: true, pro: true, business: true },
            { name: "الأداء حسب نوع المنشور", base: true, pro: true, business: true }
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
      note: "* Prices do not include VAT. Monthly subscription can be cancelled anytime, price remains fixed as long as subscription is active.",
      plans: [
        {
          name: "Base",
          description: "For individuals and startups",
          price: "$199",
          period: "monthly",
          buttonText: "Get Started",
          popular: false
        },
        {
          name: "Pro",
          description: "For growing businesses",
          price: "$299",
          period: "monthly",
          buttonText: "Get Started",
          popular: true
        },
        {
          name: "Business",
          description: "For large enterprises",
          price: "$399",
          period: "monthly",
          buttonText: "Contact Us",
          popular: false
        }
      ],
      features: {
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
            { name: "Competitor performance analysis", base: true, pro: true, business: true },
            { name: "Competitor content monitoring", base: true, pro: true, business: true },
            { name: "Compare view", base: true, pro: true, business: true },
            { name: "Historical data", base: true, pro: true, business: true },
            { name: "Email reports", base: true, pro: true, business: true },
            { name: "CSV and white-labeled PDF reports", base: true, pro: true, business: true }
          ]
        },
        socialAnalytics: {
          title: "Social Analytics",
          items: [
            { name: "Performance by social media platform", base: true, pro: true, business: true },
            { name: "Post analytics", base: true, pro: true, business: true },
            { name: "Data retention", base: "24 months", pro: "24 months", business: "24 months" },
            { name: "Email reports", base: true, pro: true, business: true },
            { name: "CSV and white-labeled PDF reports", base: true, pro: true, business: true }
          ]
        },
        contentInsights: {
          title: "Social Content Insights",
          items: [
            { name: "Performance by social media platform", base: true, pro: true, business: true },
            { name: "Performance by tag", base: true, pro: true, business: true },
            { name: "Performance by post type", base: true, pro: true, business: true }
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

  const t = content[language];

  const renderFeatureValue = (feature: any, plan: 'base' | 'pro' | 'business') => {
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
                            {renderFeatureValue(feature, 'base')}
                          </td>
                          <td className="py-4 text-center">
                            {renderFeatureValue(feature, 'pro')}
                          </td>
                          <td className="py-4 text-center">
                            {renderFeatureValue(feature, 'business')}
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
