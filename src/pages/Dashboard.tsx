
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { DashboardContent } from '@/components/DashboardContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { theme } = useTheme();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen flex">
      <DashboardBackground />
      
      {/* Main Dashboard Content */}
      <div className="flex-1 relative">
        <DashboardContent 
          data={{}}
          theme={theme}
          language={language}
          isRTL={isRTL}
          content={{}}
        />
      </div>
    </div>
  );
};

export default Dashboard;
