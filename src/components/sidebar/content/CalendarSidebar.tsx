
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus } from 'lucide-react';

interface CalendarSidebarProps {
  contextData?: any;
  onActionClick?: (action: string) => void;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ 
  contextData, 
  onActionClick 
}) => {
  const { language } = useLanguage();

  const scheduledPosts = [
    {
      platform: 'LinkedIn',
      content: language === 'ar' ? 'منشور عن استراتيجيات...' : 'Post about marketing strategies...',
      time: language === 'ar' ? 'غداً 9 صباحاً' : 'Tomorrow 9 AM',
      status: 'scheduled'
    },
    {
      platform: 'Instagram',
      content: language === 'ar' ? 'قصة تفاعلية...' : 'Interactive story...',
      time: language === 'ar' ? 'اليوم 6 مساءً' : 'Today 6 PM',
      status: 'pending'
    },
    {
      platform: 'Twitter',
      content: language === 'ar' ? 'تغريدة نصائح...' : 'Tips tweet...',
      time: language === 'ar' ? 'بعد ساعتين' : 'In 2 hours',
      status: 'ready'
    }
  ];

  return (
    <div className="h-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
            {language === 'ar' ? 'جدولة المحتوى' : 'Content Scheduler'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scheduledPosts.map((post, index) => (
            <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{post.platform}</span>
                <Badge 
                  variant={post.status === 'ready' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {post.status === 'ready' 
                    ? (language === 'ar' ? 'جاهز' : 'Ready')
                    : post.status === 'scheduled' 
                    ? (language === 'ar' ? 'مجدول' : 'Scheduled')
                    : (language === 'ar' ? 'معلق' : 'Pending')
                  }
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                {post.content}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {post.time}
              </div>
            </div>
          ))}
          
          <Button 
            className="w-full mt-4" 
            onClick={() => onActionClick?.('schedule-new-post')}
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'جدولة منشور جديد' : 'Schedule New Post'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
