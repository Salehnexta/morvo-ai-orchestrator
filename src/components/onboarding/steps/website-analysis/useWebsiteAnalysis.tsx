
import { useState } from 'react';
import { MorvoAIService } from '@/services/morvoAIService';
import { useJourney } from '@/contexts/JourneyContext';

type AnalysisState = 'input' | 'analyzing' | 'completed' | 'error';

export const useWebsiteAnalysis = () => {
  const { journey } = useJourney();
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

  const startAnalysis = async (invalidUrlMessage: string) => {
    if (!websiteUrl.trim()) {
      setError(invalidUrlMessage);
      return;
    }

    if (!isValidUrl(websiteUrl)) {
      setError(invalidUrlMessage);
      return;
    }

    // Get journey ID from context or generate one if not available
    const journeyId = journey?.journey_id || `journey_${Date.now()}`;

    setError('');
    setAnalysisState('analyzing');
    setAnalysisProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 2000);

    try {
      const response = await MorvoAIService.makeRequest('/onboarding/website-analysis', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          website_url: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
        })
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResults(data.analysis_results);
      setAnalysisState('completed');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Website analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      setAnalysisState('error');
    }
  };

  const resetToInput = () => {
    setAnalysisState('input');
    setError('');
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
