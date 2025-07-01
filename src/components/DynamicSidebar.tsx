import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Calendar, 
  PenTool, 
  Target, 
  TrendingUp, 
  DollarSign,
  Play,
  Edit,
  Share2,
  Sparkles
} from 'lucide-react';

interface DynamicSidebarProps {
  contentType: 'default' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'chart' | 'plan';
  contextData?: any;
  onActionClick?: (action: string) => void;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ 
  contentType, 
  contextData,
  onActionClick 
}) => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const renderDefaultContent = () => (
    <div className="h-full bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/20 w-full max-w-sm">
            <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'ar' ? 'مورفو الذكي' : 'Morvo AI'}
            </h3>
            <p className="text-blue-200 mb-4">
              {language === 'ar' 
                ? 'مساعدك الذكي للتسويق الرقمي والأعمال'
                : 'Your intelligent marketing assistant'
              }
            </p>
            <Badge variant="outline" className="text-blue-300 border-blue-400/50">
              {language === 'ar' ? 'جاهز للمساعدة' : 'Ready to Help'}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">
                {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => onActionClick?.('analyze-website')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تحليل الموقع' : 'Analyze Website'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => onActionClick?.('create-content')}
              >
                <PenTool className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إنشاء محتوى' : 'Create Content'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => onActionClick?.('campaign-strategy')}
              >
                <Target className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'استراتيجية الحملة' : 'Campaign Strategy'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="h-full p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {language === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">4.2x</p>
                <p className="text-sm text-gray-600">ROAS</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">2.8%</p>
                <p className="text-sm text-gray-600">CTR</p>
              </div>
            </div>
            <Button className="w-full" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContentCreator = () => (
    <div className="h-full p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            {language === 'ar' ? 'محتوى جاهز' : 'Ready Content'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              "🚀 Exciting news! Our new AI-powered marketing tool is here..."
            </p>
            <div className="flex gap-2">
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'نشر' : 'Post'}
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCalendar = () => (
    <div className="h-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === 'ar' ? 'المنشورات المجدولة' : 'Scheduled Posts'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium">LinkedIn Post</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Tomorrow 9 AM</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium">Instagram Story</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Today 6 PM</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCampaign = () => (
    <div className="h-full p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {language === 'ar' ? 'حملة نشطة' : 'Active Campaign'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'الوصول' : 'Reach'}
              </p>
              <p className="text-lg font-bold">240K</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">CTR</p>
              <p className="text-lg font-bold">1.9%</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تحسين' : 'Optimize'}
            </Button>
            <Button variant="outline" size="sm">
              <DollarSign className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'ميزانية' : 'Budget'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChart = () => (
    <div className="h-full p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'الرسم البياني' : 'Chart View'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">{language === 'ar' ? 'رسم بياني تفاعلي' : 'Interactive Chart'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlan = () => (
    <div className="h-full p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'خطة العمل' : 'Action Plan'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
            <p className="text-sm font-medium">{language === 'ar' ? 'المرحلة 1' : 'Phase 1'}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'إعداد الحملة' : 'Campaign Setup'}
            </p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm font-medium">{language === 'ar' ? 'المرحلة 2' : 'Phase 2'}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'إنشاء المحتوى' : 'Content Creation'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (contentType) {
      case 'analytics':
        return (
          <div className="h-full p-6 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5" />
                  {language === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <p className="text-2xl font-bold text-green-400">4.2x</p>
                    <p className="text-sm text-white/70">ROAS</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-2xl font-bold text-blue-400">2.8%</p>
                    <p className="text-sm text-white/70">CTR</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'content-creator':
        return (
          <div className="h-full p-6 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <PenTool className="w-5 h-5" />
                  {language === 'ar' ? 'محتوى جاهز' : 'Ready Content'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-white/80 mb-3">
                    "🚀 Exciting news! Our new AI-powered marketing tool is here..."
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'نشر' : 'Post'}
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/20 text-white/80">
                      <Edit className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDefaultContent();
    }
  };

  return (
    <div className="w-80 h-full border-r border-white/10" dir={isRTL ? 'rtl' : 'ltr'}>
      {renderContent()}
    </div>
  );
};
