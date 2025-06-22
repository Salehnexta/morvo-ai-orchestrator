
import React, { useState, useEffect } from 'react';
import { useJourney } from '@/contexts/JourneyContext';
import { useUserGreeting } from '@/hooks/useUserGreeting';
import { JourneyFlowService, JourneyFlowState } from '@/services/journeyFlowService';
import { JourneyProgress } from './JourneyProgress';
import { PhaseContentRenderer } from './phase-content/PhaseContentRenderer';
import { usePhaseActions } from './phase-handlers/PhaseActionsHandler';
import { Card, CardContent } from '@/components/ui/card';

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
    progress
  } = useJourney();
  
  const { fullGreeting, displayName, loading: greetingLoading } = useUserGreeting();
  const { handlePhaseAction } = usePhaseActions();
  
  const [flowState, setFlowState] = useState<JourneyFlowState | null>(null);
  const [loading, setLoading] = useState(false);
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

  const onPhaseActionWrapper = (action: string, data?: any) => {
    handlePhaseAction(
      action, 
      data, 
      onPhaseComplete, 
      currentPhase, 
      flowState, 
      setLoading, 
      setWebsiteAnalysisData
    );
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
      <PhaseContentRenderer
        currentPhase={currentPhase}
        loading={loading}
        journey={journey}
        websiteAnalysisData={websiteAnalysisData}
        fullGreeting={fullGreeting}
        displayName={displayName}
        greetingLoading={greetingLoading}
        onPhaseAction={onPhaseActionWrapper}
      />

      {/* Debug Info */}
      <div className="bg-gray-800/80 p-3 rounded text-xs text-gray-300 border border-gray-600/50">
        <p>Current Phase: {currentPhase}</p>
        <p>Progress: {progress}%</p>
        <p>Journey: {journey ? 'Loaded' : 'Not loaded'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
      </div>

      {/* Blockers Display */}
      {flowState?.blockers && flowState.blockers.length > 0 && (
        <Card className="bg-red-600/20 border-red-400/50 shadow-xl">
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
