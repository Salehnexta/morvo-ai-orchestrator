
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, Download } from 'lucide-react';

interface ChartSidebarProps {
  contextData?: any;
  onActionClick?: (action: string) => void;
}

export const ChartSidebar: React.FC<ChartSidebarProps> = ({ 
  contextData, 
  onActionClick 
}) => {
  const { language } = useLanguage();

  return (
    <div className="h-full p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            {language === 'ar' ? 'الرسوم البيانية' : 'Charts & Graphs'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'رسم بياني تفاعلي' : 'Interactive Chart'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onActionClick?.('show-bar-chart')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onActionClick?.('show-line-chart')}
            >
              <LineChart className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onActionClick?.('show-pie-chart')}
            >
              <PieChart className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            className="w-full"
            onClick={() => onActionClick?.('download-chart')}
          >
            <Download className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'تحميل الرسم البياني' : 'Download Chart'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
