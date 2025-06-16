
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, TrendingUp, Calendar, PenTool, Target, BarChart3, Sparkles } from 'lucide-react';
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

  if (contentType === 'hero') {
    return (
      <div 
        className="h-full w-full flex flex-col justify-center items-center text-center px-12"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Main Hero Content */}
        <div className="max-w-4xl">
          {/* Main Title - Large and Bold like Layla */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl mb-6 text-white/95 max-w-3xl font-light drop-shadow-lg">
            {t.subtitle}
          </p>

          {/* Description */}
          <p className="text-xl mb-12 text-white/90 max-w-2xl font-medium drop-shadow-md">
            {t.description}
          </p>

          {/* Action Buttons - Simple and Clean */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {t.actions.slice(0, 3).map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.key}
                  onClick={() => handleActionClick(action.key)}
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 text-base font-medium drop-shadow-lg"
                  variant="ghost"
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="max-w-lg">
            <p className="text-lg text-white/85 leading-relaxed drop-shadow-md">
              {t.cta}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder for other content types with clean styling
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center bg-black/30 backdrop-blur-sm p-12 rounded-2xl max-w-md border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
          {contentType === 'analytics' && (language === 'ar' ? 'لوحة التحليلات' : 'Analytics Dashboard')}
          {contentType === 'content-creator' && (language === 'ar' ? 'إنشاء المحتوى' : 'Content Creator')}
          {contentType === 'calendar' && (language === 'ar' ? 'التقويم' : 'Calendar')}
          {contentType === 'campaign' && (language === 'ar' ? 'إدارة الحملات' : 'Campaign Manager')}
        </h2>
        <p className="text-white/80 text-lg">
          {language === 'ar' ? 'قريباً...' : 'Coming soon...'}
        </p>
      </div>
    </div>
  );
};
