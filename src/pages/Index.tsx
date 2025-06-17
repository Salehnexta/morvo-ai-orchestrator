
import React, { useState, memo } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  User,
  Rocket,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatInterface } from "@/components/ChatInterface";

/**
 * Marketing landing page – Morvo AI
 * --------------------------------------------------
 * ➜ Fixes "chat input can't type" bug by ensuring decorative overlays
 *    don't capture pointer‑events.
 * ➜ Small performance tweaks (memoised heavy lists, unique React keys).
 * ➜ Consistent dark‑mode + RTL handling.
 *
 * Author: ChatGPT (refactor 2025‑06‑17)
 */

const content = {
  ar: {
    hero: {
      title: "مورفو إيه آي - مساعدك الذكي للمبيعات",
      subtitle: "احصل على 5 وكلاء ذكيين لزيادة مبيعاتك بنسبة 300% في 30 يوماً",
      description: "استخدم قوة الذكاء الاصطناعي لتحويل عملائك المحتملين إلى عملاء حقيقيين بطريقة آلية ومربحة",
      startButton: "ابدأ الآن - مجاني",
      stats: [
        { number: "300%", label: "زيادة في المبيعات" },
        { number: "24/7", label: "عمل متواصل" },
        { number: "5", label: "وكلاء ذكيين" },
        { number: "30", label: "يوم للنتائج" }
      ]
    },
    agents: {
      title: "وكلاء الذكاء الاصطناعي الخمسة",
      subtitle: "كل وكيل متخصص في مجال محدد لضمان أفضل النتائج",
      items: [
        {
          name: "وكيل المبيعات",
          englishName: "Sales Agent",
          description: "يتابع العملاء المحتملين ويحولهم إلى مشترين حقيقيين"
        },
        {
          name: "وكيل التسويق",
          englishName: "Marketing Agent", 
          description: "ينشئ حملات تسويقية مستهدفة وفعالة"
        },
        {
          name: "وكيل خدمة العملاء",
          englishName: "Customer Service Agent",
          description: "يجيب على استفسارات العملاء على مدار الساعة"
        },
        {
          name: "وكيل التحليل",
          englishName: "Analytics Agent",
          description: "يحلل البيانات ويقدم تقارير مفصلة"
        },
        {
          name: "وكيل إدارة المشاريع",
          englishName: "Project Management Agent",
          description: "ينظم ويتابع جميع مشاريعك بكفاءة"
        }
      ]
    },
    process: {
      title: "كيف يعمل النظام؟",
      subtitle: "عملية بسيطة من 3 خطوات فقط",
      steps: [
        {
          title: "التسجيل والإعداد",
          description: "سجل حسابك واختر الوكلاء المناسبين لعملك",
          icon: "🚀"
        },
        {
          title: "تخصيص الوكلاء",
          description: "قم بتدريب الوكلاء على بياناتك وأهدافك التجارية",
          icon: "⚙️"
        },
        {
          title: "مراقبة النتائج",
          description: "تابع الأداء والنتائج من خلال لوحة التحكم المتقدمة",
          icon: "📊"
        }
      ]
    },
    dashboard: {
      title: "لوحة تحكم متقدمة",
      subtitle: "مراقبة شاملة لجميع أنشطة الوكلاء",
      features: [
        {
          title: "تقارير لحظية",
          description: "احصل على تقارير مفصلة عن أداء كل وكيل",
          icon: "📈"
        },
        {
          title: "تحليلات ذكية",
          description: "فهم عميق لسلوك العملاء وتوقعات السوق",
          icon: "🧠"
        },
        {
          title: "تنبيهات فورية",
          description: "اشعارات لحظية للفرص الجديدة والمهام المهمة",
          icon: "🔔"
        },
        {
          title: "تكامل سهل",
          description: "ربط سهل مع جميع أدواتك الحالية",
          icon: "🔗"
        }
      ]
    },
    successStory: {
      title: "قصة نجاح حقيقية",
      subtitle: "كيف غيّر مورفو إيه آي حياة أحمد التجارية",
      before: {
        title: "قبل مورفو إيه آي",
        description: "كان أحمد يعمل 12 ساعة يومياً، يتابع العملاء يدوياً، ومبيعاته لا تتجاوز 50,000 ريال شهرياً"
      },
      after: {
        title: "بعد مورفو إيه آي",
        description: "الآن يعمل 4 ساعات فقط، الوكلاء تدير كل شيء، ومبيعاته وصلت إلى 200,000 ريال شهرياً"
      },
      quote: "مورفو إيه آي غيّر حياتي تماماً. الآن لدي وقت لعائلتي ومبيعاتي تضاعفت 4 مرات!",
      author: "أحمد العتيبي، صاحب متجر إلكتروني"
    },
    pricing: {
      title: "عرض خاص - خصم 70%",
      price: "297 ريال/شهر",
      oldPrice: "997 ريال/شهر",
      discount: "وفر 700 ريال!",
      subtitle: "كل ما تحتاجه لبناء إمبراطوريتك التجارية",
      features: [
        "5 وكلاء ذكيين متخصصين",
        "لوحة تحكم متقدمة",
        "تقارير مفصلة يومية",
        "دعم فني 24/7",
        "تدريب مجاني للوكلاء",
        "ضمان استرداد المال 30 يوم"
      ],
      remaining: "متبقي 23 مقعد فقط!",
      urgency: "العرض ينتهي خلال 48 ساعة",
      ctaButton: "احجز مقعدك الآن"
    },
    finalCta: {
      title: "هل أنت مستعد لتغيير حياتك التجارية؟",
      description: "انضم إلى أكثر من 10,000 رائد أعمال يستخدمون مورفو إيه آي لمضاعفة أرباحهم",
      question: "السؤال الوحيد: هل ستكون منهم؟",
      button: "نعم، أريد مضاعفة أرباحي"
    }
  },
  en: {
    hero: {
      title: "Morvo AI - Your Smart Sales Assistant",
      subtitle: "Get 5 intelligent agents to increase your sales by 300% in 30 days",
      description: "Harness the power of AI to automatically convert your leads into real customers profitably",
      startButton: "Start Now - Free",
      stats: [
        { number: "300%", label: "Sales Increase" },
        { number: "24/7", label: "Always Working" },
        { number: "5", label: "Smart Agents" },
        { number: "30", label: "Days to Results" }
      ]
    },
    agents: {
      title: "Five AI Agents",
      subtitle: "Each agent specializes in a specific area to ensure the best results",
      items: [
        {
          name: "Sales Agent",
          description: "Follows up with prospects and converts them into real buyers"
        },
        {
          name: "Marketing Agent",
          description: "Creates targeted and effective marketing campaigns"
        },
        {
          name: "Customer Service Agent",
          description: "Answers customer inquiries around the clock"
        },
        {
          name: "Analytics Agent",
          description: "Analyzes data and provides detailed reports"
        },
        {
          name: "Project Management Agent",
          description: "Organizes and tracks all your projects efficiently"
        }
      ]
    },
    process: {
      title: "How Does It Work?",
      subtitle: "Simple 3-step process",
      steps: [
        {
          title: "Sign Up & Setup",
          description: "Register your account and choose the right agents for your business",
          icon: "🚀"
        },
        {
          title: "Customize Agents",
          description: "Train the agents on your data and business goals",
          icon: "⚙️"
        },
        {
          title: "Monitor Results",
          description: "Track performance and results through the advanced dashboard",
          icon: "📊"
        }
      ]
    },
    dashboard: {
      title: "Advanced Dashboard",
      subtitle: "Comprehensive monitoring of all agent activities",
      features: [
        {
          title: "Real-time Reports",
          description: "Get detailed reports on each agent's performance",
          icon: "📈"
        },
        {
          title: "Smart Analytics",
          description: "Deep understanding of customer behavior and market predictions",
          icon: "🧠"
        },
        {
          title: "Instant Alerts",
          description: "Real-time notifications for new opportunities and important tasks",
          icon: "🔔"
        },
        {
          title: "Easy Integration",
          description: "Simple connection with all your existing tools",
          icon: "🔗"
        }
      ]
    },
    successStory: {
      title: "Real Success Story",
      subtitle: "How Morvo AI changed Ahmed's business life",
      before: {
        title: "Before Morvo AI",
        description: "Ahmed worked 12 hours daily, followed up with customers manually, and his sales didn't exceed 50,000 SAR monthly"
      },
      after: {
        title: "After Morvo AI", 
        description: "Now he works only 4 hours, agents manage everything, and his sales reached 200,000 SAR monthly"
      },
      quote: "Morvo AI completely changed my life. Now I have time for my family and my sales quadrupled!",
      author: "Ahmed Al-Otaibi, E-commerce Store Owner"
    },
    pricing: {
      title: "Special Offer - 70% Discount",
      price: "$79/month",
      oldPrice: "$267/month", 
      discount: "Save $188!",
      subtitle: "Everything you need to build your business empire",
      features: [
        "5 specialized smart agents",
        "Advanced dashboard",
        "Detailed daily reports",
        "24/7 technical support",
        "Free agent training",
        "30-day money-back guarantee"
      ],
      remaining: "Only 23 seats left!",
      urgency: "Offer ends in 48 hours",
      ctaButton: "Reserve Your Seat Now"
    },
    finalCta: {
      title: "Are You Ready to Transform Your Business Life?",
      description: "Join over 10,000 entrepreneurs using Morvo AI to double their profits",
      question: "The only question: Will you be one of them?",
      button: "Yes, I Want to Double My Profits"
    }
  }
};

/**
 * Utility: gradient overlay (non‑interactive)
 */
const BackgroundGradient = ({ className }: { className: string }) => (
  <div
    className={`pointer-events-none absolute inset-0 ${className}`}
    aria-hidden="true"
  />
);

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const t = content[language];

  if (isChatOpen) return <ChatInterface onBack={() => setIsChatOpen(false)} />;

  const pageBG =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-50";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen ${pageBG} ${language === "ar" ? "font-cairo" : ""}`}
    >
      <Header onStartChat={() => setIsChatOpen(true)} />

      {/* ───────────────────────── Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Decorative overlays (no pointer events!) */}
        <BackgroundGradient className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <BackgroundGradient className="top-0 left-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-x-1/2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className={`font-bold mb-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight ${
              language === "ar"
                ? "text-4xl md:text-5xl lg:text-5xl"
                : "text-4xl md:text-6xl lg:text-7xl"
            }`}
          >
            {t.hero.title}
          </h1>

          <p
            className={`text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t.hero.subtitle}
          </p>

          <p
            className={`text-lg mb-12 max-w-3xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/pricing">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200">
                <Brain className="w-5 h-5 mr-2" />
                {t.hero.startButton}
              </Button>
            </Link>
          </div>

          <StatsGrid stats={t.hero.stats} theme={theme} />
        </div>
      </section>

      {/* ───────────────────────── Agents */}
      <AgentsSection t={t} theme={theme} />

      {/* ───────────────────────── Process */}
      <ProcessSection t={t} theme={theme} />

      {/* ───────────────────────── Dashboard */}
      <DashboardSection t={t} theme={theme} />

      {/* ───────────────────────── Success Story */}
      <SuccessStorySection t={t} theme={theme} isRTL={isRTL} />

      {/* ───────────────────────── Pricing */}
      <PricingSection t={t} theme={theme} />

      {/* ───────────────────────── Final CTA */}
      <FinalCTASection t={t} theme={theme} />

      <Footer />
    </div>
  );
};

/*===========================================================================*/
/*==============================  Sub‑components  ============================*/
/*===========================================================================*/

const StatsGrid = memo(({ stats, theme }: { stats: any[]; theme: string }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
    {stats.map(({ number, label }) => (
      <div key={label} className="text-center">
        <div className={`text-2xl md:text-3xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{number}</div>
        <div className={theme === "dark" ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>{label}</div>
      </div>
    ))}
  </div>
));

const AgentsSection = ({ t, theme }: { t: any; theme: string }) => (
  <section className={theme === "dark" ? "py-20 bg-gray-800/50" : "py-20 bg-gray-50/50"}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.agents.title} subtitle={t.agents.subtitle} theme={theme} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.agents.items.map(({ name, englishName, description }: any) => (
          <div
            key={name}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              theme === "dark" ? "bg-gray-900/50 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{name}</h3>
            {content.ar === t && (
              <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{englishName}</p>
            )}
            <p className={theme === "dark" ? "text-gray-300 leading-relaxed text-sm" : "text-gray-700 leading-relaxed text-sm"}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProcessSection = ({ t, theme }: { t: any; theme: string }) => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.process.title} subtitle={t.process.subtitle} theme={theme} />
      <div className="grid md:grid-cols-3 gap-8">
        {t.process.steps.map(({ title, description, icon }: any) => (
          <div
            key={title}
            className={`text-center p-8 rounded-2xl border ${theme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="text-4xl mb-4" aria-hidden="true">{icon}</div>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h3>
            <p className={theme === "dark" ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DashboardSection = ({ t, theme }: { t: any; theme: string }) => (
  <section className={theme === "dark" ? "py-20 bg-gray-800/50" : "py-20 bg-gray-50/50"}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.dashboard.title} subtitle={t.dashboard.subtitle} theme={theme} />
      <div className="grid md:grid-cols-2 gap-8">
        {t.dashboard.features.map(({ title, description, icon }: any) => (
          <div
            key={title}
            className={`p-6 rounded-xl border flex items-start gap-4 ${theme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="text-3xl" aria-hidden="true">{icon}</div>
            <div>
              <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h3>
              <p className={theme === "dark" ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SuccessStorySection = ({ t, theme, isRTL }: { t: any; theme: string; isRTL: boolean }) => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.successStory.title} subtitle={t.successStory.subtitle} theme={theme} />
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/** Before */}
        <StoryCard
          icon={<User className="w-8 h-8 text-red-500 flex-shrink-0" />}
          title={t.successStory.before.title}
          description={t.successStory.before.description}
          theme={theme}
          isRTL={isRTL}
        />
        {/** After */}
        <StoryCard
          icon={<Rocket className="w-8 h-8 text-green-500 flex-shrink-0" />}
          title={t.successStory.after.title}
          description={t.successStory.after.description}
          theme={theme}
          isRTL={isRTL}
          success
        />
      </div>
      {/* Quote */}
      <blockquote
        className={`relative p-8 rounded-2xl border text-center ${theme === "dark" ? "bg-gray-900/50 border-yellow-500/30" : "bg-white border-yellow-200"}`}
      >
        <Star className="w-10 h-10 text-yellow-400 absolute -top-5 left-1/2 -translate-x-1/2" aria-hidden="true" />
        <p className={theme === "dark" ? "text-xl italic mb-4 text-gray-300" : "text-xl italic mb-4 text-gray-700"}>
          "{t.successStory.quote}"
        </p>
        <footer className={theme === "dark" ? "font-semibold text-white" : "font-semibold text-gray-900"}>— {t.successStory.author}</footer>
      </blockquote>
    </div>
  </section>
);

const PricingSection = ({ t, theme }: { t: any; theme: string }) => (
  <section className={theme === "dark" ? "py-20 bg-gray-800/50" : "py-20 bg-gray-50/50"}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`p-8 rounded-2xl border text-center ${theme === "dark" ? "bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-800/50" : "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"}`}
      >
        <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{t.pricing.title}</h2>
        <div className="mb-6 flex justify-center items-baseline gap-3">
          <p className={`text-4xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>{t.pricing.price}</p>
          {t.pricing.oldPrice && (
            <p className={`text-2xl line-through ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{t.pricing.oldPrice}</p>
          )}
        </div>
        {t.pricing.discount && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full inline-block mb-4">{t.pricing.discount}</span>
        )}
        <p className={theme === "dark" ? "text-sm text-gray-400 mb-6" : "text-sm text-gray-500 mb-6"}>{t.pricing.subtitle}</p>
        <ul className="space-y-2 mb-8">
          {t.pricing.features.map((f: string) => (
            <li key={f} className={theme === "dark" ? "flex items-center justify-center gap-2 text-gray-300" : "flex items-center justify-center gap-2 text-gray-700"}>
              <span className="text-green-500">✅</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div className="mb-6">
          <p className={theme === "dark" ? "text-orange-400 font-semibold mb-2" : "text-orange-600 font-semibold mb-2"}>{t.pricing.remaining}</p>
          <p className={theme === "dark" ? "text-red-400 font-semibold" : "text-red-600 font-semibold"}>{t.pricing.urgency}</p>
        </div>
        <Link to="/pricing">
          <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold">
            {t.pricing.ctaButton}
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const FinalCTASection = ({ t, theme }: { t: any; theme: string }) => (
  <section className="py-20 text-center">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className={`font-bold mb-6 ${theme === "dark" ? "text-3xl md:text-5xl text-white" : "text-3xl md:text-5xl text-gray-900"}`}>{t.finalCta.title}</h2>
      <p className={`text-xl mb-8 leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{t.finalCta.description}</p>
      <p className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{t.finalCta.question}</p>
      <Link to="/pricing">
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200">
          {t.finalCta.button}
        </Button>
      </Link>
    </div>
  </section>
);

/*----------------------------  Helpers  ----------------------------*/

const SectionHeader = ({ title, subtitle, theme }: { title: string; subtitle: string; theme: string }) => (
  <div className="text-center mb-16">
    <h2 className={`font-bold mb-6 ${theme === "dark" ? "text-3xl md:text-5xl text-white" : "text-3xl md:text-5xl text-gray-900"}`}>{title}</h2>
    <p className={`text-xl max-w-4xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{subtitle}</p>
  </div>
);

const StoryCard = ({ icon, title, description, theme, isRTL, success = false }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  theme: string;
  isRTL: boolean;
  success?: boolean;
}) => (
  <div className={`p-8 rounded-2xl border ${success ? "border-green-500/30" : ""} ${theme === "dark" ? success ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gray-900/50 border-gray-700" : success ? "bg-white border-green-200" : "bg-white border-gray-200"}`}>
    <div className={`flex items-center gap-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}> {icon}
      <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h3>
    </div>
    <p className={theme === "dark" ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>{description}</p>
  </div>
);

export default Index;
