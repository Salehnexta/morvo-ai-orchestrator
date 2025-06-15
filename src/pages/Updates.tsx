import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star, Zap, Shield } from "lucide-react";

export default function Updates() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "آخر التحديثات",
      subtitle: "تابع أحدث المميزات والتحسينات في منصة Morvo AI",
      updates: [
        {
          version: "الإصدار 2.5.0",
          date: "15 يونيو 2024",
          type: "مميزة جديدة",
          title: "إطلاق وكيل AI المتخصص في TikTok",
          description: "وكيل ذكي جديد متخصص في تحليل وإدارة المحتوى على منصة TikTok مع إمكانيات متقدمة لتتبع الترندات",
          icon: Star
        },
        {
          version: "الإصدار 2.4.8",
          date: "8 يونيو 2024",
          type: "تحسين",
          title: "تسريع لوحة التحكم بنسبة 40%",
          description: "تحسينات كبيرة في أداء لوحة التحكم وتحميل البيانات بشكل أسرع",
          icon: Zap
        },
        {
          version: "الإصدار 2.4.5",
          date: "1 يونيو 2024",
          type: "أمان",
          title: "تعزيز الأمان وحماية البيانات",
          description: "تطبيق معايير أمان جديدة وتشفير متقدم لحماية بيانات العملاء",
          icon: Shield
        }
      ]
    },
    en: {
      title: "Latest Updates",
      subtitle: "Follow the newest features and improvements in Morvo AI platform",
      updates: [
        {
          version: "Version 2.5.0",
          date: "June 15, 2024",
          type: "New Feature",
          title: "TikTok Specialized AI Agent Launch",
          description: "New intelligent agent specialized in analyzing and managing TikTok content with advanced trend tracking capabilities",
          icon: Star
        },
        {
          version: "Version 2.4.8",
          date: "June 8, 2024",
          type: "Enhancement",
          title: "40% Dashboard Speed Boost",
          description: "Major improvements in dashboard performance and faster data loading",
          icon: Zap
        },
        {
          version: "Version 2.4.5",
          date: "June 1, 2024",
          type: "Security",
          title: "Enhanced Security and Data Protection",
          description: "Implementation of new security standards and advanced encryption for customer data protection",
          icon: Shield
        }
      ]
    }
  };

  const t = content[language as keyof typeof content];

  return (
    <MainLayout>
      <div className={`min-h-screen font-cairo ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Hero Section */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} py-20`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </h1>
            <p className={`text-xl font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Updates */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            {t.updates.map((update, index) => (
              <Card key={index} className={`font-cairo ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <update.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`flex items-center gap-4 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium font-cairo ${
                          update.type === 'مميزة جديدة' || update.type === 'New Feature' 
                            ? 'bg-green-100 text-green-800' 
                            : update.type === 'تحسين' || update.type === 'Enhancement'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {update.type}
                        </span>
                        <div className={`flex items-center gap-2 text-sm font-cairo ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Calendar className="w-4 h-4" />
                          <span>{update.date}</span>
                        </div>
                      </div>
                      <CardTitle className={`text-xl mb-2 font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {update.title}
                      </CardTitle>
                      <CardDescription className={`text-base font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {update.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-sm font-medium font-cairo ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {update.version}
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
