
import { useState } from "react";
import { MessageSquare, Sparkles, Zap, Globe, BarChart3, Users, Play, ArrowRight, CheckCircle, Brain, Target, Clock, TrendingUp, Shield, Award, Star, Rocket } from "lucide-react";
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
      badge: "الذكاء الاصطناعي التسويقي الثوري",
      title1: "ثورة التسويق هنا",
      title2: "تعرف على Morvo AI - أول ذكاء تسويقي وكيل في العالم",
      subtitle: "9 وكلاء ذكاء اصطناعي. إمكانيات لا محدودة.",
      description: "حول استراتيجيتك التسويقية مع الذكاء الاصطناعي المستقل الذي يفكر ويتعلم وينفذ مثل أفضل فريق تسويق لديك - ولكن أسرع بـ100 مرة.",
      heroDesc: "توقف عن إدارة أدوات التسويق. ابدأ في قيادة الذكاء التسويقي.",
      startChat: "ابدأ التحول الآن",
      watchDemo: "احجز عرضاً توضيحياً",
      whyMorvo: "لماذا Morvo AI يغير كل شيء",
      whySubtitle: "فجر الذكاء التسويقي الوكيل"
    },
    en: {
      badge: "Revolutionary AI Marketing Intelligence",
      title1: "The Marketing Revolution is Here",
      title2: "Meet Morvo AI - The World's First Agentic Marketing Intelligence",
      subtitle: "9 AI Agents. Infinite Possibilities.",
      description: "Transform your marketing strategy with autonomous AI that thinks, learns, and executes like your best marketing team - but 100x faster.",
      heroDesc: "Stop managing marketing tools. Start commanding marketing intelligence.",
      startChat: "Start Your AI Transformation",
      watchDemo: "Book a Demo",
      whyMorvo: "Why Morvo AI Changes Everything",
      whySubtitle: "The Dawn of Agentic Marketing Intelligence"
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: language === 'ar' ? "اتخاذ القرارات المستقل" : "Autonomous Decision Making",
      titleSecondary: language === 'ar' ? "Autonomous Decision Making" : "اتخاذ القرارات المستقل",
      description: language === 'ar' ? "فريق التسويق الذكي الذي لا ينام أبداً - يحلل المنافسين، يحسن الـSEO، ينشئ المحتوى الفيروسي، ويراقب العلامة التجارية 24/7" : "Your AI Marketing Team That Never Sleeps - analyzing competitors, optimizing SEO, creating viral content, and monitoring your brand 24/7",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: language === 'ar' ? "تعاون الوكلاء الذكي" : "Intelligent Agent Collaboration",
      titleSecondary: language === 'ar' ? "Intelligent Agent Collaboration" : "تعاون الوكلاء الذكي",
      description: language === 'ar' ? "9 متخصصين، استراتيجية موحدة - منسق رئيسي، خبير SEO، خبير وسائل التواصل، عبقري التحليلات، منشئ المحتوى، محترف التسويق عبر البريد الإلكتروني، حارس العلامة التجارية، محلل المنافسين، محسن الإعلانات المدفوعة" : "9 Specialists, One Unified Strategy - Master Coordinator, SEO Specialist, Social Media Expert, Analytics Genius, Content Creator, Email Marketing Pro, Brand Guardian, Competitor Analyst, Paid Ads Optimizer",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: language === 'ar' ? "التكيف في الوقت الفعلي" : "Real-Time Market Adaptation",
      titleSecondary: language === 'ar' ? "Real-Time Market Adaptation" : "التكيف في الوقت الفعلي",
      description: language === 'ar' ? "الذكاء الاصطناعي الذي يتطور مع عملك - اكتشاف تغيرات السوق في أجزاء من الثانية، تعديل الاستراتيجيات تلقائياً، تحسين الحملات في الوقت الفعلي" : "AI That Evolves With Your Business - market shifts detected in milliseconds, strategies adjusted automatically, campaigns optimized in real-time",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: language === 'ar' ? "التسويق التنبؤي" : "Predictive Marketing",
      titleSecondary: language === 'ar' ? "Predictive Marketing" : "التسويق التنبؤي",
      description: language === 'ar' ? "رؤية المستقبل قبل حدوثه - يتنبأ ذكاؤنا الاصطناعي بتوجهات السوق وسلوك العملاء وتحركات المنافسين بدقة 94%" : "See the future before it happens - Our AI predicts market trends, customer behavior, and competitor moves with 94% accuracy",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: language === 'ar' ? "الذكاء ثنائي اللغة" : "Bilingual Intelligence",
      titleSecondary: language === 'ar' ? "Bilingual Intelligence" : "الذكاء ثنائي اللغة",
      description: language === 'ar' ? "طلاقة في الإنجليزية والعربية مع فهم الفروق الثقافية التي تتصل مع الجماهير العالمية وتحسين للهجة السعودية" : "Fluent in English and Arabic, with cultural nuance understanding that connects with global audiences and Saudi dialect optimization",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: language === 'ar' ? "التحليلات المؤسسية" : "Enterprise Analytics",
      titleSecondary: language === 'ar' ? "Enterprise Analytics" : "التحليلات المؤسسية",
      description: language === 'ar' ? "ذكاء الأعمال المتقدم مع تحليل العائد على الاستثمار ورؤى مدفوعة بالبيانات مع منصة قابلة للتوسع تتعامل مع 1000+ عميل متزامن" : "Advanced business intelligence with ROI analysis and data-driven insights with scalable platform handling 1000+ concurrent clients",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { number: "500%", label: language === 'ar' ? "زيادة متوسط العائد على الاستثمار" : "Average ROI Increase", labelSecondary: language === 'ar' ? "Average ROI Increase" : "زيادة متوسط العائد على الاستثمار" },
    { number: "90%", label: language === 'ar' ? "تقليل المهام اليدوية" : "Reduction in Manual Tasks", labelSecondary: language === 'ar' ? "Manual Tasks Reduction" : "تقليل المهام اليدوية" },
    { number: "94%", label: language === 'ar' ? "معدل دقة التنبؤ" : "Prediction Accuracy Rate", labelSecondary: language === 'ar' ? "Prediction Accuracy" : "معدل دقة التنبؤ" },
    { number: "24/7", label: language === 'ar' ? "التشغيل المستقل" : "Autonomous Operation", labelSecondary: language === 'ar' ? "Autonomous Operation" : "التشغيل المستقل" }
  ];

  const problems = [
    { text: language === 'ar' ? "تغرق في الأدوات التي لا تتحدث مع بعضها البعض" : "Drowning in tools that don't talk to each other" },
    { text: language === 'ar' ? "فريقك يقضي 80% من الوقت في المهام اليدوية" : "Your team spends 80% of time on manual tasks" },
    { text: language === 'ar' ? "الرؤى تأتي متأخرة جداً لتهم" : "Insights come too late to matter" },
    { text: language === 'ar' ? "الحملات تُطلق بناءً على الحدس وليس الذكاء" : "Campaigns launch based on gut feeling, not intelligence" },
    { text: language === 'ar' ? "دائماً خطوة واحدة خلف منافسيك" : "Always one step behind your competitors" },
    { text: language === 'ar' ? "العائد على الاستثمار غير متوقع وغير متسق" : "ROI is unpredictable and inconsistent" }
  ];

  const solutions = [
    { text: language === 'ar' ? "ذكاء موحد يربط كل شيء" : "One unified intelligence that connects everything" },
    { text: language === 'ar' ? "99% أتمتة مع 1% إشراف بشري" : "99% automation with 1% human oversight" },
    { text: language === 'ar' ? "رؤى تنبؤية توجه القرارات قبل أن تهم" : "Predictive insights that guide decisions before they matter" },
    { text: language === 'ar' ? "حملات تُطلق بدقة الذكاء الاصطناعي وإبداع البشر" : "Campaigns launched with AI precision and human creativity" },
    { text: language === 'ar' ? "دائماً ثلاث خطوات أمام المنافسة" : "Always three steps ahead of competition" },
    { text: language === 'ar' ? "تحسين العائد على الاستثمار مضمون أو استرداد الأموال" : "Guaranteed ROI improvement or money back" }
  ];

  const testimonials = [
    {
      name: "أحمد الراشد",
      nameEn: "Ahmed Al-Rashid",
      position: language === 'ar' ? "الرئيس التنفيذي، دبي للابتكارات" : "CEO, Dubai Innovations",
      quote: language === 'ar' ? "Morvo AI لم يحسن تسويقنا فحسب - بل ثوّر أعمالنا بالكامل. انتقلنا من شركة ناشئة تكافح إلى رائدة في الصناعة في 6 أشهر." : "Morvo AI didn't just improve our marketing - it revolutionized our entire business. We went from struggling startup to industry leader in 6 months."
    },
    {
      name: "جينيفر مارتينيز",
      nameEn: "Jennifer Martinez",
      position: language === 'ar' ? "المؤسسة، EcoTech Solutions" : "Founder, EcoTech Solutions",
      quote: language === 'ar' ? "ظننت أنني أفهم التسويق حتى التقيت بـ Morvo AI. إنه مثل امتلاك كرة بلورية تُظهر لك بالضبط ما يريده عملاؤك قبل أن يعرفوا ذلك بأنفسهم." : "I thought I understood marketing until I met Morvo AI. It's like having a crystal ball that shows you exactly what your customers want before they know it themselves."
    },
    {
      name: "ديفيد كيم",
      nameEn: "David Kim",
      position: language === 'ar' ? "نائب رئيس التسويق، Global Dynamics" : "VP Marketing, Global Dynamics",
      quote: language === 'ar' ? "كان فريق التسويق لدينا متشككاً بشأن الذكاء الاصطناعي. الآن لا يمكنهم تخيل العمل بدون Morvo. إنه لا يستبدل المسوقين - بل يجعلهم خارقين." : "Our marketing team was skeptical about AI. Now they can't imagine working without Morvo. It's not replacing marketers - it's making them superhuman."
    }
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
              <Rocket className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.badge}
              </span>
            </div>
            
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="block">{t.title1}</span>
              <span className="block bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mt-2">
                {t.title2}
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl mb-4 max-w-4xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span className="block font-semibold text-2xl md:text-3xl mb-2">{t.subtitle}</span>
              {t.description}
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {t.heroDesc}
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button 
                onClick={() => setShowChat(true)}
                className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <Sparkles className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
              {t.whyMorvo}
              <br />
              <span className="text-2xl md:text-3xl">{t.whySubtitle}</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {language === 'ar' 
                ? "اختبر مستقبل أتمتة التسويق حيث يتعاون وكلاء الذكاء الاصطناعي المتخصصون لتقديم استراتيجيات على مستوى الخبراء"
                : "Experience the future of marketing automation where specialized AI agents collaborate to deliver expert-level strategies"
              }
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
                  {feature.title}
                </h3>
                <h4 className={`text-lg font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.titleSecondary}
                </h4>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className={`py-20 ${
        theme === 'dark' 
          ? 'bg-gray-900' 
          : 'bg-gradient-to-r from-red-50 to-orange-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problem */}
            <div className={`p-8 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-red-900/20 border border-red-800' 
                : 'bg-white border-l-4 border-red-500 shadow-lg'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-red-300' : 'text-red-600'
              }`}>
                {language === 'ar' ? "التسويق معطل. إليك السبب:" : "Marketing is Broken. Here's Why:"}
              </h3>
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">❌</span>
                    <span className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {problem.text}
                    </span>
                  </div>
                ))}
              </div>
              <p className={`mt-6 font-semibold ${
                theme === 'dark' ? 'text-red-300' : 'text-red-600'
              }`}>
                {language === 'ar' 
                  ? "النتيجة؟ ميزانيات مهدرة، فرص ضائعة، وتسويق يبدو وكأنه قمار."
                  : "The result? Wasted budgets, missed opportunities, and marketing that feels like gambling."
                }
              </p>
            </div>

            {/* Solution */}
            <div className={`p-8 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-green-900/20 border border-green-800' 
                : 'bg-white border-l-4 border-green-500 shadow-lg'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-green-300' : 'text-green-600'
              }`}>
                {language === 'ar' ? "Morvo AI يحل كل شيء:" : "Morvo AI Solves Everything:"}
              </h3>
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {solution.text}
                    </span>
                  </div>
                ))}
              </div>
              <p className={`mt-6 font-semibold ${
                theme === 'dark' ? 'text-green-300' : 'text-green-600'
              }`}>
                {language === 'ar' 
                  ? "النتيجة؟ تسويق يعمل مثل السحر، لكنه في الواقع مجرد ذكاء فائق."
                  : "The result? Marketing that works like magic, but it's actually just superior intelligence."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? "Morvo AI بالأرقام" : "Morvo AI By The Numbers"}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center p-6 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                  {stat.labelSecondary && (
                    <>
                      <br />
                      {stat.labelSecondary}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 ${
        theme === 'dark' 
          ? 'bg-gray-900' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'ar' ? "قصص التحول" : "Transformation Stories"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className={`mb-4 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {testimonial.position}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {language === 'ar' ? "ثورة التسويق هنا" : "The Marketing Revolution is Here"}
            <br />
            <span className="text-2xl md:text-3xl">
              {language === 'ar' ? "السؤال الوحيد هو: هل أنت داخل أم خارج؟" : "The Only Question is: Are You In or Out?"}
            </span>
          </h2>
          <p className={`text-xl mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {language === 'ar' 
              ? "انضم للثورة. قُد المستقبل. مستقبل التسويق وكيل. مستقبل التسويق هو Morvo AI. مستقبل التسويق الآن."
              : "Join the revolution. Command the future. The future of marketing is agentic. The future of marketing is Morvo AI. The future of marketing is now."
            }
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => setShowChat(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Rocket className="w-5 h-5 mr-2" />
              {language === 'ar' ? "ابدأ تحولك الآن" : "Start Your Transformation Now"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className={`flex flex-wrap justify-center gap-6 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>🎯 {language === 'ar' ? 'تجربة مجانية لمدة 14 يوماً' : 'Free 14-day trial'}</span>
              <span>⚡ {language === 'ar' ? 'إعداد في 5 دقائق' : 'Setup in 5 minutes'}</span>
              <span>💰 {language === 'ar' ? 'عائد مضمون' : 'ROI guaranteed'}</span>
              <span>🚀 {language === 'ar' ? 'إلغاء في أي وقت' : 'Cancel anytime'}</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
