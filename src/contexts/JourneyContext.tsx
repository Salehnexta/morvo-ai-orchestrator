
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
  currentPhase: string;
  progress: number;
  isOnboardingComplete: boolean;
  greetingPreference: string;
  setGreeting: (greeting: string) => Promise<boolean>;
  analyzeWebsite: (url: string) => Promise<boolean>;
  updateJourneyPhase: (phase: string) => void;
  generateStrategy: () => Promise<any>;
  saveAnswer: (key: string, value: string) => Promise<boolean>;
  startJourney: () => void;
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
  const [greetingPreference, setGreetingPreference] = useState<string>('أستاذ');
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
          setGreetingPreference(userProfile.greeting_preference || 'أستاذ');
          
          // Set current phase from profile or default to welcome
          const savedPhase = userProfile.current_phase || 'welcome';
          setCurrentPhase(savedPhase);
          setCurrentStep(savedPhase);
          
          setJourneyStatus({
            onboarding_completed: userProfile.onboarding_completed,
            current_step: savedPhase,
            completeness_score: userProfile.data_completeness_score || 0
          });
          
          if (userProfile.onboarding_completed) {
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
          setCurrentPhase('welcome');
          setCurrentStep('welcome');
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
        setCurrentPhase('welcome');
        setCurrentStep('welcome');
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
      setGreetingPreference(greeting);
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

  const updateJourneyPhase = async (phase: string) => {
    if (!user) return;
    
    try {
      // Save phase to database immediately
      await UserProfileService.saveUserProfile(user.id, {
        current_phase: phase,
        updated_at: new Date().toISOString()
      });
      
      console.log('✅ Phase saved to database:', phase);
      
      // Update local state
      setCurrentPhase(phase);
      setCurrentStep(phase);
      setJourney(prev => ({ ...prev, current_phase: phase }));
    } catch (error) {
      console.error('Error updating journey phase:', error);
    }
  };

  const generateStrategy = async (): Promise<any> => {
    if (!user) return null;
    
    try {
      // Mark onboarding as completed
      await UserProfileService.saveUserProfile(user.id, {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        current_phase: 'completed'
      });
      
      setProgress(100);
      setCurrentPhase('completed');
      
      return { success: true, message: 'Strategy generated successfully' };
    } catch (error) {
      console.error('Error generating strategy:', error);
      return null;
    }
  };

  const startJourney = () => {
    setCurrentStep('welcome');
    setCurrentPhase('welcome');
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
    greetingPreference,
    setGreeting,
    analyzeWebsite,
    updateJourneyPhase,
    generateStrategy,
    saveAnswer,
    startJourney
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};
