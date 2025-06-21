
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PenTool, Play, Edit, Share2, Instagram, Twitter } from 'lucide-react';

interface ContentCreatorSidebarProps {
  contextData?: any;
  onActionClick?: (action: string) => void;
}

export const ContentCreatorSidebar: React.FC<ContentCreatorSidebarProps> = ({ 
  contextData, 
  onActionClick 
}) => {
  const { language } = useLanguage();

  const draftContent = [
    {
      platform: 'Instagram',
      icon: Instagram,
      content: language === 'ar' 
        ? '🚀 إطلاق منتجنا الجديد! اكتشف قوة الذكاء الاصطناعي...'
        : '🚀 Exciting news! Our new AI-powered tool is here...',
      status: 'draft'
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      content: language === 'ar'
        ? 'نصائح التسويق الرقمي: ابدأ بفهم جمهورك المستهدف...'
        : 'Digital marketing tip: Start by understanding your target audience...',
      status: 'ready'
    }
  ];

  return (
    <div className="h-full p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PenTool className="w-5 h-5 text-green-600" />
            {language === 'ar' ? 'منشئ المحتوى' : 'Content Creator'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {draftContent.map((item, index) => (
            <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <item.icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">{item.platform}</span>
                <Badge variant={item.status === 'ready' ? 'default' : 'outline'} className="ml-auto">
                  {item.status === 'ready' 
                    ? (language === 'ar' ? 'جاهز' : 'Ready')
                    : (language === 'ar' ? 'مسودة' : 'Draft')
                  }
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {item.content}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={item.status === 'ready' ? 'default' : 'outline'}
                  onClick={() => onActionClick?.(item.status === 'ready' ? 'publish-content' : 'edit-content')}
                >
                  {item.status === 'ready' ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'نشر' : 'Publish'}
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'مشاركة' : 'Share'}
                </Button>
              </div>
            </div>
          ))}
          
          <Button 
            className="w-full mt-4" 
            onClick={() => onActionClick?.('create-new-content')}
          >
            <PenTool className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إنشاء محتوى جديد' : 'Create New Content'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
