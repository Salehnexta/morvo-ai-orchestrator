
import { ChatInterface } from "@/components/ChatInterface";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const PublicChat = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      note: "ملاحظة: هذه محادثة تجريبية مجانية. يمكنك إنشاء حساب مجاني للحصول على 20,000 توكن مجاناً"
    },
    en: {
      note: "Note: This is a free demo chat. You can create a free account to get 20,000 tokens for free"
    }
  };

  const t = content[language];

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/lovable-uploads/ac9c9c9b-a4db-48f3-ae39-d0ae9a8c5ed4.png')` }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Notice - Simplified to avoid header conflicts */}
      <div className={`p-2 text-center border-b backdrop-blur-lg bg-yellow-500/10 ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
      }`}>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
        }`}>
          ⚠️ {t.note}
        </p>
      </div>

      {/* Chat Interface - Remove extra header styling to prevent conflicts */}
      <div className="h-[calc(100vh-48px)]">
        <ChatInterface onBack={() => {}} />
      </div>
    </div>
  );
};

export default PublicChat;
