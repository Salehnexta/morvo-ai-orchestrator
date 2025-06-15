
import { ShoppingCart, User, Globe, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface HeaderProps {
  onStartChat: () => void;
}

export const Header = ({ onStartChat }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const content = {
    ar: {
      welcome: "مرحباً بك في متجر زد",
      languageLabel: "العربية",
      home: "الرئيسية",
      agents: "المنتجات",
      pricing: "الأسعار",
      support: "الدعم",
      about: "من نحن",
      login: "تسجيل الدخول",
      startNow: "ابدأ الآن",
      smartPlatform: "منصة التجارة الذكية",
      storeName: "متجر زد"
    },
    en: {
      welcome: "Welcome to Zid Store",
      languageLabel: "English",
      home: "Home",
      agents: "Products", 
      pricing: "Pricing",
      support: "Support",
      about: "About",
      login: "Login",
      startNow: "Start Now",
      smartPlatform: "Smart Commerce Platform",
      storeName: "Zid Store"
    }
  };

  const t = content[language];

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
      theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-800' 
        : 'bg-white/95 border-gray-200'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className={`border-b ${theme === 'dark' ? 'border-gray-800 bg-gradient-to-r from-purple-900 to-blue-900' : 'border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-4">
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.welcome}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                onClick={toggleLanguage}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{t.languageLabel}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ز</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t.storeName}
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t.smartPlatform}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
            }`}>
              {t.home}
            </a>
            <a href="#" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.agents}
            </a>
            <a href="#" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.pricing}
            </a>
            <a href="#" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.support}
            </a>
            <a href="#" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.about}
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className={`transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                {t.login}
              </Button>
              
              <Button
                onClick={onStartChat}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t.startNow}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${
            theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
          }`}>
            <div className="px-4 py-6 space-y-4">
              <a href="#" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t.home}
              </a>
              <a href="#" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.agents}
              </a>
              <a href="#" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.pricing}
              </a>
              <a href="#" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.support}
              </a>
              <a href="#" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.about}
              </a>
              
              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t.login}
                </Button>
                
                <Button
                  onClick={onStartChat}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t.startNow}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
