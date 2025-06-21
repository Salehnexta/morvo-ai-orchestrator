
import React, { useState, useEffect } from 'react';
import { useJourney } from '@/contexts/JourneyContext';
import { JourneyFlowService, JourneyFlowState } from '@/services/journeyFlowService';
import { JourneyProgress } from './JourneyProgress';
import { WebsiteAnalysisStep } from './steps/WebsiteAnalysisStep';
import { BusinessReviewStep } from './steps/BusinessReviewStep';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Globe, User, Target } from 'lucide-react';

interface JourneyPhaseHandlerProps {
  onPhaseComplete?: (phase: string) => void;
  className?: string;
}

export const JourneyPhaseHandler: React.FC<JourneyPhaseHandlerProps> = ({
  onPhaseComplete,
  className = ''
}) => {
  const { 
    journey, 
    currentPhase, 
    progress, 
    setGreeting, 
    analyzeWebsite, 
    updateJourneyPhase 
  } = useJourney();
  
  const [flowState, setFlowState] = useState<JourneyFlowState | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [websiteAnalysisData, setWebsiteAnalysisData] = useState<any>(null);

  // Load journey flow state
  useEffect(() => {
    const loadFlowState = async () => {
      if (journey?.journey_id) {
        const state = await JourneyFlowService.getJourneyFlowState(
          journey.journey_id, 
          journey.client_id
        );
        setFlowState(state);
      }
    };

    loadFlowState();
  }, [journey, currentPhase]);

  const handlePhaseAction = async (action: string, data?: any) => {
    if (!journey) return;

    setLoading(true);
    try {
      let success = false;

      switch (action) {
        case 'set_greeting':
          success = await setGreeting(data.greeting);
          if (success) {
            await JourneyFlowService.recordPhaseTransition(
              journey.journey_id,
              journey.client_id,
              'greeting_preference',
              'website_analysis',
              { greeting_selected: data.greeting }
            );
            updateJourneyPhase('website_analysis');
          }
          break;

        case 'website_analysis_complete':
          setWebsiteAnalysisData(data);
          updateJourneyPhase('business_review');
          success = true;
          break;

        case 'skip_website_analysis':
          updateJourneyPhase('manual_profile_setup');
          success = true;
          break;

        case 'business_review_complete':
          // Save the complete business profile
          const profileData = {
            ...data,
            website_analysis_data: websiteAnalysisData
          };
          
          await JourneyFlowService.recordPhaseTransition(
            journey.journey_id,
            journey.client_id,
            'business_review',
            'strategy_generation',
            profileData
          );
          updateJourneyPhase('strategy_generation');
          success = true;
          break;

        case 'back_to_website_analysis':
          updateJourneyPhase('website_analysis');
          success = true;
          break;

        case 'complete_phase':
          const nextPhase = flowState?.nextPhase;
          if (nextPhase) {
            await JourneyFlowService.recordPhaseTransition(
              journey.journey_id,
              journey.client_id,
              currentPhase,
              nextPhase,
              data
            );
            updateJourneyPhase(nextPhase);
            success = true;
          }
          break;
      }

      if (success && onPhaseComplete) {
        onPhaseComplete(currentPhase);
      }
    } catch (error) {
      console.error('❌ Phase action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPhaseContent = () => {
    const currentPhaseData = JourneyFlowService.getPhase(currentPhase);
    if (!currentPhaseData) return null;

    switch (currentPhase) {
      case 'welcome':
        return (
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">
                {currentPhaseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-blue-200 mb-6">{currentPhaseData.description}</p>
              <Button
                onClick={() => handlePhaseAction('complete_phase')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                ابدأ الرحلة <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 'greeting_preference':
        return (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                {currentPhaseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-200">{currentPhaseData.description}</p>
              <div className="space-y-3">
                <Label className="text-white">اختر طريقة المخاطبة المفضلة:</Label>
                <Select onValueChange={(value) => setFormData({...formData, greeting: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="أستاذ">أستاذ</SelectItem>
                    <SelectItem value="دكتور">دكتور</SelectItem>
                    <SelectItem value="مهندس">مهندس</SelectItem>
                    <SelectItem value="الاسم فقط">الاسم فقط</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handlePhaseAction('set_greeting', formData)}
                  disabled={loading || !formData.greeting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  حفظ التفضيل
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'website_analysis':
        return (
          <WebsiteAnalysisStep
            journeyId={journey?.journey_id || ''}
            onComplete={(data) => handlePhaseAction('website_analysis_complete', data)}
            onSkip={() => handlePhaseAction('skip_website_analysis')}
          />
        );

      case 'business_review':
        return (
          <BusinessReviewStep
            analysisData={websiteAnalysisData?.analysis_results}
            websiteUrl={websiteAnalysisData?.website_url || ''}
            onComplete={(data) => handlePhaseAction('business_review_complete', data)}
            onBack={() => handlePhaseAction('back_to_website_analysis')}
          />
        );

      default:
        return (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                {currentPhaseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 mb-4">{currentPhaseData.description}</p>
              <Button
                onClick={() => handlePhaseAction('complete_phase')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                إكمال هذه المرحلة
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  const estimatedTimeRemaining = flowState 
    ? JourneyFlowService.calculateEstimatedTimeRemaining(currentPhase, flowState.completedPhases)
    : undefined;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Journey Progress */}
      <JourneyProgress
        currentPhase={currentPhase}
        completedPhases={flowState?.completedPhases || []}
        progress={progress}
        estimatedTimeRemaining={estimatedTimeRemaining}
      />

      {/* Current Phase Content */}
      {renderPhaseContent()}

      {/* Blockers Display */}
      {flowState?.blockers && flowState.blockers.length > 0 && (
        <Card className="bg-red-500/20 border-red-400/30">
          <CardContent className="p-4">
            <h4 className="font-semibold text-red-200 mb-2">متطلبات مفقودة:</h4>
            <ul className="text-red-300 text-sm space-y-1">
              {flowState.blockers.map((blocker, index) => (
                <li key={index}>• {blocker}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
