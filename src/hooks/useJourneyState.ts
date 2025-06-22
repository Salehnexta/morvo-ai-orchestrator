
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService } from '@/services/userProfileService';

export interface JourneyState {
  id: string;
  user_id: string;
  client_id: string;
  journey_type: string;
  current_state: string;
  state_data: Record<string, any>;
  last_interaction_at: string;
  session_id?: string;
  device_info: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useJourneyState = () => {
  const { user } = useAuth();
  const [journeyState, setJourneyState] = useState<JourneyState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJourneyState = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Use user profile as journey state since we don't have user_journey_states table
      const userProfile = await UserProfileService.getUserProfile(user.id);

      if (userProfile) {
        // Create a journey state object from user profile
        const journeyStateFromProfile: JourneyState = {
          id: userProfile.id || user.id,
          user_id: user.id,
          client_id: userProfile.id || user.id, // Using profile id as placeholder
          journey_type: 'onboarding',
          current_state: userProfile.onboarding_completed ? 'completed' : 'welcome',
          state_data: {
            greeting_preference: userProfile.greeting_preference,
            company_name: userProfile.company_name,
            website_url: userProfile.website_url,
            onboarding_completed: userProfile.onboarding_completed,
            industry: userProfile.industry,
            marketing_experience: userProfile.marketing_experience
          },
          last_interaction_at: userProfile.updated_at || new Date().toISOString(),
          session_id: sessionStorage.getItem('session_id') || undefined,
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          },
          created_at: userProfile.created_at || new Date().toISOString(),
          updated_at: userProfile.updated_at || new Date().toISOString()
        };
        
        setJourneyState(journeyStateFromProfile);
      }
    } catch (error) {
      console.error('Error in fetchJourneyState:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateJourneyState = async (newState: string, stateData?: Record<string, any>) => {
    if (!user) return;

    try {
      // Update user profile instead of journey state table
      const updateData = {
        ...stateData,
        updated_at: new Date().toISOString()
      };

      await UserProfileService.saveUserProfile(user.id, updateData);

      // Update local state
      if (journeyState) {
        setJourneyState(prev => prev ? {
          ...prev,
          current_state: newState,
          state_data: { ...prev.state_data, ...stateData },
          last_interaction_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } : null);
      }
    } catch (error) {
      console.error('Error in updateJourneyState:', error);
    }
  };

  const getCurrentState = () => {
    return journeyState?.current_state || 'welcome';
  };

  const getStateData = () => {
    return journeyState?.state_data || {};
  };

  const isReturningUser = () => {
    const stateData = getStateData();
    return !stateData.first_visit;
  };

  useEffect(() => {
    fetchJourneyState();
  }, [user]);

  useEffect(() => {
    // Generate session ID if not exists
    if (!sessionStorage.getItem('session_id')) {
      sessionStorage.setItem('session_id', crypto.randomUUID());
    }
  }, []);

  return {
    journeyState,
    loading,
    currentState: getCurrentState(),
    stateData: getStateData(),
    isReturningUser: isReturningUser(),
    updateState: updateJourneyState,
    refetch: fetchJourneyState
  };
};
