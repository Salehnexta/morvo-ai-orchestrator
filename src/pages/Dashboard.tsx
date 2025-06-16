
import { ChatInterface } from "@/components/ChatInterface";
import { DashboardContent } from "@/components/DashboardContent";
import { SimpleAuthWrapper } from "@/components/SimpleAuthWrapper";
import { TokenBalance } from "@/components/TokenBalance";
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
    <SimpleAuthWrapper>
      <div 
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/lovable-uploads/ac9c9c9b-a4db-48f3-ae39-d0ae9a8c5ed4.png')` }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Dashboard Layout */}
        <div className="h-screen flex bg-black/50">
          {/* Sidebar with Token Balance - 300px width */}
          <div className={`w-80 border-r border-white/10 backdrop-blur-lg bg-black/10 p-4 ${isRTL ? 'border-l border-r-0' : ''}`}>
            <div className="mb-4">
              <TokenBalance />
            </div>
            
            {/* Additional sidebar content can go here */}
            <div className={`mt-6 p-4 rounded-lg backdrop-blur-md ${
              theme === 'dark' ? 'bg-white/5' : 'bg-white/10'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 text-white`}>
                {language === 'ar' ? 'الوصول السريع' : 'Quick Access'}
              </h3>
              <div className="space-y-2">
                <button className="w-full p-2 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
                  {language === 'ar' ? 'تحليل الأداء' : 'Performance Analytics'}
                </button>
                <button className="w-full p-2 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
                  {language === 'ar' ? 'إدارة المحتوى' : 'Content Management'}
                </button>
                <button className="w-full p-2 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
                  {language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface - Flexible width */}
          <div className="flex-1 border-r border-white/10 backdrop-blur-lg bg-black/10">
            <ChatInterface onBack={() => {}} />
          </div>

          {/* Dashboard Content - 400px width */}
          <div className="w-96">
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
    </SimpleAuthWrapper>
  );
};

export default Dashboard;
