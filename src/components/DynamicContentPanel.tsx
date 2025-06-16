
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
        className="h-full w-full relative overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Clean background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-8 text-white">
          {/* AI Brain Icon with glow effect */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-24 h-24 glass-morphism rounded-full flex items-center justify-center mb-4 shadow-2xl">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-2xl text-white">
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-4 drop-shadow-lg text-white/95 max-w-2xl font-light">
            {t.subtitle}
          </p>

          {/* Description */}
          <p className="text-lg mb-12 text-white/90 max-w-xl font-medium">
            {t.description}
          </p>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mb-8">
            {t.actions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.key}
                  onClick={() => handleActionClick(action.key)}
                  className="h-20 glass-morphism hover:bg-white/20 border border-white/30 text-white flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-md"
                  variant="ghost"
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-xs font-medium leading-tight">{action.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="max-w-md">
            <p className="text-sm text-white/80 leading-relaxed">
              {t.cta}
            </p>
          </div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
      </div>
    );
  }

  // Placeholder for other content types with clean styling
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center glass-morphism p-8 rounded-2xl max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {contentType === 'analytics' && (language === 'ar' ? 'لوحة التحليلات' : 'Analytics Dashboard')}
          {contentType === 'content-creator' && (language === 'ar' ? 'إنشاء المحتوى' : 'Content Creator')}
          {contentType === 'calendar' && (language === 'ar' ? 'التقويم' : 'Calendar')}
          {contentType === 'campaign' && (language === 'ar' ? 'إدارة الحملات' : 'Campaign Manager')}
        </h2>
        <p className="text-white/80">
          {language === 'ar' ? 'قريباً...' : 'Coming soon...'}
        </p>
      </div>
    </div>
  );
};
