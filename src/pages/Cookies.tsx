
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Cookies() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "سياسة ملفات تعريف الارتباط",
      lastUpdated: "آخر تحديث: 15 يونيو 2024",
      sections: [
        {
          title: "ما هي ملفات تعريف الارتباط؟",
          content: "ملفات تعريف الارتباط هي ملفات نصية صغيرة تُحفظ على جهازك عند زيارة موقعنا. تساعدنا هذه الملفات في تحسين تجربتك وتقديم خدمات أفضل."
        },
        {
          title: "كيف نستخدم ملفات تعريف الارتباط؟",
          content: "نستخدم ملفات تعريف الارتباط لتذكر تفضيلاتك، وتحليل حركة المرور على الموقع، وتخصيص المحتوى، وضمان الأمان."
        },
        {
          title: "أنواع ملفات تعريف الارتباط",
          content: "نستخدم ملفات تعريف الارتباط الأساسية (ضرورية لعمل الموقع)، وملفات التحليل (لفهم كيفية استخدام الموقع)، وملفات التفضيلات (لحفظ إعداداتك)."
        },
        {
          title: "إدارة ملفات تعريف الارتباط",
          content: "يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح. يمكنك حذفها أو منعها، لكن قد يؤثر ذلك على وظائف الموقع."
        }
      ]
    },
    en: {
      title: "Cookie Policy",
      lastUpdated: "Last updated: June 15, 2024",
      sections: [
        {
          title: "What are cookies?",
          content: "Cookies are small text files that are stored on your device when you visit our website. These files help us improve your experience and provide better services."
        },
        {
          title: "How do we use cookies?",
          content: "We use cookies to remember your preferences, analyze website traffic, personalize content, and ensure security."
        },
        {
          title: "Types of cookies",
          content: "We use essential cookies (necessary for the website to function), analytics cookies (to understand how the site is used), and preference cookies (to save your settings)."
        },
        {
          title: "Managing cookies",
          content: "You can control cookies through your browser settings. You can delete or block them, but this may affect the website's functionality."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.lastUpdated}
            </p>
          </div>

          <div className="space-y-8">
            {t.sections.map((section, index) => (
              <Card key={index} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
                  <CardTitle className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {section.content}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
