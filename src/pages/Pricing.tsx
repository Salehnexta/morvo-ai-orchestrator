
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { pricingContent } from "@/data/pricingContent";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PlanCard } from "@/components/pricing/PlanCard";
import { PricingFooter } from "@/components/pricing/PricingFooter";

export const Pricing = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const t = pricingContent[language as keyof typeof pricingContent];

  return (
    <MainLayout>
      <div className={`min-h-screen font-cairo ${theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-10 ${isRTL ? 'right-10' : 'left-10'} w-72 h-72 ${
              theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-400/20'
            } rounded-full blur-3xl`}></div>
            <div className={`absolute bottom-10 ${isRTL ? 'left-10' : 'right-10'} w-96 h-96 ${
              theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/20'
            } rounded-full blur-3xl`}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <PricingHeader title={t.title} subtitle={t.subtitle} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-start">
              {t.plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} features={Object.values(t.features)} />
              ))}
            </div>

            <PricingFooter note={t.note} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
