
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
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
    <DashboardLayout
      isOnboardingComplete={true}
      contentType="hero"
      showOnboarding={false}
      lastUserMessage=""
      conversationHistory={[]}
      onContentTypeChange={(type) => console.log('Content type changed:', type)}
      onMessageSent={(message) => console.log('Message sent:', message)}
      onPhaseComplete={(phase) => console.log('Phase complete:', phase)}
      onContentAction={(action) => console.log('Content action:', action)}
    />
  );
};

export default Dashboard;
