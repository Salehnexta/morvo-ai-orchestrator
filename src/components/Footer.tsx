
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      companyName: "مورفو",
      companySubtitle: "النظام الاصطناعي يقود نجاحك التسويقي",
      description: "منصة التسويق الرقمي والذكاء الاصطناعي التي تساعدك على تحليل السوق وبناء استراتيجيات تسويقية فعالة باستخدام الذكاء الاصطناعي.",
      product: "المنتج",
      productItems: [
        { name: "المميزات", href: "/features" },
        { name: "كيف يعمل", href: "/how-it-works" },
        { name: "الأسعار", href: "/pricing" },
        { name: "الأسئلة الشائعة", href: "/faq" }
      ],
      resources: "المصادر", 
      resourceItems: [
        { name: "قصص النجاح", href: "/success-stories" },
        { name: "التحديثات", href: "/updates" },
        { name: "مركز المساعدة", href: "/help-center" }
      ],
      supportLegal: "الدعم والقانونية",
      supportLegalItems: [
        { name: "الدعم", href: "/support" },
        { name: "تواصل معنا", href: "/contact" },
        { name: "حالة الخدمة", href: "/service-status" },
        { name: "الشروط والأحكام", href: "/terms" },
        { name: "سياسة الخصوصية", href: "/privacy" }
      ],
      rights: "جميع الحقوق محفوظة",
      contactInfo: "معلومات الاتصال",
      address: "الرياض، المملكة العربية السعودية",
      phone: "+966 50 123 4567",
      email: "info@morvo.ai"
    },
    en: {
      companyName: "Morvo",
      companySubtitle: "AI System Drives Your Marketing Success",
      description: "Digital marketing and AI platform that helps you analyze the market and build effective marketing strategies using artificial intelligence.",
      product: "Product",
      productItems: [
        { name: "Features", href: "/features" },
        { name: "How it Works", href: "/how-it-works" },
        { name: "Pricing", href: "/pricing" },
        { name: "FAQ", href: "/faq" }
      ],
      resources: "Resources",
      resourceItems: [
        { name: "Success Stories", href: "/success-stories" },
        { name: "Updates", href: "/updates" },
        { name: "Help Center", href: "/help-center" }
      ],
      supportLegal: "Support & Legal",
      supportLegalItems: [
        { name: "Support", href: "/support" },
        { name: "Contact Us", href: "/contact" },
        { name: "Service Status", href: "/service-status" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" }
      ],
      rights: "All rights reserved",
      contactInfo: "Contact Info",
      address: "Riyadh, Saudi Arabia",
      phone: "+966 50 123 4567",
      email: "info@morvo.ai"
    }
  };

  const t = content[language];

  return (
    <footer className="bg-gray-900 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-lg font-bold text-white">
                  {t.companyName}
                </h3>
                <p className="text-sm text-gray-400">
                  {t.companySubtitle}
                </p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed mb-6 text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{t.address}</span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-300" dir="ltr">{t.phone}</span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-300" dir="ltr">{t.email}</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className={`flex gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t.product}
            </h4>
            <ul className="space-y-4">
              {t.productItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-gray-300 hover:text-white transition-colors block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t.resources}
            </h4>
            <ul className="space-y-4">
              {t.resourceItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-gray-300 hover:text-white transition-colors block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t.supportLegal}
            </h4>
            <ul className="space-y-4">
              {t.supportLegalItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-gray-300 hover:text-white transition-colors block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${
            isRTL ? 'md:flex-row-reverse text-right' : 'text-left'
          }`}>
            <p className="text-sm text-gray-400">
              © 2024 {t.companyName} - {t.rights}
            </p>
            <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                {language === 'ar' ? 'ملفات تعريف الارتباط' : 'Cookies'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
