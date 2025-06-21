
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface AnalysisErrorProps {
  error: string;
  onRetry: () => void;
  onSkip: () => void;
  content: {
    errorTitle: string;
    tryAgain: string;
    continueManually: string;
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
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={onRetry}
            variant="outline"
          >
            {content.tryAgain}
          </Button>
          
          <Button onClick={onSkip}>
            {content.continueManually}
          </Button>
        </div>
      </div>
    </div>
  );
};
