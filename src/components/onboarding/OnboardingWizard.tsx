
import React, { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { WelcomeStep } from './steps/WelcomeStep';
import { CompanyInfoStep } from './steps/CompanyInfoStep';
import { MarketingGoalsStep } from './steps/MarketingGoalsStep';
import { TargetAudienceStep } from './steps/TargetAudienceStep';
import { BudgetStep } from './steps/BudgetStep';
import { ChannelsStep } from './steps/ChannelsStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { CompletionStep } from './steps/CompletionStep';

interface OnboardingWizardProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkip }) => {
  const { language, isRTL } = useLanguage();
  const { steps, currentStep, completionPercentage, updateStep, skipStep, loading } = useOnboarding();
  const [localStep, setLocalStep] = useState(currentStep);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  const content = {
    ar: {
      title: 'مرحباً بك في مورفو AI',
      subtitle: 'دعنا نتعرف عليك لنقدم لك أفضل تجربة تسويقية',
      next: 'التالي',
      previous: 'السابق',
      skip: 'تخطي',
      complete: 'إنهاء الإعداد',
      step: 'الخطوة',
      of: 'من',
      loading: 'جاري التحميل...'
    },
    en: {
      title: 'Welcome to Morvo AI',
      subtitle: 'Let us get to know you to provide the best marketing experience',
      next: 'Next',
      previous: 'Previous',
      skip: 'Skip',
      complete: 'Complete Setup',
      step: 'Step',
      of: 'of',
      loading: 'Loading...'
    }
  };

  const t = content[language];

  const getCurrentStepComponent = () => {
    const currentStepInfo = steps.find(step => step.id === localStep);
    if (!currentStepInfo) return null;

    const commonProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSkip: currentStepInfo.required ? undefined : handleSkip,
      data: stepData[localStep] || {},
      onDataChange: (data: any) => setStepData(prev => ({ ...prev, [localStep]: data }))
    };

    switch (currentStepInfo.component) {
      case 'Welcome':
        return <WelcomeStep {...commonProps} />;
      case 'CompanyInfo':
        return <CompanyInfoStep {...commonProps} />;
      case 'MarketingGoals':
        return <MarketingGoalsStep {...commonProps} />;
      case 'TargetAudience':
        return <TargetAudienceStep {...commonProps} />;
      case 'Budget':
        return <BudgetStep {...commonProps} />;
      case 'Channels':
        return <ChannelsStep {...commonProps} />;
      case 'Experience':
        return <ExperienceStep {...commonProps} />;
      case 'Completion':
        return <CompletionStep {...commonProps} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    const success = await updateStep(localStep, stepData[localStep] || {});
    if (success) {
      setLocalStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setLocalStep(prev => Math.max(prev - 1, 1));
  };

  const handleSkip = async () => {
    const success = await skipStep(localStep);
    if (success) {
      setLocalStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">
                {t.title}
              </CardTitle>
            </div>
            <p className="text-blue-200 text-lg">{t.subtitle}</p>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white">
                  {t.step} {localStep} {t.of} {steps.length}
                </span>
                <span className="text-sm text-blue-200">
                  {Math.round((localStep / steps.length) * 100)}%
                </span>
              </div>
              <Progress value={(localStep / steps.length) * 100} className="h-2" />
            </div>

            {/* Steps Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step.id < localStep
                      ? 'bg-green-400'
                      : step.id === localStep
                      ? 'bg-blue-400'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {getCurrentStepComponent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
