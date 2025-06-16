
import { ChatInterface } from "@/components/ChatInterface";
import { DashboardContent } from "@/components/DashboardContent";
import { ProtectedChat } from "@/components/ProtectedChat";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      welcome: "مرحباً بلوحة التحكم",
      overview: "نظرة عامة"
    },
    en: {
      welcome: "Welcome to Dashboard", 
      overview: "Overview"
    }
  };

  // Mock data for dashboard
  const mockData = {
    totalUsers: 150,
    activeProjects: 12,
    revenue: 25000,
    growth: 15.2
  };

  return (
    <ProtectedChat>
      <div 
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/lovable-uploads/ac9c9c9b-a4db-48f3-ae39-d0ae9a8c5ed4.png')` }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Dashboard Layout */}
        <div className="h-screen flex bg-black/50">
          {/* Chat Interface - 40% width */}
          <div className="w-2/5 border-r border-white/10 backdrop-blur-lg bg-black/10">
            <ChatInterface onBack={() => {}} />
          </div>

          {/* Dashboard Content - 60% width */}
          <div className="flex-1">
            <DashboardContent 
              data={mockData}
              theme={theme}
              language={language}
              isRTL={isRTL}
              content={content}
            />
          </div>
        </div>
      </div>
    </ProtectedChat>
  );
};

export default Dashboard;
