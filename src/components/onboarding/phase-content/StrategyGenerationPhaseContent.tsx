
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';

interface StrategyGenerationPhaseContentProps {
  onGenerateStrategy: () => void;
  loading: boolean;
  fullGreeting: string;
  greetingLoading: boolean;
}

export const StrategyGenerationPhaseContent: React.FC<StrategyGenerationPhaseContentProps> = ({
  onGenerateStrategy,
  loading,
  fullGreeting,
  greetingLoading
}) => {
  return (
    <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          {greetingLoading ? 
            'تحضير استراتيجيتك الخاصة' : 
            `${fullGreeting}، تحضير استراتيجيتك الخاصة`
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-200">
          الآن سأقوم بإنشاء استراتيجية تسويقية مخصصة لك باستخدام أحدث تقنيات الذكاء الاصطناعي
        </p>
        <div className="bg-gray-700/60 p-4 rounded-lg text-right border border-gray-600/30">
          <p className="text-gray-200 text-sm">
            ستتضمن الاستراتيجية:
          </p>
          <ul className="text-gray-100 text-sm mt-2 space-y-1">
            <li>• تحليل السوق والمنافسين</li>
            <li>• استراتيجية المحتوى</li>
            <li>• خطة التسويق الرقمي</li>
            <li>• توصيات الأدوات والقنوات</li>
            <li>• جدول زمني للتنفيذ</li>
          </ul>
        </div>
        <Button
          onClick={onGenerateStrategy}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          {loading ? 'جاري توليد الاستراتيجية...' : 'توليد الاستراتيجية'}
          <Sparkles className="w-4 h-4 mr-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
