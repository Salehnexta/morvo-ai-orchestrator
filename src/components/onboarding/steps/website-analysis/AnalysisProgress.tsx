
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  language: 'ar' | 'en';
  content: {
    analyzingTitle: string;
    analyzingSubtitle: string;
  };
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  progress,
  language,
  content
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
        <h2 className="text-2xl font-bold mb-2">{content.analyzingTitle}</h2>
        <p className="text-gray-600 mb-4">{content.analyzingSubtitle}</p>
        
        <div className="max-w-md mx-auto">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-500">
            {Math.round(progress)}% {language === 'ar' ? 'مكتمل' : 'complete'}
          </p>
        </div>
      </div>
    </div>
  );
};
