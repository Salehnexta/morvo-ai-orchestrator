
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, Users, Award } from "lucide-react";

export default function SuccessStories() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "قصص النجاح",
      subtitle: "اكتشف كيف ساعدت منصة Morvo AI الشركات على تحقيق نتائج استثنائية",
      stories: [
        {
          company: "متجر الأزياء العصرية",
          industry: "التجارة الإلكترونية",
          result: "زيادة المبيعات بنسبة 350%",
          description: "تمكنت من زيادة التفاعل على وسائل التواصل الاجتماعي بنسبة 400% وتحسين معدل التحويل بنسبة 250%",
          metrics: [
            { label: "زيادة المبيعات", value: "350%" },
            { label: "نمو التفاعل", value: "400%" },
            { label: "تحسن التحويل", value: "250%" }
          ]
        },
        {
          company: "شركة التقنية المبتكرة",
          industry: "التكنولوجيا",
          result: "توفير 60% من وقت التسويق",
          description: "أتمتة العمليات التسويقية وتحسين استهداف العملاء المحتملين بدقة عالية",
          metrics: [
            { label: "توفير الوقت", value: "60%" },
            { label: "تحسن الاستهداف", value: "180%" },
            { label: "زيادة العملاء", value: "220%" }
          ]
        },
        {
          company: "مطعم الذواقة",
          industry: "المطاعم والضيافة",
          result: "نمو الطلبات بنسبة 280%",
          description: "تحليل سلوك العملاء وتطوير استراتيجيات تسويقية مخصصة لكل شريحة",
          metrics: [
            { label: "زيادة الطلبات", value: "280%" },
            { label: "نمو المتابعين", value: "320%" },
            { label: "تحسن الرضا", value: "95%" }
          ]
        }
      ]
    },
    en: {
      title: "Success Stories",
      subtitle: "Discover how Morvo AI platform helped companies achieve exceptional results",
      stories: [
        {
          company: "Modern Fashion Store",
          industry: "E-commerce",
          result: "350% Sales Increase",
          description: "Managed to increase social media engagement by 400% and improve conversion rate by 250%",
          metrics: [
            { label: "Sales Growth", value: "350%" },
            { label: "Engagement Growth", value: "400%" },
            { label: "Conversion Improvement", value: "250%" }
          ]
        },
        {
          company: "Innovative Tech Company",
          industry: "Technology",
          result: "60% Marketing Time Saved",
          description: "Automated marketing processes and improved prospect targeting with high accuracy",
          metrics: [
            { label: "Time Saved", value: "60%" },
            { label: "Targeting Improvement", value: "180%" },
            { label: "Customer Growth", value: "220%" }
          ]
        },
        {
          company: "Gourmet Restaurant",
          industry: "Food & Hospitality",
          result: "280% Order Growth",
          description: "Analyzed customer behavior and developed customized marketing strategies for each segment",
          metrics: [
            { label: "Order Increase", value: "280%" },
            { label: "Follower Growth", value: "320%" },
            { label: "Satisfaction Improvement", value: "95%" }
          ]
        }
      ]
    }
  };

  const t = content[language];

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Hero Section */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} py-20`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Success Stories */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-12">
            {t.stories.map((story, index) => (
              <Card key={index} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
                  <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {story.company}
                      </CardTitle>
                      <CardDescription className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {story.industry}
                      </CardDescription>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold text-green-500 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {story.result}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {story.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {story.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                        <div className="text-2xl font-bold text-blue-500 mb-2">{metric.value}</div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {metric.label}
                        </div>
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
}
