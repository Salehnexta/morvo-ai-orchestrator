import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatInterface from "@/components/ChatInterface";

const content = {
  ar: {
    hero: {
      title: "منصة زد - التجارة الذكية تبدأ هنا",
      subtitle: "حلول متكاملة لتطوير متجرك الإلكتروني",
      description:
        "زد توفر لك كل ما تحتاجه لإدارة متجرك الإلكتروني بسهولة وفعالية، من تصميم إلى تسويق ودعم العملاء.",
      startButton: "ابدأ الآن",
      demoButton: "عرض تجريبي",
      stats: [
        { number: "10K+", label: "تاجر راضٍ" },
        { number: "500+", label: "شريك موثوق" },
        { number: "99.9%", label: "وقت تشغيل" },
        { number: "24/7", label: "دعم فني" },
      ],
    },
    features: {
      title: "ميزات ثورية",
      subtitle: "كل ما تحتاجه لتطوير تجارتك الإلكترونية",
      items: [
        {
          icon: "🚀",
          title: "سرعة الأداء",
          description: "منصة سريعة وموثوقة تضمن تجربة مستخدم ممتازة.",
          points: [
            "تحميل صفحات سريع",
            "تكامل مع خدمات CDN",
            "تحسين SEO تلقائي",
          ],
        },
        {
          icon: "🔒",
          title: "أمان متقدم",
          description: "حماية بياناتك وبيانات عملائك بأحدث التقنيات.",
          points: [
            "تشفير SSL",
            "حماية من الهجمات الإلكترونية",
            "نسخ احتياطي يومي",
          ],
        },
        {
          icon: "⚙️",
          title: "سهولة التخصيص",
          description: "تحكم كامل في تصميم ووظائف متجرك الإلكتروني.",
          points: [
            "قوالب جاهزة",
            "دعم الإضافات",
            "واجهة مستخدم سهلة الاستخدام",
          ],
        },
      ],
    },
    problemSolution: {
      problem: {
        title: "المشكلة",
        points: [
          "صعوبة إدارة المتجر الإلكتروني",
          "تكاليف عالية للتسويق والدعم",
          "قلة الأدوات المتكاملة",
        ],
        result: "تأثير سلبي على نمو المبيعات ورضا العملاء.",
      },
      solution: {
        title: "الحل",
        points: [
          "منصة متكاملة وسهلة الاستخدام",
          "تكلفة مناسبة مع دعم مستمر",
          "أدوات تسويق ودعم مدمجة",
        ],
        result: "زيادة المبيعات وتحسين تجربة العملاء.",
      },
    },
    transformation: {
      title: "قصة التحول",
      before: {
        title: "قبل زد",
        quote: "كنت أواجه صعوبات كبيرة في إدارة متجري الإلكتروني.",
        author: "عميل سابق",
      },
      after: {
        title: "بعد زد",
        quote: "زد غيرت طريقة عملي وزادت مبيعاتي بشكل ملحوظ.",
        author: "عميل سعيد",
      },
      results: {
        title: "النتائج",
        stats: "زيادة 150% في المبيعات خلال 6 أشهر.",
      },
    },
    uniqueValue: {
      title: "القيمة الفريدة",
      items: [
        {
          icon: "💡",
          title: "ابتكار مستمر",
          description: "نقدم أحدث الحلول والتقنيات باستمرار.",
        },
        {
          icon: "🤝",
          title: "دعم متميز",
          description: "فريق دعم متاح 24/7 لمساعدتك في كل خطوة.",
        },
        {
          icon: "📈",
          title: "نمو مستدام",
          description: "أدوات تساعدك على توسيع عملك بثقة.",
        },
      ],
    },
    socialProof: {
      title: "آراء العملاء",
      testimonials: [
        {
          quote: "أفضل منصة استخدمتها لإدارة متجري الإلكتروني.",
          author: "سارة",
        },
        {
          quote: "الدعم الفني سريع وفعال دائماً.",
          author: "محمد",
        },
        {
          quote: "زد ساعدتني على زيادة مبيعاتي بشكل كبير.",
          author: "ليلى",
        },
      ],
      stats: [
        { number: "4.9/5", label: "تقييم العملاء" },
        { number: "100K+", label: "مستخدم نشط" },
        { number: "500+", label: "شريك موثوق" },
        { number: "99.9%", label: "وقت تشغيل" },
      ],
    },
    urgency: {
      title: "عرض خاص لفترة محدودة",
      subtitle: "احصل على خصم خاص عند الاشتراك الآن",
      offer: {
        title: "الباقة المميزة",
        features: [
          "دعم فني 24/7",
          "تحديثات مجانية",
          "تكامل مع منصات التسويق",
        ],
        normalPrice: "السعر العادي: 2000 ريال/سنة",
        launchPrice: "السعر الحالي: 1200 ريال/سنة",
        lockIn: "سعر ثابت لمدة 3 سنوات",
        remaining: "عدد العروض المتبقية: 50",
        priceIncrease: "السعر سيرتفع قريباً",
        ctaButton: "اشترك الآن",
        disclaimer: "العرض ساري حتى نفاد الكمية.",
      },
    },
    finalCta: {
      title: "هل أنت مستعد للانطلاق؟",
      description:
        "انضم إلى آلاف التجار الذين يثقون في زد لتطوير أعمالهم.",
      points: [
        "سهولة الاستخدام",
        "دعم فني متميز",
        "تكلفة مناسبة",
        "نتائج مضمونة",
      ],
      callToAction: "ابدأ رحلتك معنا اليوم!",
      button: "ابدأ الآن",
      features: [
        "تجربة مجانية 14 يوم",
        "ضمان استرداد الأموال",
        "دعم فني 24/7",
        "تحديثات مستمرة",
      ],
      closing: "زد - شريكك في النجاح التجاري.",
    },
  },
  en: {
    hero: {
      title: "Zid Platform - Smart Commerce Starts Here",
      subtitle: "Integrated solutions to grow your online store",
      description:
        "Zid provides everything you need to manage your online store easily and effectively, from design to marketing and customer support.",
      startButton: "Start Now",
      demoButton: "Demo",
      stats: [
        { number: "10K+", label: "Satisfied Merchants" },
        { number: "500+", label: "Trusted Partners" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" },
      ],
    },
    features: {
      title: "Revolutionary Features",
      subtitle: "Everything you need to grow your e-commerce",
      items: [
        {
          icon: "🚀",
          title: "Fast Performance",
          description: "A fast and reliable platform ensuring excellent user experience.",
          points: [
            "Fast page loads",
            "CDN integration",
            "Automatic SEO optimization",
          ],
        },
        {
          icon: "🔒",
          title: "Advanced Security",
          description: "Protect your data and your customers' data with the latest technologies.",
          points: [
            "SSL encryption",
            "Protection from cyber attacks",
            "Daily backups",
          ],
        },
        {
          icon: "⚙️",
          title: "Easy Customization",
          description: "Full control over your store's design and functionality.",
          points: [
            "Ready-made templates",
            "Plugin support",
            "User-friendly interface",
          ],
        },
      ],
    },
    problemSolution: {
      problem: {
        title: "The Problem",
        points: [
          "Difficulty managing online store",
          "High marketing and support costs",
          "Lack of integrated tools",
        ],
        result: "Negative impact on sales growth and customer satisfaction.",
      },
      solution: {
        title: "The Solution",
        points: [
          "Integrated and easy-to-use platform",
          "Affordable cost with continuous support",
          "Built-in marketing and support tools",
        ],
        result: "Increased sales and improved customer experience.",
      },
    },
    transformation: {
      title: "Transformation Story",
      before: {
        title: "Before Zid",
        quote: "I faced great difficulties managing my online store.",
        author: "Former Client",
      },
      after: {
        title: "After Zid",
        quote: "Zid changed my business and significantly increased my sales.",
        author: "Happy Client",
      },
      results: {
        title: "Results",
        stats: "150% sales increase within 6 months.",
      },
    },
    uniqueValue: {
      title: "Unique Value",
      items: [
        {
          icon: "💡",
          title: "Continuous Innovation",
          description: "We constantly provide the latest solutions and technologies.",
        },
        {
          icon: "🤝",
          title: "Outstanding Support",
          description: "Support team available 24/7 to assist you every step.",
        },
        {
          icon: "📈",
          title: "Sustainable Growth",
          description: "Tools to help you confidently expand your business.",
        },
      ],
    },
    socialProof: {
      title: "Customer Reviews",
      testimonials: [
        {
          quote: "The best platform I've used to manage my online store.",
          author: "Sarah",
        },
        {
          quote: "Technical support is always fast and effective.",
          author: "Mohammed",
        },
        {
          quote: "Zid helped me significantly increase my sales.",
          author: "Laila",
        },
      ],
      stats: [
        { number: "4.9/5", label: "Customer Rating" },
        { number: "100K+", label: "Active Users" },
        { number: "500+", label: "Trusted Partners" },
        { number: "99.9%", label: "Uptime" },
      ],
    },
    urgency: {
      title: "Limited Time Offer",
      subtitle: "Get a special discount when you subscribe now",
      offer: {
        title: "Premium Package",
        features: [
          "24/7 Technical Support",
          "Free Updates",
          "Marketing Platform Integration",
        ],
        normalPrice: "Regular Price: $533/year",
        launchPrice: "Current Price: $320/year",
        lockIn: "Fixed price for 3 years",
        remaining: "Remaining offers: 50",
        priceIncrease: "Price will increase soon",
        ctaButton: "Subscribe Now",
        disclaimer: "Offer valid while supplies last.",
      },
    },
    finalCta: {
      title: "Ready to Launch?",
      description:
        "Join thousands of merchants who trust Zid to grow their business.",
      points: [
        "Ease of use",
        "Outstanding support",
        "Affordable cost",
        "Guaranteed results",
      ],
      callToAction: "Start your journey with us today!",
      button: "Start Now",
      features: [
        "14-day free trial",
        "Money-back guarantee",
        "24/7 technical support",
        "Continuous updates",
      ],
      closing: "Zid - Your partner in commercial success.",
    },
  },
};

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const t = content[language];

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
                <ShoppingCart className="w-5 h-5 mr-2" />
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
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
