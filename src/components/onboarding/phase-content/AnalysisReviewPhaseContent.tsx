
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnalysisReviewPhaseContentProps {
  onComplete: () => void;
  loading: boolean;
  websiteAnalysisData: any;
}

export const AnalysisReviewPhaseContent: React.FC<AnalysisReviewPhaseContentProps> = ({
  onComplete,
  loading,
  websiteAnalysisData
}) => {
  return (
    <Card className="bg-gray-800/90 border-gray-600/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">مراجعة نتائج التحليل</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-200">
          تم تحليل موقعك بنجاح. يمكنك الآن مراجعة النتائج والمتابعة لإكمال ملفك التجاري.
        </p>
        {websiteAnalysisData && (
          <div className="bg-green-600/20 p-4 rounded-lg border border-green-500/30">
            <p className="text-green-200">✅ تم تحليل الموقع بنجاح</p>
          </div>
        )}
        <Button
          onClick={onComplete}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          المتابعة لإكمال الملف التجاري
        </Button>
      </CardContent>
    </Card>
  );
};
