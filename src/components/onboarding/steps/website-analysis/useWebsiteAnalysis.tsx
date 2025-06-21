
import { useState } from 'react';
import { MorvoAIService } from '@/services/morvoAIService';
import { useJourney } from '@/contexts/JourneyContext';
import { useToast } from '@/hooks/use-toast';

type AnalysisState = 'input' | 'analyzing' | 'completed' | 'error';

export const useWebsiteAnalysis = () => {
  const { journey } = useJourney();
  const { toast } = useToast();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('input');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const startAnalysis = async (invalidUrlMessage: string) => {
    if (!websiteUrl.trim()) {
      setError(invalidUrlMessage);
      return;
    }

    if (!isValidUrl(websiteUrl)) {
      setError(invalidUrlMessage);
      return;
    }

    let journeyId = journey?.journey_id;
    
    if (!journeyId || journeyId.includes('journey_') || journeyId.includes('_')) {
      journeyId = generateUUID();
      console.log('🔧 Generated new UUID for journey:', journeyId);
    }

    console.log('🔍 Starting website analysis with journey ID:', journeyId);

    setError('');
    setAnalysisState('analyzing');
    setAnalysisProgress(0);

    // Simulate progress while waiting for analysis
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 1000);

    try {
      const response = await MorvoAIService.makeRequest('/onboarding/website-analysis', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          website_url: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
        })
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Website analysis failed:', response.status, errorText);
        setAnalysisState('error');
        setError(`Analysis failed: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Website analysis completed:', data);
      
      setAnalysisProgress(100);
      setAnalysisResults(data.analysis_results);
      setAnalysisState('completed');
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('❌ Website analysis error:', error);
      setAnalysisState('error');
      setError(error instanceof Error ? error.message : 'Analysis failed');
    }
  };

  const resetToInput = () => {
    setAnalysisState('input');
    setError('');
    setAnalysisProgress(0);
  };

  return {
    websiteUrl,
    setWebsiteUrl,
    analysisState,
    analysisProgress,
    error,
    analysisResults,
    startAnalysis,
    resetToInput
  };
};
