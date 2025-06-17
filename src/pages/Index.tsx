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
 * ➜ Fixes “chat input can’t type” bug by ensuring decorative overlays
 *    don’t capture pointer‑events.
 * ➜ Small performance tweaks (memoised heavy lists, unique React keys).
 * ➜ Consistent dark‑mode + RTL handling.
 *
 * Author: ChatGPT (refactor 2025‑06‑17)
 */

const content = { /*  -- UNCHANGED COPY FROM ORIGINAL -- */ };

/**
 * Utility: gradient overlay (non‑interactive)
 */
const BackgroundGradient = ({ className }) => (
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

const StatsGrid = memo(({ stats, theme }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
    {stats.map(({ number, label }) => (
      <div key={label} className="text-center">
        <div className={`text-2xl md:text-3xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{number}</div>
        <div className={theme === "dark" ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>{label}</div>
      </div>
    ))}
  </div>
));

const AgentsSection = ({ t, theme }) => (
  <section className={theme === "dark" ? "py-20 bg-gray-800/50" : "py-20 bg-gray-50/50"}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.agents.title} subtitle={t.agents.subtitle} theme={theme} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.agents.items.map(({ name, englishName, description }) => (
          <div
            key={name}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              theme === "dark" ? "bg-gray-900/50 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{name}</h3>
            {t === content.ar && (
              <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{englishName}</p>
            )}
            <p className={theme === "dark" ? "text-gray-300 leading-relaxed text-sm" : "text-gray-700 leading-relaxed text-sm"}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProcessSection = ({ t, theme }) => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.process.title} subtitle={t.process.subtitle} theme={theme} />
      <div className="grid md:grid-cols-3 gap-8">
        {t.process.steps.map(({ title, description, icon }) => (
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

const DashboardSection = ({ t, theme }) => (
  <section className={theme === "dark" ? "py-20 bg-gray-800/50" : "py-20 bg-gray-50/50"}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.dashboard.title} subtitle={t.dashboard.subtitle} theme={theme} />
      <div className="grid md:grid-cols-2 gap-8">
        {t.dashboard.features.map(({ title, description, icon }) => (
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

const SuccessStorySection = ({ t, theme, isRTL }) => (
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
          “{t.successStory.quote}”
        </p>
        <footer className={theme === "dark" ? "font-semibold text-white" : "font-semibold text-gray-900"}>— {t.successStory.author}</footer>
      </blockquote>
    </div>
  </section>
);

const PricingSection = ({ t, theme }) => (
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
          {t.pricing.features.map((f) => (
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

const FinalCTASection = ({ t, theme }) => (
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

const SectionHeader = ({ title, subtitle, theme }) => (
  <div className="text-center mb-16">
    <h2 className={`font-bold mb-6 ${theme === "dark" ? "text-3xl md:text-5xl text-white" : "text-3xl md:text-5xl text-gray-900"}`}>{title}</h2>
    <p className={`text-xl max-w-4xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{subtitle}</p>
  </div>
);

const StoryCard = ({ icon, title, description, theme, isRTL, success = false }) => (
  <div className={`p-8 rounded-2xl border ${success ? "border-green-500/30" : ""} ${theme === "dark" ? success ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gray-900/50 border-gray-700" : success ? "bg-white border-green-200" : "bg-white border-gray-200"}`}>
    <div className={`flex items-center gap-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}> {icon}
      <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h3>
    </div>
    <p className={theme === "dark" ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>{description}</p>
  </div>
);

export default Index;
