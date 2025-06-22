
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WelcomePhaseContentProps {
  onComplete: () => void;
  loading: boolean;
  fullGreeting: string;
  displayName: string;
  greetingLoading: boolean;
}

export const WelcomePhaseContent: React.FC<WelcomePhaseContentProps> = ({
  onComplete,
  loading,
  fullGreeting,
  displayName,
  greetingLoading
}) => {
  return (
    <Card className="bg-gray-800/95 border-gray-600/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-center flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-400" />
          {greetingLoading ? 'مرحباً بك في مورفو!' : `${fullGreeting}، مرحباً بك في مورفو!`}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-200 mb-6">
          {displayName !== 'مستخدم' ? 
            `${displayName}، سنقوم معاً ببناء استراتيجية تسويقية مخصصة لأعمالك في خطوات بسيطة` :
            'سنقوم معاً ببناء استراتيجية تسويقية مخصصة لأعمالك في خطوات بسيطة'
          }
        </p>
        <div className="bg-gray-700/80 rounded-lg p-4 mb-6 border border-gray-600/50">
          <h3 className="text-white font-semibold mb-2">ما ستحصل عليه:</h3>
          <ul className="text-gray-200 text-sm space-y-1 text-right">
            <li>• استراتيجية تسويقية شاملة مخصصة لأعمالك</li>
            <li>• خطة محتوى لـ 3-6 أشهر</li>
            <li>• تحليل منافسين وفرص السوق</li>
            <li>• جدول نشر مقترح</li>
            <li>• مؤشرات أداء مخصصة</li>
          </ul>
        </div>
        <Button
          onClick={onComplete}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          {loading ? 'جاري التحضير...' : 'ابدأ الرحلة'}
          <ArrowRight className="w-4 h-4 mr-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
