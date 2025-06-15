
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, BookOpen, Search, HelpCircle } from "lucide-react";

export default function Support() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "مركز الدعم",
      subtitle: "نحن هنا لمساعدتك في كل خطوة",
      description: "احصل على المساعدة التي تحتاجها لتحقيق أقصى استفادة من منصة Morvo AI",
      supportChannels: "قنوات الدعم",
      liveChat: {
        title: "الدردشة المباشرة",
        description: "تحدث مع فريق الدعم مباشرة للحصول على إجابات فورية",
        action: "بدء المحادثة"
      },
      email: {
        title: "البريد الإلكتروني",
        description: "أرسل لنا استفسارك وسنرد عليك خلال 24 ساعة",
        action: "إرسال بريد"
      },
      phone: {
        title: "الهاتف",
        description: "اتصل بنا مباشرة للحصول على دعم فوري",
        action: "اتصل بنا"
      },
      helpCenter: {
        title: "مركز المساعدة",
        description: "تصفح قاعدة المعرفة والأدلة التفصيلية",
        action: "تصفح المقالات"
      },
      faq: {
        title: "الأسئلة الشائعة",
        description: "إجابات سريعة للأسئلة الأكثر شيوعاً",
        action: "عرض الأسئلة"
      },
      documentation: {
        title: "الوثائق",
        description: "دليل شامل للمطورين والمستخدمين المتقدمين",
        action: "قراءة الوثائق"
      }
    },
    en: {
      title: "Support Center",
      subtitle: "We're here to help you every step of the way",
      description: "Get the help you need to make the most of Morvo AI platform",
      supportChannels: "Support Channels",
      liveChat: {
        title: "Live Chat",
        description: "Talk to our support team directly for instant answers",
        action: "Start Chat"
      },
      email: {
        title: "Email",
        description: "Send us your inquiry and we'll respond within 24 hours",
        action: "Send Email"
      },
      phone: {
        title: "Phone",
        description: "Call us directly for immediate support",
        action: "Call Us"
      },
      helpCenter: {
        title: "Help Center",
        description: "Browse our knowledge base and detailed guides",
        action: "Browse Articles"
      },
      faq: {
        title: "FAQ",
        description: "Quick answers to the most common questions",
        action: "View FAQ"
      },
      documentation: {
        title: "Documentation",
        description: "Comprehensive guide for developers and advanced users",
        action: "Read Docs"
      }
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
            <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.subtitle}
            </p>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t.description}
            </p>
          </div>
        </div>

        {/* Support Channels */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t.supportChannels}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Live Chat */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow`}>
              <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {t.liveChat.title}
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {t.liveChat.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {t.liveChat.action}
                </Button>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow`}>
              <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {t.email.title}
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {t.email.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {t.email.action}
                </Button>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow`}>
              <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {t.phone.title}
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {t.phone.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  {t.phone.action}
                </Button>
              </CardContent>
            </Card>

            {/* Help Center */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow`}>
              <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {t.helpCenter.title}
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {t.helpCenter.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  {t.helpCenter.action}
                </Button>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow`}>
              <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {t.faq.title}
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {t.faq.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  {t.faq.action}
                </Button>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow`}>
              <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {t.documentation.title}
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {t.documentation.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  {t.documentation.action}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
