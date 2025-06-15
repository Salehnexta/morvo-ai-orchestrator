
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      companyName: "Morvo",
      companySubtitle: "النظام الاصطناعي يقود نجاحك التسويقي",
      description: "منصة التسويق الرقمي والذكاء الاصطناعي التي تساعدك على تحليل السوق وبناء استراتيجيات تسويقية فعالة باستخدام الذكاء الاصطناعي.",
      product: "المنتج",
      productItems: ["المميزات", "كيف يعمل", "الأسعار", "الأسئلة الشائعة", "الاتصال بالذكي"],
      resources: "المصادر", 
      resourceItems: ["قصص النجاح", "التحديثات", "مركز المساعدة", "الأسئلة الشائعة"],
      supportLegal: "الدعم والقانونية",
      supportLegalItems: ["الدعم", "تواصل معنا", "حالة الخدمة", "الشروط والأحكام", "سياسة الخصوصية"],
      newsletter: "النشرة الإخبارية",
      emailPlaceholder: "البريد الإلكتروني",
      subscribe: "اشتراك",
      rights: "جميع الحقوق محفوظة"
    },
    en: {
      companyName: "Morvo",
      companySubtitle: "AI System Drives Your Marketing Success",
      description: "Digital marketing and AI platform that helps you analyze the market and build effective marketing strategies using artificial intelligence.",
      product: "Product",
      productItems: ["Features", "How it Works", "Pricing", "FAQ", "AI Contact"],
      resources: "Resources",
      resourceItems: ["Success Stories", "Updates", "Help Center", "FAQ"],
      supportLegal: "Support & Legal",
      supportLegalItems: ["Support", "Contact Us", "Service Status", "Terms & Conditions", "Privacy Policy"],
      newsletter: "Newsletter",
      emailPlaceholder: "Email Address",
      subscribe: "Subscribe",
      rights: "All rights reserved"
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
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
            <p className="text-sm leading-relaxed mb-6 text-gray-300">
              {t.description}
            </p>
            
            {/* Social Media */}
            <div className={`flex gap-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
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
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t.product}
            </h4>
            <ul className="space-y-4">
              {t.productItems.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t.resources}
            </h4>
            <ul className="space-y-4">
              {t.resourceItems.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t.supportLegal}
            </h4>
            <ul className="space-y-4">
              {t.supportLegalItems.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
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
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                الشروط والأحكام
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                ملفات تعريف الارتباط
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
