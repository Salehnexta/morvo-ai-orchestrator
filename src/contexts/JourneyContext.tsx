
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { UserProfileService } from '@/services/userProfileService';

interface JourneyContextType {
  journey: any;
  setJourney: (journey: any) => void;
  journeyStatus: any;
  setJourneyStatus: (status: any) => void;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  loading: boolean;
  // Add missing properties that components expect
  currentPhase: string;
  progress: number;
  isOnboardingComplete: boolean;
  setGreeting: (greeting: string) => Promise<boolean>;
  analyzeWebsite: (url: string) => Promise<boolean>;
  updateJourneyPhase: (phase: string) => void;
  generateStrategy: () => Promise<any>;
  saveAnswer: (key: string, value: string) => Promise<boolean>;
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
  const [journey, setJourney] = useState<any>(null);
  const [journeyStatus, setJourneyStatus] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<string>('welcome');
  const [currentPhase, setCurrentPhase] = useState<string>('welcome');
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadJourneyData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load user profile data as the journey data source
        const userProfile = await UserProfileService.getUserProfile(user.id);
        
        if (userProfile) {
          setJourney(userProfile);
          setJourneyStatus({
            onboarding_completed: userProfile.onboarding_completed,
            current_step: userProfile.onboarding_completed ? 'completed' : 'welcome',
            completeness_score: userProfile.data_completeness_score || 0
          });
          
          if (userProfile.onboarding_completed) {
            setCurrentStep('completed');
            setCurrentPhase('completed');
            setProgress(100);
          } else {
            // Calculate progress based on completed fields
            const totalFields = 10;
            let completedFields = 0;
            if (userProfile.greeting_preference) completedFields++;
            if (userProfile.company_name) completedFields++;
            if (userProfile.industry) completedFields++;
            if (userProfile.website_url) completedFields++;
            if (userProfile.marketing_experience) completedFields++;
            
            setProgress(Math.round((completedFields / totalFields) * 100));
          }
        } else {
          // Initialize empty journey for new users
          setJourney({});
          setJourneyStatus({
            onboarding_completed: false,
            current_step: 'welcome',
            completeness_score: 0
          });
          setProgress(0);
        }
      } catch (error) {
        console.error('Error loading journey data:', error);
        // Set default values on error
        setJourney({});
        setJourneyStatus({
          onboarding_completed: false,
          current_step: 'welcome',
          completeness_score: 0
        });
        setProgress(0);
      } finally {
        setLoading(false);
      }
    };

    loadJourneyData();
  }, [user]);

  const setGreeting = async (greeting: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await UserProfileService.saveUserProfile(user.id, {
        greeting_preference: greeting
      });
      
      // Update local state
      setJourney(prev => ({ ...prev, greeting_preference: greeting }));
      return true;
    } catch (error) {
      console.error('Error saving greeting:', error);
      return false;
    }
  };

  const analyzeWebsite = async (url: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await UserProfileService.saveUserProfile(user.id, {
        website_url: url
      });
      
      // Update local state
      setJourney(prev => ({ ...prev, website_url: url }));
      return true;
    } catch (error) {
      console.error('Error saving website:', error);
      return false;
    }
  };

  const saveAnswer = async (key: string, value: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await UserProfileService.saveUserProfile(user.id, {
        [key]: value
      });
      
      // Update local state
      setJourney(prev => ({ ...prev, [key]: value }));
      return true;
    } catch (error) {
      console.error('Error saving answer:', error);
      return false;
    }
  };

  const updateJourneyPhase = (phase: string) => {
    setCurrentPhase(phase);
    setCurrentStep(phase);
  };

  const generateStrategy = async (): Promise<any> => {
    if (!user) return null;
    
    try {
      // Mark onboarding as completed
      await UserProfileService.saveUserProfile(user.id, {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });
      
      setProgress(100);
      setCurrentPhase('completed');
      
      return { success: true, message: 'Strategy generated successfully' };
    } catch (error) {
      console.error('Error generating strategy:', error);
      return null;
    }
  };

  const isOnboardingComplete = journeyStatus?.onboarding_completed || false;

  const value = {
    journey,
    setJourney,
    journeyStatus,
    setJourneyStatus,
    currentStep,
    setCurrentStep,
    loading,
    currentPhase,
    progress,
    isOnboardingComplete,
    setGreeting,
    analyzeWebsite,
    updateJourneyPhase,
    generateStrategy,
    saveAnswer
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};
