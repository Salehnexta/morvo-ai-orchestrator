
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      companyName: "متجر زد",
      companySubtitle: "Zid Store",
      description: "منصة التجارة الإلكترونية الرائدة في المملكة العربية السعودية مع حلول شاملة لنمو أعمالك",
      descriptionEn: "Leading e-commerce platform in Saudi Arabia with comprehensive solutions for your business growth",
      quickLinks: "روابط سريعة",
      home: "الرئيسية",
      products: "المنتجات",
      pricing: "الأسعار",
      success: "قصص النجاح",
      blog: "المدونة",
      about: "من نحن",
      services: "الخدمات",
      seo: "تحسين محركات البحث",
      social: "إدارة وسائل التواصل",
      content: "التسويق بالمحتوى",
      ads: "الإعلانات المدفوعة",
      analytics: "تحليل المنافسين",
      ecommerce: "التجارة الإلكترونية",
      contact: "تواصل معنا",
      newsletter: "النشرة الإخبارية",
      emailPlaceholder: "البريد الإلكتروني",
      subscribe: "اشتراك",
      rights: "جميع الحقوق محفوظة",
      rightsEn: "All rights reserved",
      privacy: "سياسة الخصوصية",
      terms: "الشروط والأحكام",
      cookies: "ملفات تعريف الارتباط"
    },
    en: {
      companyName: "Zid Store",
      companySubtitle: "متجر زد",
      description: "Leading e-commerce platform in Saudi Arabia with comprehensive solutions for your business growth",
      descriptionEn: "منصة التجارة الإلكترونية الرائدة في المملكة العربية السعودية مع حلول شاملة لنمو أعمالك",
      quickLinks: "Quick Links",
      home: "Home",
      products: "Products",
      pricing: "Pricing",
      success: "Success Stories",
      blog: "Blog",
      about: "About",
      services: "Services",
      seo: "SEO Optimization",
      social: "Social Media Management",
      content: "Content Marketing",
      ads: "Paid Advertising",
      analytics: "Competitor Analysis",
      ecommerce: "E-commerce Solutions",
      contact: "Contact Us",
      newsletter: "Newsletter",
      emailPlaceholder: "Email Address",
      subscribe: "Subscribe",
      rights: "All rights reserved",
      rightsEn: "جميع الحقوق محفوظة",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      cookies: "Cookie Policy"
    }
  };

  const t = content[language];

  return (
    <footer className={`mt-20 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-t border-gray-800' 
        : 'bg-gray-50 border-t border-gray-200'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ز</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t.companyName}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.companySubtitle}
                </p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.description}
            </p>
            <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {t.descriptionEn}
            </p>
            
            {/* Social Media */}
            <div className={`flex gap-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white' 
                  : 'bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200'
              }`}>
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white' 
                  : 'bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200'
              }`}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white' 
                  : 'bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200'
              }`}>
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white' 
                  : 'bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200'
              }`}>
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white' 
                  : 'bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200'
              }`}>
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.quickLinks}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.home}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.products}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.pricing}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.success}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.blog}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.about}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.services}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.seo}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.social}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.content}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.ads}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.analytics}
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
                }`}>
                  {t.ecommerce}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.contact}
            </h4>
            <div className="space-y-4">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  support@zid.sa
                </span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  +966 50 123 4567
                </span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  الرياض، المملكة العربية السعودية
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h5 className={`text-md font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.newsletter}
              </h5>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                  {t.subscribe}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${
            isRTL ? 'md:flex-row-reverse text-right' : 'text-left'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 {t.companyName} - {t.rights} | {t.rightsEn}
            </p>
            <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
              }`}>
                {t.privacy}
              </a>
              <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
              }`}>
                {t.terms}
              </a>
              <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
              }`}>
                {t.cookies}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
