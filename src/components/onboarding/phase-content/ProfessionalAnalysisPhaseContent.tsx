
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfessionalAnalysisPhaseContentProps {
  onComplete: () => void;
  loading: boolean;
}

export const ProfessionalAnalysisPhaseContent: React.FC<ProfessionalAnalysisPhaseContentProps> = ({
  onComplete,
  loading
}) => {
  return (
    <Card className="bg-gray-800/90 border-gray-600/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">التحليل التسويقي المتقدم</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-200">
          سنقوم الآن بتحليل شامل لوضعك التسويقي الحالي باستخدام الذكاء الاصطناعي.
        </p>
        <div className="bg-amber-600/20 p-4 rounded-lg border border-amber-500/30">
          <p className="text-amber-200">🔄 التحليل المتقدم قيد التطوير</p>
          <p className="text-gray-200 text-sm mt-2">
            سيتم دمج تحليلات متقدمة من مصادر متعددة
          </p>
        </div>
        <Button
          onClick={onComplete}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          المتابعة لتوليد الاستراتيجية
        </Button>
      </CardContent>
    </Card>
  );
};
