
import { ShoppingCart, User, Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

interface HeaderProps {
  onStartChat: () => void;
}

export const Header = ({ onStartChat }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
      theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-800' 
        : 'bg-white/95 border-gray-200'
    }`}>
      {/* Top Bar */}
      <div className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-4">
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                مرحباً بك في مورفو | Welcome to Morvo
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-1 rounded ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Globe className="w-4 h-4" />
              </button>
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                العربية | EN
              </span>
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
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  مورفو
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Morvo AI
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className={`text-sm font-medium ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'}`}>
              الرئيسية | Home
            </a>
            <a href="#" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
              الوكلاء | Agents
            </a>
            <a href="#" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
              الأسعار | Pricing
            </a>
            <a href="#" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
              المساعدة | Support
            </a>
            <a href="#" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
              من نحن | About
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className={`${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <User className="w-4 h-4 mr-2" />
                تسجيل الدخول | Login
              </Button>
              
              <Button
                onClick={onStartChat}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                ابدأ الآن | Start Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-md ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
            <div className="px-4 py-6 space-y-4">
              <a href="#" className={`block text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                الرئيسية | Home
              </a>
              <a href="#" className={`block text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                الوكلاء | Agents
              </a>
              <a href="#" className={`block text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                الأسعار | Pricing
              </a>
              <a href="#" className={`block text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                المساعدة | Support
              </a>
              <a href="#" className={`block text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                من نحن | About
              </a>
              
              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  تسجيل الدخول | Login
                </Button>
                
                <Button
                  onClick={onStartChat}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ابدأ الآن | Start Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
