
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, DollarSign, Users, TrendingUp } from 'lucide-react';

interface CampaignSidebarProps {
  contextData?: any;
  onActionClick?: (action: string) => void;
}

export const CampaignSidebar: React.FC<CampaignSidebarProps> = ({ 
  contextData, 
  onActionClick 
}) => {
  const { language } = useLanguage();

  return (
    <div className="h-full p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-orange-600" />
            {language === 'ar' ? 'إدارة الحملات' : 'Campaign Manager'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold">240K</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'الوصول' : 'Reach'}
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold">1.9%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">CTR</p>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
            <h4 className="font-semibold mb-2">
              {language === 'ar' ?  'الحملة النشطة' : 'Active Campaign'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {language === 'ar' 
                ? 'حملة التسويق الرقمي - المرحلة الثانية' 
                : 'Digital Marketing Campaign - Phase 2'
              }
            </p>
            <Badge className="mb-3">
              {language === 'ar' ? 'نشطة' : 'Active'}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onActionClick?.('optimize-campaign')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تحسين' : 'Optimize'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onActionClick?.('adjust-budget')}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'الميزانية' : 'Budget'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
