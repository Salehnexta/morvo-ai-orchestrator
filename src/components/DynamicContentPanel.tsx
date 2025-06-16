
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, TrendingUp, Calendar, PenTool, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DynamicContentPanelProps {
  contentType?: 'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign';
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

  if (contentType === 'hero') {
    return (
      <div 
        className="h-full w-full relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-8 text-white">
          {/* AI Brain Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-4 drop-shadow-md text-white/90 max-w-2xl">
            {t.subtitle}
          </p>

          {/* Description */}
          <p className="text-lg mb-12 text-white/80 max-w-xl">
            {t.description}
          </p>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
            {t.actions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.key}
                  onClick={() => handleActionClick(action.key)}
                  className="h-16 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
                  variant="ghost"
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12">
            <p className="text-sm text-white/70 mb-4">
              {language === 'ar' 
                ? 'ابدأ محادثة واكتشف قوة الذكاء الاصطناعي في التسويق' 
                : 'Start a conversation and discover the power of AI in marketing'
              }
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
      </div>
    );
  }

  // Placeholder for other content types
  return (
    <div className={`h-full w-full flex items-center justify-center ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {contentType === 'analytics' && (language === 'ar' ? 'لوحة التحليلات' : 'Analytics Dashboard')}
          {contentType === 'content-creator' && (language === 'ar' ? 'إنشاء المحتوى' : 'Content Creator')}
          {contentType === 'calendar' && (language === 'ar' ? 'التقويم' : 'Calendar')}
          {contentType === 'campaign' && (language === 'ar' ? 'إدارة الحملات' : 'Campaign Manager')}
        </h2>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          {language === 'ar' ? 'قريباً...' : 'Coming soon...'}
        </p>
      </div>
    </div>
  );
};
