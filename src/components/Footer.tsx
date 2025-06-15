
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      companyName: "مورفو",
      companySubtitle: "النظام الذكي للتسويق",
      description: "منصة التسويق الرقمي والذكاء الاصطناعي التي تساعدك على تحليل السوق وبناء استراتيجيات تسويقية فعالة باستخدام الذكاء الاصطناعي.",
      product: "المنتج",
      productItems: [
        { name: "المميزات", href: "/features" },
        { name: "كيف يعمل", href: "/how-it-works" },
        { name: "الأسعار", href: "/pricing" },
        { name: "الأسئلة الشائعة", href: "/faq" }
      ],
      rights: "جميع الحقوق محفوظة",
      contactInfo: "معلومات الاتصال",
      address: "الرياض، المملكة العربية السعودية",
      phone: "+966 50 123 4567",
      email: "info@morvo.ai",
      followUs: "تابعنا",
      quickLinks: "روابط سريعة"
    },
    en: {
      companyName: "Morvo",
      companySubtitle: "Smart Marketing System",
      description: "Digital marketing and AI platform that helps you analyze the market and build effective marketing strategies using artificial intelligence.",
      product: "Product",
      productItems: [
        { name: "Features", href: "/features" },
        { name: "How it Works", href: "/how-it-works" },
        { name: "Pricing", href: "/pricing" },
        { name: "FAQ", href: "/faq" }
      ],
      rights: "All rights reserved",
      contactInfo: "Contact Info",
      address: "Riyadh, Saudi Arabia",
      phone: "+966 50 123 4567",
      email: "info@morvo.ai",
      followUs: "Follow Us",
      quickLinks: "Quick Links"
    }
  };

  const t = content[language];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden font-cairo" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className={`inline-flex items-center gap-4 group ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 font-cairo">
                  {t.companyName}
                </h3>
                <p className="text-sm text-blue-300 font-medium font-cairo">
                  {t.companySubtitle}
                </p>
              </div>
            </Link>
            
            <p className={`text-gray-300 leading-relaxed text-sm font-cairo ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.description}
            </p>
            
            {/* Social Media */}
            <div>
              <h4 className={`text-lg font-semibold mb-4 text-white font-cairo ${isRTL ? 'text-right' : 'text-left'}`}>{t.followUs}</h4>
              <div className={`flex gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                {[
                  { Icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                  { Icon: Twitter, href: "#", color: "hover:bg-sky-500" },
                  { Icon: Instagram, href: "#", color: "hover:bg-pink-500" },
                  { Icon: Linkedin, href: "#", color: "hover:bg-blue-700" },
                  { Icon: Youtube, href: "#", color: "hover:bg-red-600" }
                ].map(({ Icon, href, color }, index) => (
                  <a 
                    key={index}
                    href={href} 
                    className={`group relative p-3 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-400 ${color} hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-transparent`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className={`text-xl font-bold text-white relative font-cairo ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.quickLinks}
              <div className={`absolute bottom-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full ${isRTL ? 'right-0' : 'left-0'}`}></div>
            </h4>
            <ul className="space-y-3">
              {t.productItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href} 
                    className={`group inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 py-2 font-cairo ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <ArrowRight className={`w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    <span className="relative">
                      {item.name}
                      <span className={`absolute bottom-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full ${isRTL ? 'right-0' : 'left-0'}`}></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className={`text-xl font-bold text-white relative font-cairo ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.contactInfo}
              <div className={`absolute bottom-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full ${isRTL ? 'right-0' : 'left-0'}`}></div>
            </h4>
            <div className="space-y-4">
              {[
                { Icon: MapPin, text: t.address, color: "text-green-400", shouldBeLTR: false },
                { Icon: Phone, text: t.phone, color: "text-blue-400", shouldBeLTR: true },
                { Icon: Mail, text: t.email, color: "text-purple-400", shouldBeLTR: true }
              ].map(({ Icon, text, color, shouldBeLTR }, index) => (
                <div key={index} className={`group flex items-start gap-4 p-3 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 p-2 rounded-lg bg-gray-700/50 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span 
                    className={`text-gray-300 group-hover:text-white transition-colors duration-300 text-sm font-cairo ${
                      shouldBeLTR ? 'ltr' : ''
                    } ${isRTL && !shouldBeLTR ? 'text-right' : ''} ${isRTL && shouldBeLTR ? 'text-left' : ''}`} 
                    dir={shouldBeLTR ? 'ltr' : (isRTL ? 'rtl' : 'ltr')}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-6 ${
            isRTL ? 'md:flex-row-reverse text-right' : 'text-left'
          }`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <p className={`text-sm text-gray-400 font-cairo ${isRTL ? 'text-right' : 'text-left'}`}>
                © 2024 <span className="text-white font-medium">{t.companyName}</span> - {t.rights}
              </p>
            </div>
            <div className={`flex gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {[
                { text: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', href: '/privacy' },
                { text: language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', href: '/terms' },
                { text: language === 'ar' ? 'ملفات تعريف الارتباط' : 'Cookies', href: '/cookies' }
              ].map((link, index) => (
                <Link 
                  key={index}
                  to={link.href} 
                  className={`text-sm text-gray-400 hover:text-white transition-colors duration-300 relative group font-cairo ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {link.text}
                  <span className={`absolute bottom-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full ${isRTL ? 'right-0' : 'left-0'}`}></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
