import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Brain } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatInterface } from "@/components/ChatInterface";

const content = {
  ar: {
    hero: {
      title: "مورفو: الثورة التالية في الماركتينغ تبدأ هنا",
      subtitle: "لم نعد نتخيل فريق التسويق المثالي، بل نصممه معًا، ونطوره بلا توقف",
      description:
        `مع مورفو AI، لن تحتاج إلى توظيف فريق تسويق كامل أو التعامل مع عشرات الأدوات المتفرقة.
أنت الآن تملك وكيل تسويق ذكي يعمل نيابةً عنك على مدار الساعة，
يقوم تلقائيًا بـ صياغة الاستراتيجية، إنشاء المحتوى العربي والإنجليزي، تحسين نتائج البحث، إدارة الحملات الإعلانية، متابعة المنافسين، تحليل الأداء، والتفاعل مع جمهورك — كل ذلك دون تدخل يدوي`,
      startButton: "اكتشف رحلتك المخصصة اليوم",
      demoButton: "شاهد كيف تتعلم وتنمو (عرض توضيحي)",
      stats: [
        { number: "27%", label: "زيادة المبيعات في أسبوع" },
        { number: "43%", label: "التقليل من التفاعل السلبي" },
        { number: "340%", label: "عائد الاستثمار في 90 يوم" },
        { number: "24/7", label: "تطور مستمر" },
      ],
    },
    agents: {
      title: "خبراء مورفو الرقميون: يقودون نموك خطوة بخطوة",
      subtitle: "نحن لا نقدم قوالب جاهزة، بل خبراء رقميون يتفاعلون معًا ومع بياناتك، لإنشاء حلول ديناميكية",
      items: [
        {
          name: "مهندس رحلة العميل",
          englishName: "Customer Journey Architect",
          description: "يصمم ويحسن رحلات العملاء المخصصة بالكامل، بناءً على تعلم مستمر من سلوكهم.",
        },
        {
          name: "خبير التوسع الرقمي",
          englishName: "Digital Expansion Expert",
          description: "يكتشف فرص النمو الجديدة ويحسن التواجد الرقمي بشكل مستمر بناءً على أحدث التغيرات.",
        },
        {
          name: "مبتكر المحتوى التفاعلي",
          englishName: "Interactive Content Innovator",
          description: "يبتكر محتوى يحفز التفاعل العميق، ويتعلم من استجابات الجمهور لتحسين الجودة.",
        },
        {
          name: "محلل الرؤى الإستراتيجية",
          englishName: "Strategic Insights Analyst",
          description: "يحول البيانات المعقدة إلى رؤى قابلة للتنفيذ، مع تعلم مستمر لأنماط السوق.",
        },
        {
          name: "مصمم استراتيجيات التواصل",
          englishName: "Communication Strategy Designer",
          description: "يصيغ رسائل مقنعة ويبني ولاء العملاء من خلال استراتيجيات تواصل تتكيف يوميًا.",
        },
        {
          name: "مراقب السمعة التفاعلي",
          englishName: "Proactive Reputation Monitor",
          description: "يراقب سمعة علامتك التجارية بشكل استباقي، ويتفاعل مع التحديات والفرص فورًا.",
        },
        {
          name: "رائد السوق الاستباقي",
          englishName: "Proactive Market Pioneer",
          description: "يحلل المنافسين ويكشف عن الاتجاهات الناشئة، ليمنحك ميزة تنافسية دائمة.",
        },
        {
          name: "محسن الأداء المدفوع",
          englishName: "Paid Performance Optimizer",
          description: "يدير ويحسن حملاتك الإعلانية باستمرار، لضمان أعلى عائد استثمار ممكن.",
        },
        {
          name: "مطور العلاقات الرقمية",
          englishName: "Digital Relationship Developer",
          description: "يبني ويعزز العلاقات مع جمهورك عبر قنوات متنوعة، ويتعلم من كل تفاعل.",
        },
      ],
    },
    process: {
      title: "كيف يصمم مورفو المستقبل معك؟",
      subtitle: "بفضل تقنيات A2A و MCP، لم تعد العملية مجرد توصيل وأمر. إنها دورة مستمرة من التعلم والتكيف",
      steps: [
        {
          title: "ابنِ (Build)",
          description: "اربط حساباتك الرقمية. يبدأ مورفو بإنشاء نموذج أولي لرحلتك التسويقية استنادًا إلى بياناتك وأهدافك.",
          icon: "🔗",
        },
        {
          title: "صمم (Design)",
          description: "وجه الخبراء الأذكياء بأهدافك. سيقومون بتصميم مسارات مخصصة لعميلك، مع الأخذ في الاعتبار كل جانب من جوانب عملك.",
          icon: "🎨",
        },
        {
          title: "تعلّم وتكيّف (Learn & Adapt)",
          description: "شاهد كيف تتطور لوحة تحكم Active Dashboard™ الحية. الوكلاء يتعلمون من كل تفاعل، يحددون الأنماط، ويقدمون لك توصيات فورية ودقيقة لتحسين الأداء يومًا بعد يوم.",
          icon: "🧠",
        },
      ],
    },
    dashboard: {
      title: "لوحة تحكم تفاعلية : تحكم أذكى، قرارات أسرع، تطور مستمر",
      subtitle: "يعرض لك الواقع بدقة... ويكشف لك القادم",
      features: [
        {
          title: "تحليل المشاعر المتعمق",
          description: "فهم دقيق لمشاعر العملاء في الوقت الفعلي، وكيف تتغير بمرور الوقت.",
          icon: "💭",
        },
        {
          title: "اكتشاف التوجهات الناشئة",
          description: "نكتشف الجديد قبل أن يصبح اتجاهًا.",
          icon: "📈",
        },
        {
          title: "رؤى ذكية ومتجددة",
          description: "تحليلات فورية… وتوصيات مخصصة تواكب السوق والعملاء.",
          icon: "🔮",
        },
        {
          title: "مساعد العلامة الذكي",
          description: "دردشة تفاعلية مع الذكاء الاصطناعي لتطوير استراتيجيات جديدة والإجابة على استفساراتك بعمق.",
          icon: "🤖",
        },
      ],
    },
    // تم حذف successStory من العربية
    pricing: {
      title: "باقة المؤسس (عرض حصري ومحدود)",
      price: "1,870 ريال/شهر",
      subtitle: "السعر ثابت لك مدى الحياة",
      features: [
        "جميع وكلاء AI التسعة المتطورين",
        "مصادر بيانات غير محدودة",
        "لوحة تحكم Active Dashboard™ المتعلمة",
        "دعم فني استباقي على مدار الساعة",
        "تقارير مخصصة بعلامتك التجارية تتطور معك",
        "إلغاء الاشتراك في أي وقت",
      ],
      remaining: "متبقٍ 847 اشتراكًا فقط",
      urgency: "السعر يرتفع عند نفاد الكمية أو بعد 7 أيام",
      ctaButton: "صمم مستقبلك مع مورفو الآن",
    },
    finalCta: {
      title: "لا تنتظر المستقبل، بل صممه وتكيف معه يوميًا",
      description: "مورفو AI هو الحل لمن يبحث عن نظام تسويقي يتطور معه، يتعلم من بياناته، ويصمم له مسارات نمو فريدة. جربه الآن وشاهد كيف يتحول التحليل المعقد إلى قرارات بسيطة ونتائج عظيمة، تتطور معك ومع أعمالك.",
      question: "هل أنت مستعد لتصميم مستقبل تسويقك مع مورفو؟",
      button: "ابدأ رحلتك الآن",
    },
  },
  en: {
    hero: {
      title: "The Marketing Revolution is Here",
      subtitle: "Meet Morvo AI - The World's First Agentic Marketing Intelligence",
      description:
        "9 AI Agents. Infinite Possibilities. Transform your marketing strategy with autonomous AI that thinks, learns, and executes like your best marketing team - but 100x faster.",
      startButton: "Start Your AI Transformation",
      demoButton: "Book a Demo",
      stats: [
        { number: "500%", label: "Average ROI Increase" },
        { number: "90%", label: "Reduction in Manual Tasks" },
        { number: "94%", label: "Prediction Accuracy Rate" },
        { number: "24/7", label: "Autonomous Operation" },
      ],
    },
    agents: {
      title: "Meet Your 9 AI Marketing Agents",
      subtitle: "Specialized experts working together to transform your marketing",
      items: [
        {
          name: "Customer Journey Architect",
          englishName: "Customer Journey Architect",
          description: "Designs and optimizes personalized customer journeys through continuous learning from behavior patterns.",
        },
        {
          name: "Digital Expansion Expert",
          englishName: "Digital Expansion Expert", 
          description: "Discovers new growth opportunities and continuously improves digital presence based on latest changes.",
        },
        {
          name: "Interactive Content Innovator",
          englishName: "Interactive Content Innovator",
          description: "Creates content that drives deep engagement and learns from audience responses to improve quality.",
        },
        {
          name: "Strategic Insights Analyst",
          englishName: "Strategic Insights Analyst",
          description: "Transforms complex data into actionable insights with continuous learning of market patterns.",
        },
        {
          name: "Communication Strategy Designer",
          englishName: "Communication Strategy Designer",
          description: "Crafts compelling messages and builds customer loyalty through daily-adaptive communication strategies.",
        },
        {
          name: "Proactive Reputation Monitor",
          englishName: "Proactive Reputation Monitor",
          description: "Proactively monitors your brand reputation and instantly responds to challenges and opportunities.",
        },
        {
          name: "Proactive Market Pioneer",
          englishName: "Proactive Market Pioneer",
          description: "Analyzes competitors and reveals emerging trends to give you a permanent competitive advantage.",
        },
        {
          name: "Paid Performance Optimizer",
          englishName: "Paid Performance Optimizer",
          description: "Continuously manages and optimizes your advertising campaigns for maximum ROI.",
        },
        {
          name: "Digital Relationship Developer",
          englishName: "Digital Relationship Developer",
          description: "Builds and strengthens relationships with your audience across multiple channels, learning from every interaction.",
        },
      ],
    },
    process: {
      title: "How Morvo Designs Your Future",
      subtitle: "A continuous cycle of learning and adaptation powered by A2A and MCP technologies",
      steps: [
        {
          title: "Build",
          description: "Connect your digital accounts. Morvo creates an initial model of your marketing journey based on your data and goals.",
          icon: "🔗",
        },
        {
          title: "Design", 
          description: "Guide the intelligent agents with your objectives. They'll design custom paths for your customers, considering every aspect of your business.",
          icon: "🎨",
        },
        {
          title: "Learn & Adapt",
          description: "Watch the Active Dashboard™ evolve in real-time. Agents learn from every interaction, identify patterns, and provide instant, precise recommendations for daily performance improvement.",
          icon: "🧠",
        },
      ],
    },
    dashboard: {
      title: "Active Dashboard™: Your Evolving Command Center",
      subtitle: "Not just reports, but a living laboratory for continuous growth and development",
      features: [
        {
          title: "Deep Sentiment Analysis",
          description: "Precise understanding of customer emotions in real-time and how they change over time.",
          icon: "💭",
        },
        {
          title: "Emerging Trend Discovery",
          description: "Identify new opportunities and threats before they become mainstream.",
          icon: "📈",
        },
        {
          title: "Renewable AI Insights",
          description: "Advanced, personalized recommendations that adapt to the latest market data and customer behavior.",
          icon: "🔮",
        },
        {
          title: "Smart Brand Assistant",
          description: "Interactive AI chat for developing new strategies and answering your questions in depth.",
          icon: "🤖",
        },
      ],
    },
    // تم حذف successStory من العربية
    pricing: {
      title: "Founder's Package (Exclusive Limited Offer)",
      price: "$497/month",
      subtitle: "Price locked for life",
      features: [
        "All 9 Advanced AI Agents",
        "Unlimited Data Sources",
        "Learning Active Dashboard™",
        "24/7 Proactive Technical Support",
        "Custom Branded Reports That Evolve With You",
        "Cancel Anytime",
      ],
      remaining: "Only 847 subscriptions remaining",
      urgency: "Price increases when sold out or after 7 days",
      ctaButton: "Design Your Future with Morvo Now",
    },
    finalCta: {
      title: "Don't Wait for the Future, Design and Adapt to It Daily",
      description: "Morvo AI is the solution for those seeking a marketing system that evolves with them, learns from their data, and designs unique growth paths. Try it now and see how complex analysis transforms into simple decisions and great results that evolve with you and your business.",
      question: "Are you ready to design your marketing future with Morvo?",
      button: "Start Your Journey Now",
    },
  },
};

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const t = content[language];

  if (isChatOpen) {
    return <ChatInterface onBack={() => setIsChatOpen(false)} />;
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      } ${language === "ar" ? "font-cairo" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header onStartChat={() => setIsChatOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Headline */}
            <h1
              className={`${
                language === "ar"
                  ? "text-4xl md:text-5xl lg:text-5xl"
                  : "text-4xl md:text-6xl lg:text-7xl"
              } font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight`}
            >
              {t.hero.title}
            </h1>

            {/* Subheadline */}
            <p
              className={`text-xl md:text-2xl mb-8 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } max-w-4xl mx-auto leading-relaxed`}
            >
              {t.hero.subtitle}
            </p>

            {/* Hero Description */}
            <p
              className={`text-lg mb-12 ${
                theme === "dark" ? "text-gray-400" : "text-gray-700"
              } max-w-3xl mx-auto leading-relaxed`}
            >
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Brain className="w-5 h-5 mr-2" />
                {t.hero.startButton}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-4 text-lg font-semibold border-2 transition-all duration-200 ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Globe className="w-5 h-5 mr-2" />
                {t.hero.demoButton}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {t.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`text-2xl md:text-3xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-1`}
                  >
                    {stat.number}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-gray-800/50" : "bg-gray-50/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-5xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {t.agents.title}
            </h2>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } max-w-4xl mx-auto`}
            >
              {t.agents.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.agents.items.map((agent, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {agent.name}
                </h3>
                {language === "ar" && (
                  <p
                    className={`text-sm mb-3 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {agent.englishName}
                  </p>
                )}
                <p
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } leading-relaxed text-sm`}
                >
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {t.process.title}
            </h2>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } max-w-4xl mx-auto leading-relaxed`}
            >
              {t.process.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.process.steps.map((step, index) => (
              <div
                key={index}
                className={`text-center p-8 rounded-2xl border ${
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3
                  className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } leading-relaxed`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-gray-800/50" : "bg-gray-50/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {t.dashboard.title}
            </h2>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } max-w-3xl mx-auto`}
            >
              {t.dashboard.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {t.dashboard.features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border flex items-start gap-4 ${
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } leading-relaxed`}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-gray-800/50" : "bg-gray-50/50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`p-8 rounded-2xl border text-center ${
              theme === "dark"
                ? "bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-800/50"
                : "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
            }`}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {t.pricing.title}
            </h2>

            <div className="mb-6">
              <p
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                {t.pricing.price}
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t.pricing.subtitle}
              </p>
            </div>

            <ul className="space-y-2 mb-8">
              {t.pricing.features.map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-center gap-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="text-green-500">✅</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mb-6">
              <p
                className={`${
                  theme === "dark" ? "text-orange-400" : "text-orange-600"
                } font-semibold mb-2`}
              >
                {t.pricing.remaining}
              </p>
              <p
                className={`${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                } font-semibold`}
              >
                {t.pricing.urgency}
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => setIsChatOpen(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold"
            >
              {t.pricing.ctaButton}
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`text-3xl md:text-5xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.finalCta.title}
          </h2>
          <p
            className={`text-xl mb-8 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            } leading-relaxed`}
          >
            {t.finalCta.description}
          </p>

          <p
            className={`text-2xl font-bold mb-8 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.finalCta.question}
          </p>

          <Button
            size="lg"
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            {t.finalCta.button}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
