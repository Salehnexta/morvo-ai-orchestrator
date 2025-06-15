
import { useState } from "react";
import { MessageSquare, Sparkles, Zap, Globe, BarChart3, Users, Play, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      badge: "منصة التجارة الإلكترونية الذكية",
      title1: "متجر زد",
      title2: "Zid Store",
      subtitle: "ثورة التجارة الإلكترونية",
      description1: "منصة التجارة الإلكترونية الرائدة في المملكة العربية السعودية",
      description2: "Leading e-commerce platform in Saudi Arabia",
      startChat: "ابدأ المحادثة",
      watchDemo: "شاهد العرض",
      featuresTitle1: "مدعوم بتقنيات ذكية متطورة",
      featuresTitle2: "Powered by Advanced Smart Technologies",
      featuresDesc: "اختبر مستقبل التجارة الإلكترونية مع منصة زد المدعومة بالذكاء الاصطناعي",
      whyChoose1: "لماذا تختار متجر زد؟",
      whyChoose2: "Why Choose Zid Store?",
      platformStats: "إحصائيات المنصة",
      ctaTitle1: "هل أنت مستعد لبدء رحلتك التجارية؟",
      ctaTitle2: "Ready to start your business journey?",
      ctaDesc1: "انضم لآلاف التجار الناجحين واختبر قوة منصة زد",
      ctaDesc2: "Join thousands of successful merchants and experience the power of Zid platform",
      getStarted: "ابدأ الآن"
    },
    en: {
      badge: "Smart E-commerce Platform",
      title1: "Zid Store",
      title2: "متجر زد",
      subtitle: "E-commerce Revolution",
      description1: "Leading e-commerce platform in Saudi Arabia",
      description2: "منصة التجارة الإلكترونية الرائدة في المملكة العربية السعودية",
      startChat: "Start Chat",
      watchDemo: "Watch Demo",
      featuresTitle1: "Powered by Advanced Smart Technologies",
      featuresTitle2: "مدعوم بتقنيات ذكية متطورة",
      featuresDesc: "Experience the future of e-commerce with Zid's AI-powered platform",
      whyChoose1: "Why Choose Zid Store?",
      whyChoose2: "لماذا تختار متجر زد؟",
      platformStats: "Platform Stats",
      ctaTitle1: "Ready to start your business journey?",
      ctaTitle2: "هل أنت مستعد لبدء رحلتك التجارية؟",
      ctaDesc1: "Join thousands of successful merchants and experience the power of Zid platform",
      ctaDesc2: "انضم لآلاف التجار الناجحين واختبر قوة منصة زد",
      getStarted: "Get Started Now"
    }
  };

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: language === 'ar' ? "نظام إدارة المتاجر" : "Store Management System",
      titleSecondary: language === 'ar' ? "Store Management" : "نظام إدارة المتاجر",
      description: language === 'ar' ? "نظام شامل لإدارة متجرك الإلكتروني بكل سهولة ومرونة" : "Comprehensive system to manage your online store with ease and flexibility",
      descriptionSecondary: language === 'ar' ? "Comprehensive store management with ease and flexibility" : "نظام شامل لإدارة متجرك الإلكتروني بكل سهولة ومرونة",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Bilingual AI",
      titleAr: "ذكاء اصطناعي ثنائي اللغة",
      description: "Native Arabic and English support with Saudi dialect optimization",
      descriptionAr: "دعم أصلي للعربية والإنجليزية مع تحسين للهجة السعودية",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      titleAr: "معالجة فورية",
      description: "Sub-10 second responses with live cost tracking and performance monitoring",
      descriptionAr: "استجابة أقل من 10 ثواني مع تتبع التكلفة ومراقبة الأداء",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Agent Ecosystem",
      titleAr: "نظام متعدد الوكلاء",
      description: "9 specialized agents covering SEO, social media, analytics, content, and competitive intelligence",
      descriptionAr: "9 وكلاء متخصصين يغطون السيو ووسائل التواصل والتحليلات والمحتوى والذكاء التنافسي",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Enterprise Analytics",
      titleAr: "تحليلات متقدمة",
      description: "Advanced business intelligence with ROI analysis and data-driven insights",
      descriptionAr: "ذكاء أعمال متقدم مع تحليل العائد على الاستثمار ورؤى مدفوعة بالبيانات",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Scalable Platform",
      titleAr: "منصة قابلة للتوسع",
      description: "Railway deployment with 99.9% uptime handling 1000+ concurrent clients",
      descriptionAr: "نشر على Railway مع 99.9% وقت تشغيل يتعامل مع 1000+ عميل متزامن",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { number: "1000+", label: language === 'ar' ? "متجر نشط" : "Active Stores", labelSecondary: language === 'ar' ? "Active Stores" : "متجر نشط" },
    { number: "99.9%", label: language === 'ar' ? "وقت التشغيل" : "Uptime", labelSecondary: language === 'ar' ? "Uptime" : "وقت التشغيل" },
    { number: "24/7", label: language === 'ar' ? "الدعم الفني" : "Support", labelSecondary: language === 'ar' ? "Support" : "الدعم الفني" },
    { number: "50+", label: language === 'ar' ? "ميزة متقدمة" : "Advanced Features", labelSecondary: language === 'ar' ? "Features" : "ميزة متقدمة" }
  ];

  const benefits = [
    { text: language === 'ar' ? "منصة متكاملة للتجارة الإلكترونية" : "Complete e-commerce platform", textSecondary: language === 'ar' ? "Complete e-commerce platform" : "منصة متكاملة للتجارة الإلكترونية" },
    { text: "AI-powered marketing automation", textAr: "أتمتة التسويق بالذكاء الاصطناعي" },
    { text: "24/7 expert consultation", textAr: "استشارة خبراء 24/7" },
    { text: "Multi-language support", textAr: "دعم متعدد اللغات" },
    { text: "Real-time analytics", textAr: "تحليلات فورية" },
    { text: "Cost-effective solution", textAr: "حل فعال من حيث التكلفة" },
    { text: "Scalable infrastructure", textAr: "بنية تحتية قابلة للتوسع" }
  ];

  const t = content[language];

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
        : 'bg-white'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onStartChat={() => setShowChat(true)} />

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200'
            }`}>
              <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.badge}
              </span>
            </div>
            
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="block">{t.title1}</span>
              <span className="block bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                {t.title2}
              </span>
              <span className={`block text-lg md:text-xl lg:text-2xl font-normal mt-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.subtitle}
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.description1}
              <br />
              <span className="text-lg md:text-xl">
                {t.description2}
              </span>
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button 
                onClick={() => setShowChat(true)}
                className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <MessageSquare className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.startChat}
              </Button>
              <Button 
                variant="outline" 
                className={`px-8 py-4 text-lg font-semibold rounded-full ${
                  isRTL ? 'flex-row-reverse' : ''
                } ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-white hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Play className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.watchDemo}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              مدعوم بتقنيات ذكية متطورة
              <br />
              <span className="text-2xl md:text-3xl">Powered by Advanced Smart Technologies</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              اختبر مستقبل أتمتة التسويق حيث يتعاون وكلاء الذكاء الاصطناعي المتخصصون لتقديم استراتيجيات على مستوى الخبراء
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750' 
                    : 'bg-white border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`mb-4 transition-colors duration-300 p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white inline-flex`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.titleAr}
                </h3>
                <h4 className={`text-lg font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.title}
                </h4>
                <p className={`leading-relaxed mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.descriptionAr}
                </p>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-20 ${
        theme === 'dark' 
          ? 'bg-gray-900' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                لماذا تختار متجر زد؟
                <br />
                <span className="text-2xl md:text-3xl">Why Choose Zid Store?</span>
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {benefit.textAr}
                      </span>
                      <br />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {benefit.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`p-8 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200 shadow-lg'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                إحصائيات المنصة | Platform Stats
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.number}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {stat.label}
                      <br />
                      {stat.labelSecondary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            هل أنت مستعد لثورة التسويق بالذكاء الاصطناعي؟
            <br />
            <span className="text-2xl md:text-3xl">Ready to revolutionize your marketing with AI?</span>
          </h2>
          <p className={`text-xl mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            ابدأ مع الوكيل الرئيسي واختبر قوة ذكاء التسويق المنسق بالذكاء الاصطناعي
            <br />
            Start with the Master Agent and experience the power of coordinated AI marketing intelligence
          </p>
          <Button 
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            ابدأ الآن | Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
