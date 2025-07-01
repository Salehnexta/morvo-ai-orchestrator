
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { DirectGPT4ChatInterface } from '@/components/chat/DirectGPT4ChatInterface';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            مورفو GPT-4 المباشر
          </h1>
          <p className="text-white/70">
            تحدث مباشرة مع GPT-4 للحصول على أفضل النصائح التسويقية
          </p>
        </div>
        
        <div className="h-[calc(100vh-200px)]">
          <DirectGPT4ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
