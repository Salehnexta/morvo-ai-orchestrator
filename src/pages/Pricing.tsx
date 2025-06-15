
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Star, Zap, Shield } from "lucide-react";

export const Pricing = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الأسعار",
      subtitle: "اختر الباقة المناسبة لنمو عملك",
      note: "* الأسعار تشمل ضريبة القيمة المضافة. الاشتراك شهري قابل للإلغاء في أي وقت، والسعر ثابت طالما الاشتراك فعّال.",
      plans: [
        {
          name: "الأساسي",
          description: "",
          price: "749 ر.س",
          period: "شهرياً",
          buttonText: "ابدأ الآن",
          popular: false,
          icon: Shield
        },
        {
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
          name: "Base",
          description: "For individuals and startups",
          price: "199 SAR",
          period: "monthly",
          buttonText: "Get Started",
          popular: false,
          icon: Shield
        },
        {
          name: "Pro",
          description: "For growing businesses",
          price: "299 SAR",
          period: "monthly",
          buttonText: "Get Started",
          popular: true,
          icon: Zap
        },
        {
          name: "Business",
          description: "For large enterprises",
          price: "399 SAR",
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

  const t = content[language as keyof typeof content];

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
        <span className={`text-sm font-medium font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {value}
        </span>
      );
    }
    
    return null;
  };

  return (
    <MainLayout>
      <div className={`min-h-screen font-cairo ${theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-10 ${isRTL ? 'right-10' : 'left-10'} w-72 h-72 ${
              theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-400/20'
            } rounded-full blur-3xl`}></div>
            <div className={`absolute bottom-10 ${isRTL ? 'left-10' : 'right-10'} w-96 h-96 ${
              theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/20'
            } rounded-full blur-3xl`}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header Section */}
            <div className={`text-center mb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex justify-center mb-6">
                <div className={`px-4 py-2 rounded-full text-sm font-medium font-cairo ${
                  theme === 'dark' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'bg-blue-100 text-blue-600 border border-blue-200'
                }`}>
                  {language === 'ar' ? 'الأسعار والباقات' : 'Pricing Plans'}
                </div>
              </div>
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-cairo ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              } leading-tight`}>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t.title}
                </span>
              </h1>
              <p className={`text-xl md:text-2xl font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto leading-relaxed`}>
                {t.subtitle}
              </p>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {t.plans.map((plan, index) => (
                <Card key={index} className={`relative group transition-all duration-500 hover:scale-105 font-cairo ${
                  plan.popular 
                    ? `border-2 ${theme === 'dark' 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-900/50 to-purple-900/50 shadow-2xl shadow-blue-500/20' 
                        : 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl shadow-blue-200/50'
                      }` 
                    : `${theme === 'dark' 
                        ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70' 
                        : 'bg-white/70 border-gray-200/50 hover:bg-white'
                      } backdrop-blur-sm`
                }`}>
                  {plan.popular && (
                    <div className={`absolute -top-4 ${isRTL ? 'right-1/2' : 'left-1/2'} transform ${isRTL ? 'translate-x-1/2' : '-translate-x-1/2'}`}>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold font-cairo shadow-lg flex items-center gap-2">
                        <Star className="w-4 h-4 fill-current" />
                        {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className={`text-center pb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        plan.popular
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                          : theme === 'dark' 
                            ? 'bg-gray-700' 
                            : 'bg-gray-100'
                      }`}>
                        <plan.icon className={`w-8 h-8 ${
                          plan.popular ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                    <CardTitle className={`text-3xl mb-2 font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </CardTitle>
                    <CardDescription className={`text-lg font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {plan.description}
                    </CardDescription>
                    <div className="mt-8 min-h-[6rem] flex flex-col justify-center">
                      {(plan as any).originalPrice && (
                        <span className={`text-xl font-medium line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {(plan as any).originalPrice}
                        </span>
                      )}
                      {plan.price && (
                        <div>
                          <span className={`text-5xl font-bold font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className={`text-lg font-cairo ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${
                              isRTL ? 'mr-2' : 'ml-2'
                            }`}>
                              /{plan.period}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <Button 
                      className={`w-full h-12 text-lg font-semibold font-cairo transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                          : 'hover:scale-105'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feature Comparison Table */}
            <div className={`font-cairo ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white/70 border border-gray-200/50'
            } backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl`}>
              <div className="text-center mb-12">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'ar' ? 'مقارنة تفصيلية للمزايا' : 'Detailed Feature Comparison'}
                </h2>
                <div className={`w-24 h-1 ${
                  theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                } mx-auto rounded-full`}></div>
              </div>
              
              {Object.entries(t.features).map(([categoryKey, category]) => (
                <div key={categoryKey} className="mb-16 last:mb-0">
                  <h3 className={`text-2xl font-bold mb-8 font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
                    <div className={`w-3 h-3 rounded-full ${
                      theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                    }`}></div>
                    {category.title}
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className={`${isRTL ? 'text-right' : 'text-left'} py-6 px-4 text-lg font-semibold font-cairo ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {language === 'ar' ? 'الميزة' : 'Feature'}
                          </th>
                          {t.plans.map((plan, planIndex) => (
                            <th key={planIndex} className={`text-center py-6 px-4 text-lg font-semibold font-cairo ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <div className="flex flex-col items-center gap-2">
                                <plan.icon className="w-6 h-6" />
                                {plan.name}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((feature, featureIndex) => (
                          <tr key={featureIndex} className={`border-b transition-colors hover:${
                            theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'
                          } ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                            <td className={`py-6 px-4 ${isRTL ? 'text-right' : 'text-left'} font-medium font-cairo ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {feature.name}
                            </td>
                            <td className="py-6 px-4 text-center">
                              {renderFeatureValue(feature, 'base')}
                            </td>
                            <td className="py-6 px-4 text-center">
                              {renderFeatureValue(feature, 'pro')}
                            </td>
                            <td className="py-6 px-4 text-center">
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

            {/* Footer Note */}
            <div className="text-center mt-16">
              <p className={`text-sm font-cairo ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} max-w-4xl mx-auto leading-relaxed`}>
                {t.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
