
import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

const Index = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [showChat, setShowChat] = useState(false);

  const content = {
    ar: {
      title: "مرحباً بك في مورفو AI",
      subtitle: "ابدأ من هنا واسألني أي شيء عن التسويق الذكي",
      analyticsDisplay: "عرض التحليلات",
      contentManagement: "إدارة المحتوى", 
      campaignCreation: "إنشاء حملة",
      chatPrompt: "اسأل أي شيء، كلما شاركت أكثر كلما تمكنا",
      startChat: "بدء المحادثة",
      marketingConsultant: "استشارة تسويقية"
    },
    en: {
      title: "Welcome to Morvo AI",
      subtitle: "Start here and ask me anything about smart marketing",
      analyticsDisplay: "Analytics Display",
      contentManagement: "Content Management",
      campaignCreation: "Campaign Creation", 
      chatPrompt: "Ask anything, the more you share the more we can help",
      startChat: "Start Chat",
      marketingConsultant: "Marketing Consultant"
    }
  };

  const t = content[language];

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/39febb03-65a7-47c5-9aca-0d3db40793e8.png')`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          {/* Top Right Chat Icon */}
          <div className={`absolute top-8 ${isRTL ? 'left-8' : 'right-8'}`}>
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <div className="text-sm font-semibold">saleh</div>
                <div className="text-xs opacity-80">{t.marketingConsultant}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`text-center max-w-4xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              {t.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 px-8 py-4 text-lg rounded-full"
              >
                + {t.analyticsDisplay}
              </Button>
              
              <Button 
                size="lg"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 px-8 py-4 text-lg rounded-full"
              >
                + {t.contentManagement}
              </Button>
              
              <Button 
                size="lg"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 px-8 py-4 text-lg rounded-full"
              >
                + {t.campaignCreation}
              </Button>
            </div>
          </div>

          {/* Bottom Chat Section */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <p className="text-white/90 text-lg mb-3">
                    {t.chatPrompt}
                  </p>
                </div>
                <Button
                  onClick={() => setShowChat(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t.startChat}
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="sm"
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2"
            >
              + {t.analyticsDisplay}
            </Button>
            <Button
              size="sm" 
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2"
            >
              + {t.contentManagement}
            </Button>
            <Button
              size="sm"
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2"
            >
              + {t.campaignCreation}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
