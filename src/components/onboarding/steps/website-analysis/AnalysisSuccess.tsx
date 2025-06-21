
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface AnalysisSuccessProps {
  onComplete: () => void;
  language: 'ar' | 'en';
  content: {
    successTitle: string;
    reviewData: string;
  };
}

export const AnalysisSuccess: React.FC<AnalysisSuccessProps> = ({
  onComplete,
  language,
  content
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <h2 className="text-2xl font-bold mb-2 text-green-600">{content.successTitle}</h2>
        <p className="text-gray-600 mb-4">
          {language === 'ar' 
            ? 'تم تحليل موقعك بنجاح. يمكنك الآن مراجعة وتحرير المعلومات.'
            : 'Your website has been analyzed successfully. You can now review and edit the information.'
          }
        </p>
        
        <Button
          onClick={onComplete}
          className="w-full"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {content.reviewData}
        </Button>
      </div>
    </div>
  );
};
