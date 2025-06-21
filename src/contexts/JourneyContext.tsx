import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { JourneyManager, JourneyStatus, OnboardingJourney } from '@/services/journeyManager';
import { supabase } from '@/integrations/supabase/client';

interface JourneyContextType {
  journey: OnboardingJourney | null;
  journeyStatus: JourneyStatus | null;
  loading: boolean;
  error: string | null;
  startJourney: (websiteUrl?: string) => Promise<void>;
  updateJourneyPhase: (phase: string) => void;
  setGreeting: (greeting: string) => Promise<boolean>;
  analyzeWebsite: (url: string) => Promise<boolean>;
  saveAnswer: (questionId: string, answer: string) => Promise<boolean>;
  generateStrategy: () => Promise<any>;
  activateCommitment: () => Promise<boolean>;
  isOnboardingComplete: boolean;
  currentPhase: string;
  progress: number;
  hasExistingJourney: boolean;
  greetingPreference: string | null;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};

interface JourneyProviderProps {
  children: ReactNode;
}

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [journey, setJourney] = useState<OnboardingJourney | null>(null);
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingJourney, setHasExistingJourney] = useState(false);
  const [journeyInitialized, setJourneyInitialized] = useState(false);
  const [greetingPreference, setGreetingPreference] = useState<string | null>(null);

  // Load existing journey on mount - prevent multiple initializations
  useEffect(() => {
    const loadJourney = async () => {
      // Prevent multiple initializations for the same user
      if (!user?.id || journeyInitialized) {
        if (!user?.id) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Loading journey for user:', user.id);

        // Load greeting preference first (faster than journey check)
        await loadGreetingPreference(user.id);

        // Try to check for existing journey (may fail, that's OK)
        try {
          const existingJourney = await JourneyManager.checkExistingJourney(user.id);
          
          if (existingJourney) {
            setJourney(existingJourney);
            setHasExistingJourney(true);
            
            // Get journey status if available
            try {
              const status = await JourneyManager.getJourneyStatus(existingJourney.journey_id);
              setJourneyStatus(status);
            } catch (statusError) {
              console.warn('⚠️ Could not load journey status:', statusError);
            }
            
            // Store journey ID locally for quick access
            localStorage.setItem(`journey_${user.id}`, existingJourney.journey_id);
            
            console.log('✅ Loaded existing journey:', existingJourney);
          } else {
            console.log('ℹ️ No existing journey found for user');
            setHasExistingJourney(false);
          }
        } catch (journeyError) {
          console.warn('⚠️ Could not check existing journey:', journeyError);
          setHasExistingJourney(false);
        }

        setJourneyInitialized(true);
      } catch (err) {
        console.error('❌ Error loading journey:', err);
        setError('Failed to load journey');
        setHasExistingJourney(false);
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [user?.id, journeyInitialized]);

  const loadGreetingPreference = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('profile_data')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profile?.profile_data) {
        if (typeof profile.profile_data === 'object' && profile.profile_data !== null && !Array.isArray(profile.profile_data)) {
          const profileData = profile.profile_data as Record<string, any>;
          if ('greeting_preference' in profileData && typeof profileData.greeting_preference === 'string') {
            setGreetingPreference(profileData.greeting_preference);
            console.log('✅ Loaded greeting preference:', profileData.greeting_preference);
          } else {
            console.log('ℹ️ No greeting preference found in profile data');
            setGreetingPreference(null);
          }
        } else {
          console.log('ℹ️ Profile data is not an object');
          setGreetingPreference(null);
        }
      } else {
        console.log('ℹ️ No profile data found');
        setGreetingPreference(null);
      }
    } catch (error) {
      console.error('❌ Error loading greeting preference:', error);
      setGreetingPreference(null);
    }
  };

  const startJourney = async (websiteUrl?: string) => {
    if (!user?.id) {
      console.log('ℹ️ No user found for journey start');
      return;
    }

    // Prevent multiple journey starts
    if (hasExistingJourney && journey && !journey.is_completed) {
      console.log('ℹ️ Skipping journey start - active journey exists');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Starting new journey for user:', user.id, 'with website:', websiteUrl);
      const newJourney = await JourneyManager.startJourney(user.id, websiteUrl);
      
      if (newJourney) {
        setJourney(newJourney);
        setHasExistingJourney(true);
        
        // Store journey ID locally
        localStorage.setItem(`journey_${user.id}`, newJourney.journey_id);
        
        // Get initial status
        try {
          const status = await JourneyManager.getJourneyStatus(newJourney.journey_id);
          setJourneyStatus(status);
        } catch (statusError) {
          console.warn('⚠️ Could not load initial journey status:', statusError);
        }
        
        console.log('✅ Journey started successfully:', newJourney);
      } else {
        setError('Failed to start journey');
      }
    } catch (err) {
      console.error('❌ Error starting journey:', err);
      setError('Failed to start journey');
    } finally {
      setLoading(false);
    }
  };

  const updateJourneyPhase = (phase: string) => {
    console.log('🔄 Updating journey phase to:', phase);
    if (journey) {
      const updatedJourney = { ...journey, current_phase: phase };
      setJourney(updatedJourney);
    }
    if (journeyStatus) {
      const updatedStatus = { ...journeyStatus, current_phase: phase };
      setJourneyStatus(updatedStatus);
    }
  };

  const setGreeting = async (greeting: string): Promise<boolean> => {
    if (!journey) {
      console.warn('⚠️ No journey found, cannot save greeting');
      return false;
    }
    
    console.log('💾 Saving greeting preference:', greeting);
    const success = await JourneyManager.setGreetingPreference(journey.journey_id, greeting);
    if (success) {
      setGreetingPreference(greeting);
      setJourneyStatus(prev => prev ? { 
        ...prev, 
        greeting_preference: greeting 
      } : null);
      console.log('✅ Greeting preference saved successfully');
      return true;
    } else {
      console.error('❌ Failed to save greeting preference');
      return false;
    }
  };

  const analyzeWebsite = async (url: string): Promise<boolean> => {
    if (!journey) return false;
    
    console.log('🔍 Analyzing website:', url);
    try {
      const success = await JourneyManager.startWebsiteAnalysis(journey.journey_id, url);
      if (success) {
        setJourneyStatus(prev => prev ? { ...prev, website_url: url } : null);
        console.log('✅ Website analysis started successfully');
      }
      return success;
    } catch (error) {
      console.error('❌ Website analysis failed:', error);
      return false;
    }
  };

  const saveAnswer = async (questionId: string, answer: string): Promise<boolean> => {
    if (!journey) return false;
    
    console.log('💾 Saving answer:', questionId, answer);
    try {
      console.log('✅ Answer saved successfully (placeholder)');
      return true;
    } catch (error) {
      console.error('❌ Save answer failed:', error);
      return false;
    }
  };

  const generateStrategy = async (): Promise<any> => {
    if (!journey) return null;
    
    console.log('🎯 Generating strategy');
    try {
      const strategy = { generated: true };
      if (strategy) {
        setJourneyStatus(prev => prev ? { ...prev, strategy_generated: true } : null);
        console.log('✅ Strategy generated successfully (placeholder)');
      }
      return strategy;
    } catch (error) {
      console.error('❌ Strategy generation failed:', error);
      return null;
    }
  };

  const activateCommitment = async (): Promise<boolean> => {
    if (!journey) return false;
    
    console.log('🎯 Activating commitment');
    try {
      const success = true;
      if (success) {
        setJourney(prev => prev ? { ...prev, is_completed: true } : null);
        setJourneyStatus(prev => prev ? { ...prev, completed: true } : null);
        console.log('✅ Commitment activated successfully (placeholder)');
      }
      return success;
    } catch (error) {
      console.error('❌ Commitment activation failed:', error);
      return false;
    }
  };

  const isOnboardingComplete = journeyStatus?.completed || journey?.is_completed || false;
  const currentPhase = journeyStatus?.current_phase || journey?.current_phase || (greetingPreference ? 'website_analysis' : 'greeting_preference');
  const progress = journeyStatus?.profile_progress || JourneyManager.calculateProgress(currentPhase);

  return (
    <JourneyContext.Provider value={{
      journey,
      journeyStatus,
      loading,
      error,
      startJourney,
      updateJourneyPhase,
      setGreeting,
      analyzeWebsite,
      saveAnswer,
      generateStrategy,
      activateCommitment,
      isOnboardingComplete,
      currentPhase,
      progress,
      hasExistingJourney,
      greetingPreference
    }}>
      {children}
    </JourneyContext.Provider>
  );
};
