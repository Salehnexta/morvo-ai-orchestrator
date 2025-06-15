
import { ChatInterface } from "@/components/ChatInterface";
import { DashboardContent } from "@/components/DashboardContent";
import { ProtectedDashboard } from "@/components/ProtectedDashboard";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();

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
            <DashboardContent />
          </div>
        </div>
      </div>
    </ProtectedDashboard>
  );
};

export default Dashboard;
