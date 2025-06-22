
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GreetingPreferenceStep } from '../steps/GreetingPreferenceStep';
import { WebsiteAnalysisStep } from '../steps/WebsiteAnalysisStep';
import { ProfileCompletionStep } from '../steps/ProfileCompletionStep';
import { WelcomePhaseContent } from './WelcomePhaseContent';
import { AnalysisReviewPhaseContent } from './AnalysisReviewPhaseContent';
import { ProfessionalAnalysisPhaseContent } from './ProfessionalAnalysisPhaseContent';
import { StrategyGenerationPhaseContent } from './StrategyGenerationPhaseContent';

interface PhaseContentRendererProps {
  currentPhase: string;
  loading: boolean;
  journey: any;
  websiteAnalysisData: any;
  fullGreeting: string;
  displayName: string;
  greetingLoading: boolean;
  onPhaseAction: (action: string, data?: any) => void;
}

export const PhaseContentRenderer: React.FC<PhaseContentRendererProps> = ({
  currentPhase,
  loading,
  journey,
  websiteAnalysisData,
  fullGreeting,
  displayName,
  greetingLoading,
  onPhaseAction
}) => {
  console.log('🎨 Rendering phase:', currentPhase);
  
  switch (currentPhase) {
    case 'welcome':
      return (
        <WelcomePhaseContent
          onComplete={() => onPhaseAction('complete_phase')}
          loading={loading}
          fullGreeting={fullGreeting}
          displayName={displayName}
          greetingLoading={greetingLoading}
        />
      );

    case 'greeting_preference':
      return (
        <GreetingPreferenceStep
          onComplete={(greeting) => onPhaseAction('set_greeting', { greeting })}
          loading={loading}
          currentGreeting={journey?.greeting_preference}
        />
      );

    case 'website_analysis':
      return (
        <WebsiteAnalysisStep
          onComplete={(data) => onPhaseAction('website_analysis_complete', data)}
          onSkip={() => onPhaseAction('skip_website_analysis')}
        />
      );

    case 'analysis_review':
      return (
        <AnalysisReviewPhaseContent
          onComplete={() => onPhaseAction('analysis_review_complete')}
          loading={loading}
          websiteAnalysisData={websiteAnalysisData}
        />
      );

    case 'profile_completion':
      return (
        <ProfileCompletionStep
          onComplete={(data) => onPhaseAction('profile_completion_complete', data)}
          onSkip={() => onPhaseAction('professional_analysis_complete')}
          loading={loading}
          initialData={journey}
        />
      );

    case 'professional_analysis':
      return (
        <ProfessionalAnalysisPhaseContent
          onComplete={() => onPhaseAction('professional_analysis_complete')}
          loading={loading}
        />
      );

    case 'strategy_generation':
      return (
        <StrategyGenerationPhaseContent
          onGenerateStrategy={() => onPhaseAction('generate_strategy')}
          loading={loading}
          fullGreeting={fullGreeting}
          greetingLoading={greetingLoading}
        />
      );

    default:
      return (
        <Card className="bg-gray-800/95 border-gray-600/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">مرحلة غير معرّفة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200 mb-4">حدث خطأ في تحديد المرحلة الحالية</p>
            <Button
              onClick={() => onPhaseAction('complete_phase')}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              المتابعة
            </Button>
          </CardContent>
        </Card>
      );
  }
};
