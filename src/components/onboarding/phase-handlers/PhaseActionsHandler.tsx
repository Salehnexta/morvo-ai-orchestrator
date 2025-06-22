
import { useJourney } from '@/contexts/JourneyContext';
import { JourneyFlowService } from '@/services/journeyFlowService';

export const usePhaseActions = () => {
  const { 
    journey, 
    setGreeting, 
    updateJourneyPhase,
    generateStrategy,
    saveAnswer
  } = useJourney();

  const handlePhaseAction = async (
    action: string, 
    data?: any,
    onPhaseComplete?: (phase: string) => void,
    currentPhase?: string,
    flowState?: any,
    setLoading?: (loading: boolean) => void,
    setWebsiteAnalysisData?: (data: any) => void
  ) => {
    if (!journey) {
      console.log('No journey found, initializing...');
      return;
    }

    console.log('🎯 Phase action:', action, 'current phase:', currentPhase);
    
    if (setLoading) setLoading(true);
    
    try {
      let success = false;
      let nextPhase = '';

      switch (action) {
        case 'set_greeting':
          success = await setGreeting(data.greeting);
          if (success) {
            nextPhase = 'website_analysis';
          }
          break;

        case 'website_analysis_complete':
          if (setWebsiteAnalysisData) setWebsiteAnalysisData(data);
          nextPhase = 'analysis_review';
          success = true;
          break;

        case 'skip_website_analysis':
          nextPhase = 'profile_completion';
          success = true;
          break;

        case 'analysis_review_complete':
          nextPhase = 'profile_completion';
          success = true;
          break;

        case 'profile_completion_complete':
          // Save all profile data
          const profileKeys = [
            'company_name', 'industry', 'company_size', 'company_overview',
            'core_offerings', 'technical_products', 'business_focus', 'product_descriptions',
            'contact_email', 'contact_phone', 'contact_address', 'team_members', 'social_media'
          ];
          
          for (const key of profileKeys) {
            if (data[key] !== undefined) {
              await saveAnswer(key, data[key]);
            }
          }
          
          nextPhase = 'professional_analysis';
          success = true;
          break;

        case 'professional_analysis_complete':
          nextPhase = 'strategy_generation';
          success = true;
          break;

        case 'generate_strategy':
          const strategy = await generateStrategy();
          if (strategy) {
            success = true;
            if (onPhaseComplete) {
              onPhaseComplete('strategy_generation');
            }
          }
          break;

        case 'complete_phase':
          if (currentPhase === 'welcome') {
            nextPhase = 'greeting_preference';
            console.log('✅ Moving from welcome to greeting_preference');
          } else {
            const nextPhaseFromFlow = flowState?.nextPhase;
            if (nextPhaseFromFlow) {
              nextPhase = nextPhaseFromFlow;
            }
          }
          success = true;
          break;
      }

      if (success && nextPhase) {
        updateJourneyPhase(nextPhase);
        console.log('✅ Phase transition successful:', currentPhase, '->', nextPhase);
        
        if (onPhaseComplete && action !== 'generate_strategy') {
          onPhaseComplete(currentPhase || '');
        }
      }
    } catch (error) {
      console.error('❌ Phase action failed:', error);
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return { handlePhaseAction };
};
