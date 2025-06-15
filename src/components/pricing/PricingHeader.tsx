
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface PricingHeaderProps {
  title: string;
  subtitle: string;
}

export const PricingHeader = ({ title, subtitle }: PricingHeaderProps) => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="text-center mb-20">
      <div className="flex justify-center mb-6">
        <div className={`px-4 py-2 rounded-full text-sm font-medium font-cairo ${
          theme === 'dark' 
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
            : 'bg-blue-100 text-blue-600 border border-blue-200'
        }`}>
          {language === 'ar' ? 'الأسعار والباقات' : 'Pricing Plans'}
        </div>
      </div>
      <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-cairo ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      } leading-tight`}>
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      <p className={`text-xl md:text-2xl font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto leading-relaxed`}>
        {subtitle}
      </p>
    </div>
  );
};
