
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
          }
        } else {
          // Initialize empty journey for new users
          setJourney({});
          setJourneyStatus({
            onboarding_completed: false,
            current_step: 'welcome',
            completeness_score: 0
          });
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
      } finally {
        setLoading(false);
      }
    };

    loadJourneyData();
  }, [user]);

  const value = {
    journey,
    setJourney,
    journeyStatus,
    setJourneyStatus,
    currentStep,
    setCurrentStep,
    loading
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};
