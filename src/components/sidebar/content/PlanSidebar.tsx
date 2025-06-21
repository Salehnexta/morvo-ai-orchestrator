
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface PlanSidebarProps {
  contextData?: any;
  onActionClick?: (action: string) => void;
}

export const PlanSidebar: React.FC<PlanSidebarProps> = ({ 
  contextData, 
  onActionClick 
}) => {
  const { language } = useLanguage();

  const planSteps = [
    {
      phase: language === 'ar' ? 'إعداد الحملة' : 'Campaign Setup',
      status: 'completed',
      description: language === 'ar' ? 'تم تحديد الأهداف والجمهور' : 'Goals and audience defined'
    },
    {
      phase: language === 'ar' ? 'إنشاء المحتوى' : 'Content Creation',
      status: 'in-progress',
      description: language === 'ar' ? 'جاري العمل على المحتوى' : 'Working on content materials'
    },
    {
      phase: language === 'ar' ? 'التنفيذ' : 'Execution',
      status: 'pending',
      description: language === 'ar' ? 'بدء الحملة والمتابعة' : 'Launch campaign and monitor'
    }
  ];

  return (
    <div className="h-full p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            {language === 'ar' ? 'خطة العمل' : 'Action Plan'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {planSteps.map((step, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-l-4 ${
                step.status === 'completed' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'
                  : step.status === 'in-progress'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{step.phase}</h4>
                <Badge 
                  variant={
                    step.status === 'completed' ? 'default' : 
                    step.status === 'in-progress' ? 'outline' : 'secondary'
                  }
                  className="text-xs"
                >
                  {step.status === 'completed' 
                    ? (language === 'ar' ? 'مكتمل' : 'Done')
                    : step.status === 'in-progress'
                    ? (language === 'ar' ? 'جاري' : 'Active')
                    : (language === 'ar' ? 'معلق' : 'Pending')
                  }
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
          
          <Button 
            className="w-full mt-4"
            onClick={() => onActionClick?.('view-full-plan')}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'عرض الخطة الكاملة' : 'View Full Plan'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
