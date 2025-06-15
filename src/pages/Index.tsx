
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
      title: "ثورة التسويق هنا - تعرف على Morvo AI",
      subtitle: "أول ذكاء تسويقي عائل في العالم",
      description:
        "9 عملاء ذكاء اصطناعي. إمكانيات لا نهائية. حوّل استراتيجية التسويق الخاصة بك مع الذكاء الاصطناعي المستقل الذي يفكر ويتعلم وينفذ مثل أفضل فريق تسويق لديك - ولكن أسرع 100 مرة.",
      startButton: "ابدأ التحول",
      demoButton: "احجز عرضاً تجريبياً",
      stats: [
        { number: "500%", label: "زيادة متوسط العائد" },
        { number: "90%", label: "تقليل المهام اليدوية" },
        { number: "94%", label: "دقة التنبؤ" },
        { number: "24/7", label: "تشغيل مستقل" },
      ],
    },
    features: {
      title: "لماذا Morvo AI يغير كل شيء",
      subtitle: "فجر ذكاء التسويق العائل",
      items: [
        {
          icon: "🧠",
          title: "اتخاذ القرارات المستقل",
          description: "فريق التسويق الذكي الذي لا ينام أبداً",
          points: [
            "تحليل تحركات المنافسين في الوقت الفعلي",
            "تحسين تصنيفات SEO تلقائياً",
            "إنشاء محتوى وسائل التواصل الاجتماعي الفيروسي",
          ],
        },
        {
          icon: "🤝",
          title: "تعاون الوكلاء الذكي",
          description: "9 متخصصين، استراتيجية موحدة",
          points: [
            "منسق رئيسي - ينظم كل شيء بسلاسة",
            "متخصص SEO - يهيمن على التصنيفات 24/7",
            "خبير وسائل التواصل - ينشئ محتوى فيروسي",
          ],
        },
        {
          icon: "⚡",
          title: "التكيف في الوقت الفعلي",
          description: "ذكاء اصطناعي يتطور مع عملك",
          points: [
            "اكتشاف تحولات السوق في أجزاء من الثانية",
            "تعديل الاستراتيجيات تلقائياً",
            "تحسين الحملات في الوقت الفعلي",
          ],
        },
      ],
    },
    problemSolution: {
      problem: {
        title: "التسويق معطل. إليك السبب:",
        points: [
          "تغرق في أدوات لا تتحدث مع بعضها البعض",
          "يقضي فريقك 80% من الوقت في مهام يدوية",
          "الرؤى تأتي متأخرة جداً لتهم",
        ],
        result: "النتيجة؟ ميزانيات مهدورة، فرص ضائعة، وتسويق يبدو كالقمار.",
      },
      solution: {
        title: "Morvo AI يحل كل شيء:",
        points: [
          "ذكاء موحد يربط كل شيء",
          "99% أتمتة مع 1% إشراف بشري",
          "رؤى تنبؤية توجه القرارات قبل أن تهم",
        ],
        result: "النتيجة؟ تسويق يعمل كالسحر، لكنه في الواقع مجرد ذكاء متفوق.",
      },
    },
    transformation: {
      title: "قصص التحول",
      before: {
        title: "قبل Morvo AI",
        quote: "كان لدينا 12 أداة تسويق مختلفة، 3 وكالات، ولا نزال لا نستطيع معرفة سبب عدم نجاح حملاتنا.",
        author: "سارة تشين، مديرة التسويق",
      },
      after: {
        title: "بعد Morvo AI",
        quote: "استبدل Morvo AI مجموعة أدوات التسويق بأكملها وضاعف عائد الاستثمار ثلاث مرات في 60 يوماً.",
        author: "سارة تشين (بعد 3 أشهر)",
      },
      results: {
        title: "النتائج",
        stats: "زيادة 300% في عائد الاستثمار، توفير 90% من الوقت، 500% المزيد من العملاء المحتملين",
      },
    },
    uniqueValue: {
      title: "ما يجعل Morvo AI مستحيل التجاهل",
      items: [
        {
          icon: "🎯",
          title: "التسويق التنبؤي",
          description: "اطلع على المستقبل قبل حدوثه. يتنبأ ذكاؤنا الاصطناعي بتوجهات السوق بدقة 94%.",
        },
        {
          icon: "🔄",
          title: "التنفيذ المستقل",
          description: "حدد أهدافك مرة واحدة. شاهد Morvo يحققها تلقائياً. لا حاجة لإدارة يومية.",
        },
        {
          icon: "🌍",
          title: "ذكاء ثنائي اللغة",
          description: "طلاقة في الإنجليزية والعربية، مع فهم الفروق الثقافية.",
        },
      ],
    },
    socialProof: {
      title: "آراء العملاء",
      testimonials: [
        {
          quote: "لم يحسن Morvo AI تسويقنا فحسب - بل ثوّر عملنا بأكمله.",
          author: "أحمد الراشد، الرئيس التنفيذي",
        },
        {
          quote: "ظننت أنني أفهم التسويق حتى التقيت بـ Morvo AI. إنه مثل وجود كرة بلورية.",
          author: "جنيفر مارتينيز، المؤسسة",
        },
        {
          quote: "فريقنا التسويقي كان متشككاً من الذكاء الاصطناعي. الآن لا يستطيعون تخيل العمل بدون Morvo.",
          author: "ديفيد كيم، نائب رئيس التسويق",
        },
      ],
      stats: [
        { number: "500%", label: "زيادة متوسط العائد" },
        { number: "90%", label: "تقليل المهام اليدوية" },
        { number: "94%", label: "دقة التنبؤ" },
        { number: "24/7", label: "تشغيل مستقل" },
      ],
    },
    urgency: {
      title: "تسعير الإطلاق الثوري",
      subtitle: "متاح لأول 1000 عميل فقط",
      offer: {
        title: "الوصول لإصدار المؤسس",
        features: [
          "جميع الـ 9 وكلاء ذكاء اصطناعي مشمولين",
          "حملات وتحليلات غير محدودة",
          "دعم أولوية 24/7",
        ],
        normalPrice: "عادة 2,997 دولار/شهر",
        launchPrice: "سعر الإطلاق: 497 دولار/شهر",
        lockIn: "احتفظ بهذا السعر إلى الأبد",
        remaining: "847 مكان متبقي",
        priceIncrease: "السعر يرتفع إلى 997 دولار/شهر خلال 7 أيام",
        ctaButton: "احجز مكانك الآن",
        disclaimer: "هذا العرض ينتهي عند وصولنا لـ 1000 عميل أو خلال 7 أيام، أيهما أولاً.",
      },
    },
    finalCta: {
      title: "الثورة تبدأ الآن",
      description:
        "السؤال الوحيد هو: هل أنت معنا أم خارجها؟",
      points: [
        "كل يوم تنتظر فيه يوم يتقدم منافسوك",
        "كل حملة تديرها يدوياً إمكانية مهدورة",
        "كل فكرة تفوتك إيرادات ضائعة",
      ],
      callToAction: "انضم للثورة. تحكم في المستقبل.",
      button: "ابدأ تحولك الآن",
      features: [
        "تجربة مجانية 14 يوم",
        "إعداد في 5 دقائق",
        "عائد استثمار مضمون",
        "إلغاء في أي وقت",
      ],
      closing: "مستقبل التسويق عائل. مستقبل التسويق هو Morvo AI. مستقبل التسويق هو الآن.",
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

      {/* Revolutionary Features Section */}
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
              {t.features.title}
            </h2>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } max-w-3xl mx-auto`}
            >
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3
                  className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } leading-relaxed mb-6`}
                >
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.points.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className={`flex items-start gap-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Problem */}
            <div
              className={`p-8 rounded-2xl border ${
                theme === "dark"
                  ? "bg-red-900/20 border-red-800/50"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {t.problemSolution.problem.title}
              </h3>
              <ul className="space-y-3">
                {t.problemSolution.problem.points.map((point, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="text-red-500 mt-1 text-lg">❌</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p
                className={`mt-6 font-semibold ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {t.problemSolution.problem.result}
              </p>
            </div>

            {/* Solution */}
            <div
              className={`p-8 rounded-2xl border ${
                theme === "dark"
                  ? "bg-green-900/20 border-green-800/50"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                {t.problemSolution.solution.title}
              </h3>
              <ul className="space-y-3">
                {t.problemSolution.solution.points.map((point, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="text-green-500 mt-1 text-lg">✅</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p
                className={`mt-6 font-semibold ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                {t.problemSolution.solution.result}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Story */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-gray-800/50" : "bg-gray-50/50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {t.transformation.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Before */}
            <div
              className={`p-6 rounded-xl border ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {t.transformation.before.title}
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } italic leading-relaxed`}
              >
                "{t.transformation.before.quote}"
              </p>
              <p
                className={`mt-4 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                - {t.transformation.before.author}
              </p>
            </div>

            {/* After */}
            <div
              className={`p-6 rounded-xl border ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                {t.transformation.after.title}
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } italic leading-relaxed`}
              >
                "{t.transformation.after.quote}"
              </p>
              <p
                className={`mt-4 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                - {t.transformation.after.author}
              </p>
            </div>
          </div>

          {/* Results */}
          <div
            className={`text-center p-6 rounded-xl border ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-800/50"
                : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
            }`}
          >
            <h4
              className={`text-lg font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {t.transformation.results.title}
            </h4>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t.transformation.results.stats}
            </p>
          </div>
        </div>
      </section>

      {/* Unique Value Propositions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {t.uniqueValue.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.uniqueValue.items.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3
                  className={`text-lg font-bold mb-3 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } leading-relaxed`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
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
              {t.socialProof.title}
            </h2>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {t.socialProof.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <p
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } italic mb-4 leading-relaxed`}
                >
                  "{testimonial.quote}"
                </p>
                <p
                  className={`text-sm font-semibold ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  - {testimonial.author}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.socialProof.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-2xl md:text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-2`}
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
      </section>

      {/* Urgency/Scarcity Section */}
      <section className="py-20">
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
              {t.urgency.title}
            </h2>
            <p
              className={`text-lg mb-8 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t.urgency.subtitle}
            </p>

            <div
              className={`p-6 rounded-xl border mb-8 ${
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {t.urgency.offer.title}
              </h3>
              <ul className="space-y-2 mb-6">
                {t.urgency.offer.features.map((feature, index) => (
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
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  } line-through`}
                >
                  {t.urgency.offer.normalPrice}
                </p>
                <p
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {t.urgency.offer.launchPrice}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t.urgency.offer.lockIn}
                </p>
              </div>

              <div className="mb-6">
                <p
                  className={`${
                    theme === "dark" ? "text-orange-400" : "text-orange-600"
                  } font-semibold`}
                >
                  {t.urgency.offer.remaining}
                </p>
                <p
                  className={`${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  } font-semibold`}
                >
                  {t.urgency.offer.priceIncrease}
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold"
              >
                {t.urgency.offer.ctaButton}
              </Button>
            </div>

            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } italic`}
            >
              {t.urgency.offer.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-gray-800/50" : "bg-gray-50/50"
        }`}
      >
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

          <div className="space-y-4 mb-8">
            {t.finalCta.points.map((point, index) => (
              <p
                key={index}
                className={`text-lg ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {point}
              </p>
            ))}
          </div>

          <p
            className={`text-2xl font-bold mb-8 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.finalCta.callToAction}
          </p>

          <Button
            size="lg"
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200 mb-8"
          >
            {t.finalCta.button}
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {t.finalCta.features.map((feature, index) => (
              <div
                key={index}
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {feature}
              </div>
            ))}
          </div>

          <p
            className={`text-2xl font-bold mt-8 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.finalCta.closing}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
