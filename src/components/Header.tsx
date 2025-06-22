
import { ShoppingCart, User, Globe, Menu, X, ChevronDown, Brain, Sparkles, Zap, Languages, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onStartChat?: () => void;
}

export const Header = ({ onStartChat }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const content = {
    ar: {
      languageLabel: "العربية",
      home: "الرئيسية",
      features: "المميزات",
      pricing: "الأسعار",
      support: "الدعم",
      about: "من نحن",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      startNow: "ابدأ الآن",
      dashboard: "لوحة التحكم",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      storeName: "مورفو",
      aiPowered: "مدعوم بالذكاء الاصطناعي"
    },
    en: {
      languageLabel: "English",
      home: "Home",
      features: "Features", 
      pricing: "Pricing",
      support: "Support",
      about: "About",
      login: "Login",
      register: "Sign Up",
      startNow: "Start Now",
      dashboard: "Dashboard",
      profile: "Profile", 
      settings: "Settings",
      logout: "Logout",
      storeName: "Morvo",
      aiPowered: "AI-Powered"
    }
  };

  const t = content[language];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-white/20 dark:border-gray-800/50' 
        : 'backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border-b border-white/10 dark:border-gray-800/30'
    } ${language === 'ar' ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* AI-Themed Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
              <div className="relative">
                {/* Animated AI Brain Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <Brain className="w-7 h-7 text-white animate-pulse" />
                  {/* AI Sparkles Animation */}
                  <div className="absolute -top-1 -right-1 w-3 h-3">
                    <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" style={{animationDuration: '3s'}} />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2">
                    <Zap className="w-2 h-2 text-cyan-400 animate-bounce" style={{animationDelay: '1s'}} />
                  </div>
                </div>
                {/* Floating particles */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="flex flex-col">
                <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 ${
                  theme === 'dark' ? 'drop-shadow-lg' : ''
                }`}>
                  {t.storeName}
                </h1>
                <span className={`text-xs font-medium opacity-70 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                } group-hover:opacity-100 transition-opacity duration-300`}>
                  {t.aiPowered}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { key: 'home', href: '/', label: t.home },
              { key: 'features', href: '/features', label: t.features },
              { key: 'pricing', href: '/pricing', label: t.pricing },
              { key: 'support', href: '/support', label: t.support },
              { key: 'about', href: '/about', label: t.about }
            ].map(({ key, href, label }) => (
              <Link 
                key={key}
                to={href} 
                className={`relative text-sm font-medium transition-all duration-300 hover:scale-105 group ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            {/* Language & Theme Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 border border-gray-200/50'
                } backdrop-blur-sm`}
              >
                <Languages className="w-4 h-4" />
                <span>{language === 'ar' ? 'ع' : 'EN'}</span>
              </button>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                } backdrop-blur-sm border border-white/10 dark:border-gray-700/50`}
              >
                <Globe className="w-4 h-4" />
              </button>
            </div>

            {/* Conditional Auth Buttons */}
            {user ? (
              // Authenticated User Menu
              <div className="hidden md:flex items-center gap-3">
                <Link to="/dashboard">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {t.dashboard}
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`transition-all duration-300 hover:scale-105 backdrop-blur-sm border ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 border-gray-700/50' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 border-gray-200/50'
                      }`}
                    >
                      <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t.profile}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/billing" className="flex items-center">
                        <Settings className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t.settings}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                      <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Unauthenticated Auth Buttons
              <div className="hidden md:flex items-center gap-3">
                <Link to="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`transition-all duration-300 hover:scale-105 backdrop-blur-sm border ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 border-gray-700/50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 border-gray-200/50'
                    }`}
                  >
                    <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t.login}
                  </Button>
                </Link>
                
                <Link to="/auth/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                  >
                    {t.register}
                  </Button>
                </Link>
                
                <Link to="/pricing">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} relative z-10`} />
                    <span className="relative z-10">{t.startNow}</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
              } backdrop-blur-sm border border-white/10 dark:border-gray-700/50`}
            >
              <div className="relative w-5 h-5">
                <Menu className={`w-5 h-5 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`w-5 h-5 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className={`backdrop-blur-md border-t ${
            theme === 'dark' 
              ? 'border-gray-800/50 bg-gray-900/80' 
              : 'border-gray-200/50 bg-white/80'
          } rounded-b-2xl mx-4 mb-4 shadow-xl`}>
            <div className="px-6 py-6 space-y-4">
              
              {/* Mobile Navigation Links */}
              {[
                { key: 'home', href: '/', label: t.home },
                { key: 'features', href: '/features', label: t.features },
                { key: 'pricing', href: '/pricing', label: t.pricing },
                { key: 'support', href: '/support', label: t.support },
                { key: 'about', href: '/about', label: t.about }
              ].map(({ key, href, label }) => (
                <Link 
                  key={key}
                  to={href} 
                  className={`block text-base font-medium transition-all duration-300 hover:scale-105 hover:translate-x-2 ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  } ${isRTL ? 'text-right hover:-translate-x-2' : 'text-left'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              
              {/* Mobile Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  {t.languageLabel}
                </button>
                
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                </button>
              </div>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-3">
                {user ? (
                  // Authenticated mobile menu
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        {t.dashboard}
                      </Button>
                    </Link>
                    
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-center backdrop-blur-sm"
                      >
                        <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t.profile}
                      </Button>
                    </Link>
                    
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.logout}
                    </Button>
                  </>
                ) : (
                  // Unauthenticated mobile menu
                  <>
                    <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-center backdrop-blur-sm"
                      >
                        <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t.login}
                      </Button>
                    </Link>
                    
                    <Link to="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {t.register}
                      </Button>
                    </Link>
                    
                    <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t.startNow}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-20" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-20" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        <div className="absolute top-6 left-2/3 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-20" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
      </div>
    </header>
  );
};

export default Header;
