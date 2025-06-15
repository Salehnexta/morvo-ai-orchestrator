
import { useTheme } from "@/contexts/ThemeContext";

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`border-t py-8 ${
      theme === 'dark' 
        ? 'border-white/10 bg-white/5' 
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Morvo AI | مورفو AI
            </h3>
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              منصة الذكاء الاصطناعي للتسويق - ثورة التسويق الرقمي بتنسيق 9 وكلاء متخصصين
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Next-generation AI marketing platform revolutionizing digital marketing with 9 specialized agents
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-md font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              روابط سريعة | Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  الرئيسية | Home
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  الوكلاء | Agents
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  الأسعار | Pricing
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  اتصل بنا | Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-md font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              الدعم | Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  المساعدة | Help
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  الوثائق | Documentation
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  الأسئلة الشائعة | FAQ
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm hover:underline ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  الحالة | Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2024 Morvo AI. جميع الحقوق محفوظة | All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className={`text-sm hover:underline ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                الخصوصية | Privacy
              </a>
              <a href="#" className={`text-sm hover:underline ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                الشروط | Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
