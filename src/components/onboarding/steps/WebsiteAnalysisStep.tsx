
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWebsiteAnalysis } from './website-analysis/useWebsiteAnalysis';
import { WebsiteUrlInput } from './website-analysis/WebsiteUrlInput';
import { AnalysisProgress } from './website-analysis/AnalysisProgress';
import { AnalysisError } from './website-analysis/AnalysisError';
import { AnalysisSuccess } from './website-analysis/AnalysisSuccess';

interface WebsiteAnalysisStepProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
  journeyId: string;
}

export const WebsiteAnalysisStep: React.FC<WebsiteAnalysisStepProps> = ({
  onComplete,
  onSkip,
  journeyId
}) => {
  const { language } = useLanguage();
  const {
    websiteUrl,
    setWebsiteUrl,
    analysisState,
    analysisProgress,
    error,
    analysisResults,
    startAnalysis,
    resetToInput
  } = useWebsiteAnalysis(journeyId);

  const content = {
    ar: {
      title: 'تحليل موقعك الإلكتروني',
      subtitle: 'سنحلل موقعك لجمع المعلومات وتوفير الوقت عليك',
      urlLabel: 'رابط موقعك الإلكتروني',
      urlPlaceholder: 'https://your-website.com',
      analyzeButton: 'تحليل الموقع',
      skipButton: 'لا يوجد موقع؟ إدخال يدوي',
      analyzingTitle: 'جاري تحليل موقعك...',
      analyzingSubtitle: 'يستغرق هذا عادة 30-45 ثانية',
      errorTitle: 'فشل في التحليل',
      tryAgain: 'حاول مرة أخرى',
      continueManually: 'المتابعة يدوياً',
      successTitle: 'تم التحليل بنجاح!',
      reviewData: 'مراجعة البيانات',
      invalidUrl: 'يرجى إدخال رابط صحيح'
    },
    en: {
      title: 'Analyze Your Website',
      subtitle: "We'll analyze your website to gather information and save you time",
      urlLabel: 'Your Website URL',
      urlPlaceholder: 'https://your-website.com',
      analyzeButton: 'Analyze Website',
      skipButton: "Don't have a website? Fill manually",
      analyzingTitle: 'Analyzing your website...',
      analyzingSubtitle: 'This usually takes 30-45 seconds',
      errorTitle: 'Analysis Failed',
      tryAgain: 'Try Again',
      continueManually: 'Continue Manually',
      successTitle: 'Analysis Complete!',
      reviewData: 'Review Data',
      invalidUrl: 'Please enter a valid URL'
    }
  };

  const t = content[language];

  const handleComplete = () => {
    onComplete({
      website_url: websiteUrl,
      analysis_results: analysisResults
    });
  };

  const renderContent = () => {
    switch (analysisState) {
      case 'input':
        return (
          <WebsiteUrlInput
            websiteUrl={websiteUrl}
            onUrlChange={setWebsiteUrl}
            onAnalyze={() => startAnalysis(t.invalidUrl)}
            onSkip={onSkip}
            error={error}
            isAnalyzing={false}
            content={t}
          />
        );

      case 'analyzing':
        return (
          <AnalysisProgress
            progress={analysisProgress}
            language={language}
            content={t}
          />
        );

      case 'error':
        return (
          <AnalysisError
            error={error}
            onRetry={resetToInput}
            onSkip={onSkip}
            content={t}
          />
        );

      case 'completed':
        return (
          <AnalysisSuccess
            onComplete={handleComplete}
            language={language}
            content={t}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="space-y-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};
