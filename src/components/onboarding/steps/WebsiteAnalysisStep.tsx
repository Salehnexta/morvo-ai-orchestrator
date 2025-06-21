
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
}

export const WebsiteAnalysisStep: React.FC<WebsiteAnalysisStepProps> = ({
  onComplete,
  onSkip
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
  } = useWebsiteAnalysis();

  const content = {
    ar: {
      title: 'تحليل موقعك الإلكتروني',
      subtitle: 'سنحلل موقعك لجمع المعلومات وتوفير الوقت عليك',
      urlLabel: 'رابط موقعك الإلكتروني',
      urlPlaceholder: 'https://your-website.com',
      analyzeButton: 'تحليل الموقع',
      skipButton: 'إدخال البيانات يدوياً',
      skipDescription: 'ليس لديك موقع إلكتروني؟ لا مشكلة! يمكنك إدخال معلومات شركتك مباشرة في الخطوة التالية.',
      analyzingTitle: 'جاري تحليل موقعك...',
      analyzingSubtitle: 'يستغرق هذا عادة 30-45 ثانية',
      errorTitle: 'فشل في التحليل',
      tryAgain: 'حاول مرة أخرى',
      continueManually: 'المتابعة إلى الخطوة التالية',
      manualEntryMessage: 'لا تقلق! يمكنك المتابعة بدون تحليل الموقع',
      manualEntryDescription: 'ستتمكن من إدخال جميع معلومات شركتك وأهدافك التسويقية في الخطوات التالية بسهولة.',
      successTitle: 'تم التحليل بنجاح!',
      reviewData: 'مراجعة البيانات والمتابعة',
      invalidUrl: 'يرجى إدخال رابط صحيح'
    },
    en: {
      title: 'Analyze Your Website',
      subtitle: "We'll analyze your website to gather information and save you time",
      urlLabel: 'Your Website URL',
      urlPlaceholder: 'https://your-website.com',
      analyzeButton: 'Analyze Website',
      skipButton: 'Enter Data Manually',
      skipDescription: "Don't have a website? No problem! You can directly enter your company information in the next step.",
      analyzingTitle: 'Analyzing your website...',
      analyzingSubtitle: 'This usually takes 30-45 seconds',
      errorTitle: 'Analysis Failed',
      tryAgain: 'Try Again',
      continueManually: 'Continue to Next Step',
      manualEntryMessage: "Don't worry! You can continue without website analysis",
      manualEntryDescription: "You'll be able to easily enter all your company information and marketing goals in the following steps.",
      successTitle: 'Analysis Complete!',
      reviewData: 'Review Data & Continue',
      invalidUrl: 'Please enter a valid URL'
    }
  };

  const t = content[language];

  const handleComplete = () => {
    onComplete({
      website_url: websiteUrl,
      analysis_results: analysisResults,
      // Structure the data according to our defined schema
      structured_data: {
        company_overview: analysisResults?.company_overview || '',
        core_offerings: analysisResults?.core_offerings || '',
        technical_products: analysisResults?.technical_products || '',
        key_team_members: analysisResults?.key_team_members || '',
        business_focus: analysisResults?.business_focus || '',
        additional_insights: analysisResults?.additional_insights || '',
        product_descriptions: analysisResults?.product_descriptions || '',
        api_documentation: analysisResults?.api_documentation || '',
        use_cases: analysisResults?.use_cases || '',
        blog_updates: analysisResults?.blog_updates || '',
        contact_information: analysisResults?.contact_information || '',
        team_bios: analysisResults?.team_bios || '',
        social_media: analysisResults?.social_media || ''
      }
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
            results={analysisResults}
            websiteUrl={websiteUrl}
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="space-y-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};
