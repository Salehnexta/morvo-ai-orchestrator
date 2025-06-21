
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, FileText } from 'lucide-react';

interface AnalysisErrorProps {
  error: string;
  onRetry: () => void;
  onSkip: () => void;
  content: {
    errorTitle: string;
    tryAgain: string;
    continueManually: string;
    manualEntryMessage: string;
    manualEntryDescription: string;
  };
}

export const AnalysisError: React.FC<AnalysisErrorProps> = ({
  error,
  onRetry,
  onSkip,
  content
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
        <h2 className="text-2xl font-bold mb-2 text-red-600">{content.errorTitle}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>

      {/* Manual Entry Encouragement */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex items-center mb-2">
          <FileText className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-blue-800">{content.manualEntryMessage}</h3>
        </div>
        <p className="text-blue-700 text-sm">{content.manualEntryDescription}</p>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button
          onClick={onSkip}
          className="bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <FileText className="w-4 h-4 mr-2" />
          {content.continueManually}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        
        <Button
          onClick={onRetry}
          variant="outline"
        >
          {content.tryAgain}
        </Button>
      </div>
    </div>
  );
};
