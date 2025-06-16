import { ShoppingCart, User, Globe, Menu, X, ChevronDown, Settings, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onStartChat: () => void;
}

export const Header = ({ onStartChat }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const content = {
    ar: {
      welcome: "مرحباً بك في مورفو",
      languageLabel: "العربية",
      home: "الرئيسية",
      agents: "المنتجات",
      pricing: "الأسعار",
      support: "الدعم",
      about: "من نحن",
      authButton: "تسجيل الدخول",
      startNow: "ابدأ الآن",
      storeName: "مورفو",
      dashboard: "لوحة التحكم",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
      tryChat: "جرب المحادثة"
    },
    en: {
      welcome: "Welcome to Morvo",
      languageLabel: "English",
      home: "Home",
      agents: "Products", 
      pricing: "Pricing",
      support: "Support",
      about: "About",
      authButton: "Sign In",
      startNow: "Start Now",
      storeName: "Morvo",
      dashboard: "Dashboard",
      profile: "Profile",
      logout: "Sign Out",
      tryChat: "Try Chat"
    }
  };

  const t = content[language];

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
      theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-800' 
        : 'bg-white/95 border-gray-200'
    } ${language === 'ar' ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
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
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t.storeName}
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
            }`}>
              {t.home}
            </Link>
            <Link to="/public-chat" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.tryChat}
            </Link>
            <Link to="/features" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.agents}
            </Link>
            <Link to="/pricing" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.pricing}
            </Link>
            <Link to="/support" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.support}
            </Link>
            <Link to="/about" className={`text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}>
              {t.about}
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {!loading && (
                <>
                  {user ? (
                    // User is logged in - show user menu and start now button
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
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
                            {user.email?.split('@')[0]}
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          <DropdownMenuItem asChild>
                            <Link to="/dashboard" className="flex items-center">
                              <Settings className="w-4 h-4 mr-2" />
                              {t.dashboard}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/profile" className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              {t.profile}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                            <LogOut className="w-4 h-4 mr-2" />
                            {t.logout}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Link to="/pricing">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {t.startNow}
                        </Button>
                      </Link>
                    </>
                  ) : (
                    // User is not logged in - show auth button and start now button
                    <>
                      <Link to="/auth/login">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`transition-colors ${
                            theme === 'dark' 
                              ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800' 
                              : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <User className="w-4 h-4 mr-2" />
                          {t.authButton}
                        </Button>
                      </Link>
                      
                      <Link to="/pricing">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {t.startNow}
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
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
              <Link to="/" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t.home}
              </Link>
              <Link to="/public-chat" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.tryChat}
              </Link>
              <Link to="/features" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.agents}
              </Link>
              <Link to="/pricing" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.pricing}
              </Link>
              <Link to="/support" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.support}
              </Link>
              <Link to="/about" className={`block text-base font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t.about}
              </Link>
              
              <div className="pt-4 space-y-3">
                {!loading && (
                  <>
                    {user ? (
                      // Mobile user menu
                      <>
                        <Link to="/dashboard">
                          <Button variant="outline" className="w-full justify-start">
                            <Settings className="w-4 h-4 mr-2" />
                            {t.dashboard}
                          </Button>
                        </Link>
                        
                        <Link to="/profile">
                          <Button variant="outline" className="w-full justify-start">
                            <User className="w-4 h-4 mr-2" />
                            {t.profile}
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                          onClick={handleSignOut}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {t.logout}
                        </Button>
                      </>
                    ) : (
                      // Mobile auth button
                      <Link to="/auth/login">
                        <Button variant="outline" className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" />
                          {t.authButton}
                        </Button>
                      </Link>
                    )}
                    
                    <Link to="/pricing">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t.startNow}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
