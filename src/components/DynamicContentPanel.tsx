
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, TrendingUp, Calendar, PenTool, Target, BarChart3, Sparkles, Play, Edit, Share2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectionTest } from './ConnectionTest';

// Smart Panel Components
const AnalyticsPanel = ({ language, theme }: { language: string; theme: string }) => (
  <div className="h-full p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      {language === 'ar' ? 'لوحة التحليلات' : 'Analytics Dashboard'}
    </h2>
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{language === 'ar' ? 'العائد على الاستثمار' : 'ROAS'}</h3>
        <p className="text-3xl font-bold text-green-600">4.2x</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{language === 'ar' ? 'معدل النقر' : 'CTR'}</h3>
        <p className="text-3xl font-bold text-blue-600">2.8%</p>
      </div>
    </div>
  </div>
);

const ContentCreatorPanel = ({ language, theme }: { language: string; theme: string }) => (
  <div className="h-full p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      {language === 'ar' ? 'منشئ المحتوى' : 'Content Creator'}
    </h2>
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{language === 'ar' ? 'محتوى جاهز للنشر' : 'Ready to Post'}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          "🚀 Exciting news! Our new AI-powered marketing tool is here..."
        </p>
        <div className="flex gap-2">
          <Button size="sm"><Play className="w-4 h-4 mr-2" />{language === 'ar' ? 'نشر' : 'Post'}</Button>
          <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" />{language === 'ar' ? 'تعديل' : 'Edit'}</Button>
        </div>
      </div>
    </div>
  </div>
);

const CalendarPanel = ({ language, theme }: { language: string; theme: string }) => (
  <div className="h-full p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      {language === 'ar' ? 'التقويم' : 'Content Calendar'}
    </h2>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">{language === 'ar' ? 'المنشورات المجدولة' : 'Scheduled Posts'}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span>LinkedIn Post - Tomorrow 9 AM</span>
          <Button size="sm" variant="outline">{language === 'ar' ? 'تعديل' : 'Edit'}</Button>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span>Instagram Story - Today 6 PM</span>
          <Button size="sm" variant="outline">{language === 'ar' ? 'تعديل' : 'Edit'}</Button>
        </div>
      </div>
    </div>
  </div>
);

const CampaignPanel = ({ language, theme }: { language: string; theme: string }) => (
  <div className="h-full p-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      {language === 'ar' ? 'إدارة الحملات' : 'Campaign Manager'}
    </h2>
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{language === 'ar' ? 'حملة تيك توك الجديدة' : 'New TikTok Campaign'}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الوصول المتوقع' : 'Estimated Reach'}</p>
            <p className="text-2xl font-bold">240K</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'ar' ? 'معدل النقر المتوقع' : 'Predicted CTR'}</p>
            <p className="text-2xl font-bold">1.9%</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button><Share2 className="w-4 h-4 mr-2" />{language === 'ar' ? 'إطلاق الحملة' : 'Launch Campaign'}</Button>
          <Button variant="outline"><DollarSign className="w-4 h-4 mr-2" />{language === 'ar' ? 'تعديل الميزانية' : 'Adjust Budget'}</Button>
        </div>
      </div>
    </div>
  </div>
);

interface DynamicContentPanelProps {
  contentType?: 'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'connection-test';
  onActionClick?: (action: string) => void;
}

export const DynamicContentPanel = ({ contentType = 'hero', onActionClick }: DynamicContentPanelProps) => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      title: 'عبقري التسويق الذكي',
      subtitle: 'مساعدك الذكي لصناعة استراتيجيات تسويقية متقدمة',
      description: 'هل لديك حملة قادمة؟ ابدأ من هنا واسألني أي شيء عنها',
      cta: 'ابدأ محادثة واكتشف قوة الذكاء الاصطناعي في التسويق',
      actions: [
        { key: 'analytics', label: 'عرض التحليلات', icon: BarChart3 },
        { key: 'create-content', label: 'إنشاء محتوى', icon: PenTool },
        { key: 'schedule', label: 'جدولة المنشورات', icon: Calendar },
        { key: 'campaigns', label: 'إدارة الحملات', icon: Target },
        { key: 'trends', label: 'تحليل الاتجاهات', icon: TrendingUp }
      ]
    },
    en: {
      title: 'YOUR MARKETING AI GENIUS',
      subtitle: 'Your intelligent assistant for advanced marketing strategies',
      description: 'Got a campaign coming up? Start here by asking me anything about it',
      cta: 'Start a conversation and discover the power of AI in marketing',
      actions: [
        { key: 'analytics', label: 'View Analytics', icon: BarChart3 },
        { key: 'create-content', label: 'Create Content', icon: PenTool },
        { key: 'schedule', label: 'Schedule Posts', icon: Calendar },
        { key: 'campaigns', label: 'Manage Campaigns', icon: Target },
        { key: 'trends', label: 'Analyze Trends', icon: TrendingUp }
      ]
    }
  };

  const t = content[language];

  const handleActionClick = (actionKey: string) => {
    if (onActionClick) {
      onActionClick(actionKey);
    }
  };

  // Smart panel rendering based on content type
  const renderSmartPanel = () => {
    switch (contentType) {
      case 'analytics':
        return <AnalyticsPanel language={language} theme={theme} />;
      case 'content-creator':
        return <ContentCreatorPanel language={language} theme={theme} />;
      case 'calendar':
        return <CalendarPanel language={language} theme={theme} />;
      case 'campaign':
        return <CampaignPanel language={language} theme={theme} />;
      case 'connection-test':
        return (
          <div className="h-full p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <ConnectionTest />
          </div>
        );
      default:
        return null;
    }
  };

  if (contentType === 'hero') {
    return (
      <div 
        className="h-full w-full flex flex-col justify-center items-center text-center px-8"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Layla-style Hero Content */}
        <div className="max-w-2xl space-y-8">
          {/* Main Title - Exactly like Layla */}
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            {language === 'ar' ? 'عبقري التسويق الذكي' : 'Your marketing AI Genius'}
          </h1>

          {/* Subtitle - Layla style */}
          <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
            {language === 'ar' 
              ? 'هل لديك حملة قادمة؟ ابدأ من هنا واسألني أي شيء عنها'
              : 'Got a campaign coming up? Start here by asking me anything about it'
            }
          </p>

          {/* Arrow - Layla style pointing to chat */}
          <div className="flex justify-start">
            <div className="text-white/70 text-6xl font-thin">
              {isRTL ? '←' : '→'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render smart panels based on content type
  const smartPanel = renderSmartPanel();
  if (smartPanel) {
    return smartPanel;
  }

  // Fallback for unknown content types
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center bg-black/30 backdrop-blur-sm p-12 rounded-2xl max-w-md border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
          {language === 'ar' ? 'قريباً...' : 'Coming soon...'}
        </h2>
      </div>
    </div>
  );
};
