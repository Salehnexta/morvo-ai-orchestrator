
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Video, FileText, Search, Users } from "lucide-react";

export default function HelpCenter() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "مركز المساعدة",
      subtitle: "كل ما تحتاجه لتحقيق أقصى استفادة من منصة Morvo AI",
      categories: [
        {
          icon: BookOpen,
          title: "دليل البداية السريعة",
          description: "تعلم كيفية إعداد حسابك وبدء استخدام المنصة خلال دقائق",
          articles: 12
        },
        {
          icon: Video,
          title: "فيديوهات تعليمية",
          description: "شاهد دروس فيديو مفصلة لجميع مميزات المنصة",
          articles: 25
        },
        {
          icon: FileText,
          title: "الوثائق التقنية",
          description: "مرجع شامل لجميع واجهات برمجة التطبيقات والتكاملات",
          articles: 48
        },
        {
          icon: MessageCircle,
          title: "الأسئلة الشائعة",
          description: "إجابات سريعة للأسئلة الأكثر شيوعاً من المستخدمين",
          articles: 35
        },
        {
          icon: Users,
          title: "مجتمع المستخدمين",
          description: "انضم لمجتمعنا وتفاعل مع مستخدمين آخرين",
          articles: 150
        },
        {
          icon: Search,
          title: "استكشاف الأخطاء",
          description: "حلول للمشاكل الشائعة ونصائح لحل المشاكل التقنية",
          articles: 28
        }
      ]
    },
    en: {
      title: "Help Center",
      subtitle: "Everything you need to get the most out of Morvo AI platform",
      categories: [
        {
          icon: BookOpen,
          title: "Quick Start Guide",
          description: "Learn how to set up your account and start using the platform in minutes",
          articles: 12
        },
        {
          icon: Video,
          title: "Video Tutorials",
          description: "Watch detailed video lessons for all platform features",
          articles: 25
        },
        {
          icon: FileText,
          title: "Technical Documentation",
          description: "Comprehensive reference for all APIs and integrations",
          articles: 48
        },
        {
          icon: MessageCircle,
          title: "Frequently Asked Questions",
          description: "Quick answers to the most common user questions",
          articles: 35
        },
        {
          icon: Users,
          title: "User Community",
          description: "Join our community and interact with other users",
          articles: 150
        },
        {
          icon: Search,
          title: "Troubleshooting",
          description: "Solutions for common issues and technical problem-solving tips",
          articles: 28
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

        {/* Help Categories */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.categories.map((category, index) => (
              <Card key={index} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow cursor-pointer`}>
                <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {category.title}
                  </CardTitle>
                  <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {category.articles} {language === 'ar' ? 'مقال' : 'articles'}
                    </span>
                    <Button variant="ghost" size="sm">
                      {language === 'ar' ? 'استكشف' : 'Explore'}
                    </Button>
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
