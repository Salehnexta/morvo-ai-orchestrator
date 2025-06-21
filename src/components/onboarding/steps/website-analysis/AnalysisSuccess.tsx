
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { AnalysisResultsDisplay } from './AnalysisResultsDisplay';

interface AnalysisSuccessProps {
  results?: any;
  websiteUrl?: string;
  onComplete: () => void;
  language: 'ar' | 'en';
  content: {
    successTitle: string;
    reviewData: string;
  };
}

export const AnalysisSuccess: React.FC<AnalysisSuccessProps> = ({
  results,
  websiteUrl = '',
  onComplete,
  language,
  content
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <h2 className="text-2xl font-bold mb-2 text-green-700">{content.successTitle}</h2>
      </div>

      {results && (
        <AnalysisResultsDisplay 
          results={results}
          websiteUrl={websiteUrl}
          language={language}
        />
      )}

      <Button
        onClick={onComplete}
        className="w-full"
        size="lg"
      >
        {content.reviewData}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
