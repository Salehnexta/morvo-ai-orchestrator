
import { useState } from "react";
import { MessageSquare, Sparkles, Zap, Globe, BarChart3, Users, Moon, Sun, Play, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Master Agent",
      titleAr: "الوكيل الرئيسي",
      description: "Intelligent coordinator managing 9 specialized AI agents for comprehensive marketing solutions",
      descriptionAr: "منسق ذكي يدير 9 وكلاء متخصصين بالذكاء الاصطناعي لحلول تسويقية شاملة"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Bilingual AI",
      titleAr: "ذكاء اصطناعي ثنائي اللغة",
      description: "Native Arabic and English support with Saudi dialect optimization",
      descriptionAr: "دعم أصلي للعربية والإنجليزية مع تحسين للهجة السعودية"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      titleAr: "معالجة فورية",
      description: "Sub-10 second responses with live cost tracking and performance monitoring",
      descriptionAr: "استجابة أقل من 10 ثواني مع تتبع التكلفة ومراقبة الأداء"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Agent Ecosystem",
      titleAr: "نظام متعدد الوكلاء",
      description: "9 specialized agents covering SEO, social media, analytics, content, and competitive intelligence",
      descriptionAr: "9 وكلاء متخصصين يغطون السيو ووسائل التواصل والتحليلات والمحتوى والذكاء التنافسي"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Enterprise Analytics",
      titleAr: "تحليلات متقدمة",
      description: "Advanced business intelligence with ROI analysis and data-driven insights",
      descriptionAr: "ذكاء أعمال متقدم مع تحليل العائد على الاستثمار ورؤى مدفوعة بالبيانات"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Scalable Platform",
      titleAr: "منصة قابلة للتوسع",
      description: "Railway deployment with 99.9% uptime handling 1000+ concurrent clients",
      descriptionAr: "نشر على Railway مع 99.9% وقت تشغيل يتعامل مع 1000+ عميل متزامن"
    }
  ];

  const stats = [
    { number: "9", label: "Specialized Agents", labelAr: "وكلاء متخصصين" },
    { number: "99.9%", label: "Uptime", labelAr: "وقت التشغيل" },
    { number: "<10s", label: "Response Time", labelAr: "وقت الاستجابة" },
    { number: "1000+", label: "Concurrent Clients", labelAr: "عملاء متزامنين" }
  ];

  const benefits = [
    { text: "AI-powered marketing automation", textAr: "أتمتة التسويق بالذكاء الاصطناعي" },
    { text: "24/7 expert consultation", textAr: "استشارة خبراء 24/7" },
    { text: "Multi-language support", textAr: "دعم متعدد اللغات" },
    { text: "Real-time analytics", textAr: "تحليلات فورية" },
    { text: "Cost-effective solution", textAr: "حل فعال من حيث التكلفة" },
    { text: "Scalable infrastructure", textAr: "بنية تحتية قابلة للتوسع" }
  ];

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-white via-blue-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Morvo AI
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Next-Gen Marketing Intelligence
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                تجربة مجانية | Try Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
              theme === 'dark' 
                ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                : 'bg-blue-100 border border-blue-200'
            }`}>
              <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-blue-900'}`}>
                منصة الذكاء الاصطناعي للتسويق | AI Marketing Platform
              </span>
            </div>
            
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="block">مورفو AI</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Morvo AI
              </span>
              <span className={`block text-lg md:text-xl lg:text-2xl font-normal mt-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                ثورة التسويق بالذكاء الاصطناعي
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-white/80' : 'text-gray-700'
            }`}>
              9 وكلاء ذكاء اصطناعي متخصصين يعملون بتناغم لثورة استراتيجية التسويق الرقمي
              <br />
              <span className="text-lg md:text-xl">
                9 Specialized AI Agents working in harmony to revolutionize your digital marketing strategy
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                ابدأ المحادثة | Start Chat
              </Button>
              <Button 
                variant="outline" 
                className={`px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm ${
                  theme === 'dark' 
                    ? 'border-white/30 text-white hover:bg-white/10' 
                    : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Play className="w-5 h-5 mr-2" />
                شاهد العرض | Watch Demo
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
              مدعوم بتنسيق الوكلاء الذكي
              <br />
              <span className="text-2xl md:text-3xl">Powered by Intelligent Agent Coordination</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-white/70' : 'text-gray-600'
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
                    ? 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15' 
                    : 'bg-white border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-lg'
                }`}
              >
                <div className={`mb-4 transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'text-blue-400 group-hover:text-purple-400'
                    : 'text-blue-600 group-hover:text-purple-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.titleAr}
                </h3>
                <h4 className={`text-lg font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feature.title}
                </h4>
                <p className={`leading-relaxed mb-2 ${
                  theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                }`}>
                  {feature.descriptionAr}
                </p>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-white/60' : 'text-gray-500'
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
          ? 'bg-white/5 backdrop-blur-sm' 
          : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                لماذا تختار مورفو AI؟
                <br />
                <span className="text-2xl md:text-3xl">Why Choose Morvo AI?</span>
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <div>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {benefit.textAr}
                      </span>
                      <br />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
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
                ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-white/20' 
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200'
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
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.labelAr}
                      <br />
                      {stat.label}
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
            theme === 'dark' ? 'text-white/70' : 'text-gray-700'
          }`}>
            ابدأ مع الوكيل الرئيسي واختبر قوة ذكاء التسويق المنسق بالذكاء الاصطناعي
            <br />
            Start with the Master Agent and experience the power of coordinated AI marketing intelligence
          </p>
          <Button 
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            ابدأ الآن | Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 ${
        theme === 'dark' 
          ? 'border-white/10 bg-white/5' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2024 Morvo AI. جميع الحقوق محفوظة | All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
