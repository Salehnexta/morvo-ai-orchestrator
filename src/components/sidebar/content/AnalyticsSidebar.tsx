
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Eye, MousePointer, DollarSign } from 'lucide-react';

interface AnalyticsSidebarProps {
  contextData?: any;
  onActionClick?: (action: string) => void;
}

export const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({ 
  contextData, 
  onActionClick 
}) => {
  const { language } = useLanguage();

  const metrics = [
    { icon: Eye, value: '12.4K', label: language === 'ar' ? 'المشاهدات' : 'Views', change: '+15%', positive: true },
    { icon: MousePointer, value: '2.8%', label: language === 'ar' ? 'معدل النقر' : 'CTR', change: '+0.4%', positive: true },
    { icon: DollarSign, value: '4.2x', label: 'ROAS', change: '+1.1x', positive: true },
    { icon: TrendingUp, value: '85%', label: language === 'ar' ? 'معدل الوصول' : 'Reach Rate', change: '-2%', positive: false }
  ];

  return (
    <div className="h-full p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            {language === 'ar' ? 'إحصائيات الأداء' : 'Performance Analytics'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {metrics.map((metric, index) => (
              <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <metric.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{metric.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  </div>
                </div>
                <Badge variant={metric.positive ? "default" : "destructive"} className="text-xs">
                  {metric.change}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onActionClick?.('view-detailed-analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'التفاصيل' : 'Details'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onActionClick?.('export-report')}
            >
              {language === 'ar' ? 'تصدير' : 'Export'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
