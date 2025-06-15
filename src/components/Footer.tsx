
import { useTheme } from "@/contexts/ThemeContext";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`mt-20 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-t border-gray-800' 
        : 'bg-gray-50 border-t border-gray-200'
    }`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  مورفو AI
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Morvo AI
                </p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              منصة الذكاء الاصطناعي الرائدة للتسويق الرقمي مع 9 وكلاء متخصصين لتحويل استراتيجيتك التسويقية
            </p>
            <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Leading AI marketing platform with 9 specialized agents to transform your marketing strategy
            </p>
            
            {/* Social Media */}
            <div className="flex gap-4">
              <a href="#" className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              روابط سريعة
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  الوكلاء المتخصصين
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  خطط الأسعار
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  قصص النجاح
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  المدونة
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  من نحن
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              الخدمات
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  تحسين محركات البحث
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  إدارة وسائل التواصل
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  التسويق بالمحتوى
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  الإعلانات المدفوعة
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  تحليل المنافسين
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  التسويق الإلكتروني
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              تواصل معنا
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  support@morvo.ai
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  +966 50 123 4567
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  الرياض، المملكة العربية السعودية
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h5 className={`text-md font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                النشرة الإخبارية
              </h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                  اشتراك
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 مورفو AI - جميع الحقوق محفوظة | Morvo AI - All rights reserved
            </p>
            <div className="flex gap-6">
              <a href="#" className={`text-sm hover:underline ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                سياسة الخصوصية
              </a>
              <a href="#" className={`text-sm hover:underline ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                الشروط والأحكام
              </a>
              <a href="#" className={`text-sm hover:underline ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                ملفات تعريف الارتباط
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
