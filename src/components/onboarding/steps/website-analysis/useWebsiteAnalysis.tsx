
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

  // Generate a proper UUID v4 format using crypto.randomUUID if available
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older browsers
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

    // Get journey ID - use proper UUID format only
    let journeyId = journey?.journey_id;
    
    // If no journey ID or it's malformed, generate a proper UUID
    if (!journeyId || journeyId.includes('journey_') || journeyId.includes('_')) {
      journeyId = generateUUID();
      console.log('🔧 Generated new UUID for journey:', journeyId);
    }

    console.log('🔍 Starting website analysis with clean UUID:', journeyId);

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
        const errorText = await response.text();
        console.error('❌ Website analysis failed:', response.status, errorText);
        
        // Handle different error types
        if (response.status === 500) {
          throw new Error('Server error - please try again in a moment');
        } else if (response.status === 400) {
          throw new Error('Invalid request - please check the website URL');
        } else {
          throw new Error(`Analysis failed (${response.status}) - please try again`);
        }
      }

      const data = await response.json();
      console.log('✅ Website analysis completed:', data);
      setAnalysisResults(data.analysis_results);
      setAnalysisState('completed');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('❌ Website analysis error:', error);
      
      // More user-friendly error messages
      let errorMessage = 'Analysis failed - please try again';
      if (error instanceof Error) {
        if (error.message.includes('Server error')) {
          errorMessage = 'Server is temporarily unavailable. Please try again in a few minutes.';
        } else if (error.message.includes('Invalid request')) {
          errorMessage = 'Please check your website URL and try again.';
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          errorMessage = 'Network connection issue. Please check your internet and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setAnalysisState('error');
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
