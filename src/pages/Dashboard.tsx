
import { ChatInterface } from "@/components/ChatInterface";
import { DashboardContent } from "@/components/DashboardContent";
import { ProtectedDashboard } from "@/components/ProtectedDashboard";
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
    <ProtectedDashboard>
      <div 
        className={`min-h-screen ${
          theme === 'dark' 
            ? 'bg-gray-900' 
            : 'bg-gradient-to-br from-gray-50 to-white'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("/lovable-uploads/f7658506-ad00-4cf7-a7c1-fb72fdbe720d.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Dashboard Layout */}
        <div className="relative z-10 h-screen flex">
          {/* Chat Interface - 40% width */}
          <div className="w-2/5 border-r border-gray-200 dark:border-gray-700">
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
    </ProtectedDashboard>
  );
};

export default Dashboard;
