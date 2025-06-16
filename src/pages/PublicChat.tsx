
import { ChatInterface } from "@/components/ChatInterface";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PublicChat = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      title: "محادثة عامة - مورفو",
      subtitle: "جرب المساعد الذكي الآن بدون تسجيل دخول",
      backToHome: "العودة للرئيسية",
      note: "ملاحظة: هذه محادثة تجريبية عامة. للحصول على الميزات الكاملة، يرجى تسجيل الدخول"
    },
    en: {
      title: "Public Chat - Morvo",
      subtitle: "Try our smart assistant now without login",
      backToHome: "Back to Home",
      note: "Note: This is a public demo chat. For full features, please login"
    }
  };

  const t = content[language];
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/lovable-uploads/ac9c9c9b-a4db-48f3-ae39-d0ae9a8c5ed4.png')` }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className={`p-4 border-b backdrop-blur-lg bg-black/10 ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${
                theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-white/20'
              }`}
            >
              <BackIcon className="w-4 h-4" />
              {t.backToHome}
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.title}
            </h1>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.subtitle}
            </p>
          </div>

          <Link to="/auth/login">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Notice */}
      <div className={`p-3 text-center border-b backdrop-blur-lg bg-yellow-500/10 ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
      }`}>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
        }`}>
          ⚠️ {t.note}
        </p>
      </div>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-140px)]">
        <ChatInterface onBack={() => {}} />
      </div>
    </div>
  );
};

export default PublicChat;
