
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
      const { data, error } = await supabase
        .from('user_journey_states')
        .select('*')
        .eq('user_id', user.id)
        .eq('journey_type', 'onboarding')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching journey state:', error);
        return;
      }

      if (data) {
        // Type conversion for JSONB fields
        const typedData: JourneyState = {
          ...data,
          state_data: (data.state_data as any) || {},
          device_info: (data.device_info as any) || {},
        };
        setJourneyState(typedData);
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
      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) return;

      const updateData = {
        current_state: newState,
        state_data: stateData || {},
        last_interaction_at: new Date().toISOString(),
        session_id: sessionStorage.getItem('session_id') || crypto.randomUUID(),
        device_info: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      };

      if (journeyState) {
        // Update existing state
        const { data, error } = await supabase
          .from('user_journey_states')
          .update(updateData)
          .eq('id', journeyState.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating journey state:', error);
          return;
        }

        if (data) {
          const typedData: JourneyState = {
            ...data,
            state_data: (data.state_data as any) || {},
            device_info: (data.device_info as any) || {},
          };
          setJourneyState(typedData);
        }
      } else {
        // Create new state
        const { data, error } = await supabase
          .from('user_journey_states')
          .insert([{
            user_id: user.id,
            client_id: clientData.id,
            journey_type: 'onboarding',
            ...updateData
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating journey state:', error);
          return;
        }

        if (data) {
          const typedData: JourneyState = {
            ...data,
            state_data: (data.state_data as any) || {},
            device_info: (data.device_info as any) || {},
          };
          setJourneyState(typedData);
        }
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
