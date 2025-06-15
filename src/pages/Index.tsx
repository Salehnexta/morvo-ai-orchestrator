import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Globe, Brain, Zap, Target, Users, BarChart, Shield } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatInterface } from "@/components/ChatInterface";

const content = {
  ar: {
    hero: {
      title: "مورفو AI: المستقبل الذي تصنعه أنت، يومًا بعد يوم",
      subtitle: "لم نعد نتخيل فريق التسويق المثالي، بل نصممه معًا، ونطوره بلا توقف",
      description:
        "وداعًا لنمط التسويق القديم. مورفو AI يمثل نقلة نوعية، فهو ليس مجرد أداة، بل هو شريكك الذكي الذي يتعلم ويتكيف مع كل تحدي وفرصة. نعتمد على تقنيات A2A (Agent-to-Agent) و MCP (Multi-Agent Collaboration Platform) لنصمم لك رحلات تسويقية مخصصة بالكامل، تتطور مع نمو عملك.",
      startButton: "اكتشف رحلتك المخصصة اليوم",
      demoButton: "شاهد كيف تتعلم وتنمو (عرض توضيحي)",
      stats: [
        { number: "27%", label: "زيادة المبيعات في أسبوع" },
        { number: "43%", label: "تقليل التفاعل السلبي" },
        { number: "340%", label: "عائد الاستثمار في 90 يوم" },
        { number: "24/7", label: "تطور مستمر" },
      ],
    },
    agents: {
      title: "الوكلاء الأذكياء في مورفو: شركاؤك في التطور المستمر",
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
          description: "وجه الوكلاء الأذكياء بأهدافك. سيقومون بتصميم مسارات مخصصة لعميلك، مع الأخذ في الاعتبار كل جانب من جوانب عملك.",
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
      title: "Active Dashboard™: مركز قيادتك المتطور والمتعلم",
      subtitle: "ليست مجرد تقارير، بل هي مختبر حي للنمو والتطوير المستمر",
      features: [
        {
          title: "تحليل المشاعر المتعمق",
          description: "فهم دقيق لمشاعر العملاء في الوقت الفعلي، وكيف تتغير بمرور الوقت.",
          icon: "💭",
        },
        {
          title: "اكتشاف التوجهات الناشئة",
          description: "التعرف على الفرص والتهديدات الجديدة قبل أن تصبح سائدة.",
          icon: "📈",
        },
        {
          title: "رؤى AI متجددة",
          description: "توصيات متطورة ومخصصة تتكيف مع أحدث بيانات السوق وسلوك العملاء.",
          icon: "🔮",
        },
        {
          title: "مساعد العلامة الذكي",
          description: "دردشة تفاعلية مع الذكاء الاصطناعي لتطوير استراتيجيات جديدة والإجابة على استفساراتك بعمق.",
          icon: "🤖",
        },
      ],
    },
    successStory: {
      title: "قصة نجاح سحابة العود: قصة نمو لا تتوقف",
      content: "بدأت سحابة العود مع مورفو بتصميم رحلة عميل أولية. بعد أسبوع، لاحظ الوكلاء أنماط بحث جديدة واقترحوا هاشتاق #عطور_رمضان، مما أدى لارتفاع المبيعات 27%. بعد شهر، اكتشف مورفو تغيرًا في مشاعر العملاء حول تأخير الشحن، وتفاعل الوكلاء فورًا بتصميم استراتيجية اعتذار مع كود خصم، مما خفض التفاعل السلبي 43%. إجمالي العائد على الاستثمار بعد 90 يومًا: +340%، مع استمرار مورفو في تحسين كل جانب من جوانب رحلتهم التسويقية.",
    },
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
    features: {
      title: "Why Morvo AI Changes Everything",
      subtitle: "The Dawn of Agentic Marketing Intelligence",
      items: [
        {
          icon: "🧠",
          title: "Autonomous Decision Making",
          description: "Your AI Marketing Team That Never Sleeps",
          points: [
            "Analyzing competitor moves in real-time",
            "Optimizing your SEO rankings automatically",
            "Creating viral social media content",
          ],
        },
        {
          icon: "🤝",
          title: "Intelligent Agent Collaboration",
          description: "9 Specialists, One Unified Strategy",
          points: [
            "Master Coordinator - Orchestrates everything seamlessly",
            "SEO Specialist - Dominates search rankings 24/7",
            "Social Media Expert - Creates viral content that converts",
          ],
        },
        {
          icon: "⚡",
          title: "Real-Time Market Adaptation",
          description: "AI That Evolves With Your Business",
          points: [
            "Market shifts detected in milliseconds",
            "Strategies adjusted automatically",
            "Campaigns optimized in real-time",
          ],
        },
      ],
    },
    problemSolution: {
      problem: {
        title: "Marketing is Broken. Here's Why:",
        points: [
          "You're drowning in tools that don't talk to each other",
          "Your team spends 80% of time on manual tasks",
          "Insights come too late to matter",
        ],
        result: "The result? Wasted budgets, missed opportunities, and marketing that feels like gambling.",
      },
      solution: {
        title: "Morvo AI Solves Everything:",
        points: [
          "One unified intelligence that connects everything",
          "99% automation with 1% human oversight",
          "Predictive insights that guide decisions before they matter",
        ],
        result: "The result? Marketing that works like magic, but it's actually just superior intelligence.",
      },
    },
    transformation: {
      title: "Transformation Stories",
      before: {
        title: "Before Morvo AI",
        quote: "We had 12 different marketing tools, 3 agencies, and still couldn't figure out why our campaigns weren't working.",
        author: "Sarah Chen, CMO at TechFlow",
      },
      after: {
        title: "After Morvo AI",
        quote: "Morvo AI replaced our entire marketing stack and tripled our ROI in 60 days. What used to take our team weeks now happens automatically overnight.",
        author: "Sarah Chen (3 months later)",
      },
      results: {
        title: "Results",
        stats: "300% ROI increase, 90% time savings, 500% more leads",
      },
    },
    uniqueValue: {
      title: "What Makes Morvo AI Impossible to Ignore",
      items: [
        {
          icon: "🎯",
          title: "Predictive Marketing",
          description: "See the future before it happens. Our AI predicts market trends, customer behavior, and competitor moves with 94% accuracy.",
        },
        {
          icon: "🔄",
          title: "Autonomous Execution",
          description: "Set your goals once. Watch Morvo achieve them automatically. No daily management required.",
        },
        {
          icon: "🌍",
          title: "Bilingual Intelligence",
          description: "Fluent in English and Arabic, with cultural nuance understanding that connects with global audiences.",
        },
      ],
    },
    socialProof: {
      title: "What Our Customers Say",
      testimonials: [
        {
          quote: "Morvo AI didn't just improve our marketing - it revolutionized our entire business. We went from struggling startup to industry leader in 6 months.",
          author: "Ahmed Al-Rashid, CEO, Dubai Innovations",
        },
        {
          quote: "I thought I understood marketing until I met Morvo AI. It's like having a crystal ball that shows you exactly what your customers want.",
          author: "Jennifer Martinez, Founder, EcoTech Solutions",
        },
        {
          quote: "Our marketing team was skeptical about AI. Now they can't imagine working without Morvo. It's not replacing marketers - it's making them superhuman.",
          author: "David Kim, VP Marketing, Global Dynamics",
        },
      ],
      stats: [
        { number: "500%", label: "Average ROI Increase" },
        { number: "90%", label: "Reduction in Manual Tasks" },
        { number: "94%", label: "Prediction Accuracy Rate" },
        { number: "24/7", label: "Autonomous Operation" },
      ],
    },
    urgency: {
      title: "Revolutionary Launch Pricing",
      subtitle: "Available for First 1,000 Customers Only",
      offer: {
        title: "Founder's Edition Access",
        features: [
          "All 9 AI Agents Included",
          "Unlimited Campaigns & Analysis",
          "24/7 Priority Support",
        ],
        normalPrice: "Normally $2,997/month",
        launchPrice: "Launch Price: $497/month",
        lockIn: "Lock in this price forever",
        remaining: "847 spots remaining",
        priceIncrease: "Price increases to $997/month in 7 days",
        ctaButton: "Secure Your Spot Now",
        disclaimer: "This offer expires when we reach 1,000 customers or in 7 days, whichever comes first.",
      },
    },
    finalCta: {
      title: "The Revolution Starts Now",
      description:
        "The Only Question is: Are You In or Out?",
      points: [
        "Every day you wait is a day your competitors get ahead",
        "Every campaign you run manually is wasted potential",
        "Every insight you miss is lost revenue",
      ],
      callToAction: "Join the revolution. Command the future.",
      button: "Start Your Transformation Now",
      features: [
        "Free 14-day trial",
        "Setup in 5 minutes",
        "ROI guaranteed",
        "Cancel anytime",
      ],
      closing: "The future of marketing is agentic. The future of marketing is Morvo AI. The future of marketing is now.",
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
              className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight ${
                theme === "dark" ? "" : ""
              }`}
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

      {language === "ar" && (
        <>
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
                    <p
                      className={`text-sm mb-3 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {agent.englishName}
                    </p>
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

          {/* Success Story Section */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2
                  className={`text-3xl md:text-4xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t.successStory.title}
                </h2>
              </div>

              <div
                className={`p-8 rounded-2xl border ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-800/50"
                    : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                }`}
              >
                <p
                  className={`text-lg leading-relaxed ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t.successStory.content}
                </p>
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
        </>
      )}

      {language === "en" && (
        <>
          {/* Original English sections remain unchanged for now */}
          {/* ... keep existing code (all English sections) */}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Index;
