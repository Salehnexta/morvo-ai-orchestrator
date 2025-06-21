
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Globe } from 'lucide-react';
import { AnalysisResultsDisplay } from './AnalysisResultsDisplay';

interface AnalysisSuccessProps {
  results: any;
  websiteUrl: string;
  onComplete: () => void;
  language: 'ar' | 'en';
  content: {
    successTitle: string;
    reviewData: string;
  };
}

export const AnalysisSuccess: React.FC<AnalysisSuccessProps> = ({
  results,
  websiteUrl,
  onComplete,
  language,
  content
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <h2 className="text-2xl font-bold mb-2 text-green-600">{content.successTitle}</h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Globe className="w-4 h-4" />
          <span className="text-sm">{websiteUrl}</span>
        </div>
      </div>

      <AnalysisResultsDisplay 
        results={results}
        language={language}
      />
      
      <Button
        onClick={onComplete}
        className="w-full bg-green-600 hover:bg-green-700"
        size="lg"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {content.reviewData}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
