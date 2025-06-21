import { supabase } from "@/integrations/supabase/client";
import { MorvoAIService } from "./morvoAIService";

export interface JourneyStatus {
  journey_id: string;
  current_phase: string;
  completed: boolean;
  profile_progress: number;
  needs_onboarding: boolean;
  greeting_preference?: string;
  website_url?: string;
  analysis_results?: any;
  strategy_generated?: boolean;
}

export interface OnboardingJourney {
  journey_id: string;
  client_id: string;
  current_phase: string;
  profile_progress: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export class JourneyManager {
  private static readonly PHASES = [
    'welcome',
    'greeting_preference', 
    'website_analysis',
    'analysis_review',
    'profile_completion',
    'professional_analysis',
    'strategy_generation',
    'commitment_activation'
  ];

  static async checkExistingJourney(clientId: string): Promise<OnboardingJourney | null> {
    try {
      console.log('🔍 Checking existing journey for client:', clientId);
      
      // First check local database
      const { data: localJourney } = await supabase
        .from('onboarding_journeys')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (localJourney) {
        console.log('✅ Found existing local journey:', localJourney);
        return {
          journey_id: localJourney.journey_id,
          client_id: localJourney.client_id,
          current_phase: localJourney.current_phase,
          profile_progress: localJourney.profile_progress || 0,
          is_completed: localJourney.is_completed || false,
          created_at: localJourney.created_at,
          updated_at: localJourney.updated_at
        };
      }

      // Check if user already has a completed profile
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', clientId)
        .single();

      if (profile?.profile_data && Object.keys(profile.profile_data).length > 3) {
        console.log('✅ User has completed profile, marking journey as complete');
        return {
          journey_id: `journey_${clientId}`,
          client_id: clientId,
          current_phase: 'commitment_activation',
          profile_progress: 100,
          is_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error checking existing journey:', error);
      return null;
    }
  }

  static async startJourney(clientId: string): Promise<OnboardingJourney | null> {
    try {
      // Check if journey already exists
      const existingJourney = await this.checkExistingJourney(clientId);
      if (existingJourney) {
        console.log('✅ Using existing journey:', existingJourney);
        return existingJourney;
      }

      console.log('🚀 Starting new journey for client:', clientId);
      
      // Try backend first with proper payload structure
      try {
        const response = await MorvoAIService.makeRequest('/onboarding/start-journey', {
          method: 'POST',
          body: JSON.stringify({
            client_id: clientId,
            language: 'ar',
            platform: 'web'
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Backend journey started:', data);
          
          // Save to local database
          await this.saveJourneyLocally(data.journey);
          return data.journey;
        }
      } catch (backendError) {
        console.warn('⚠️ Backend journey creation failed, creating locally:', backendError);
      }

      // Fallback: Create journey locally
      const localJourney: OnboardingJourney = {
        journey_id: `journey_${clientId}_${Date.now()}`,
        client_id: clientId,
        current_phase: 'welcome',
        profile_progress: 0,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await this.saveJourneyLocally(localJourney);
      console.log('✅ Local journey created:', localJourney);
      return localJourney;
    } catch (error) {
      console.error('❌ Error starting journey:', error);
      return null;
    }
  }

  static async saveJourneyLocally(journey: OnboardingJourney): Promise<void> {
    try {
      const { error } = await supabase
        .from('onboarding_journeys')
        .upsert({
          journey_id: journey.journey_id,
          client_id: journey.client_id,
          current_phase: journey.current_phase,
          profile_progress: journey.profile_progress,
          is_completed: journey.is_completed,
          created_at: journey.created_at,
          updated_at: journey.updated_at
        });

      if (error) {
        console.error('❌ Error saving journey locally:', error);
      } else {
        console.log('✅ Journey saved locally');
      }
    } catch (error) {
      console.error('❌ Error in saveJourneyLocally:', error);
    }
  }

  static async getJourneyStatus(journeyId: string): Promise<JourneyStatus | null> {
    try {
      // Try backend first
      try {
        const response = await MorvoAIService.makeRequest(`/onboarding/journey-status/${journeyId}`);
        
        if (response.ok) {
          const data = await response.json();
          return data.status;
        }
      } catch (backendError) {
        console.warn('⚠️ Backend status fetch failed, using local data:', backendError);
      }

      // Fallback to local database
      const { data: localJourney } = await supabase
        .from('onboarding_journeys')
        .select('*')
        .eq('journey_id', journeyId)
        .single();

      if (localJourney) {
        return {
          journey_id: localJourney.journey_id,
          current_phase: localJourney.current_phase,
          completed: localJourney.is_completed || false,
          profile_progress: localJourney.profile_progress || 0,
          needs_onboarding: !localJourney.is_completed
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting journey status:', error);
      return null;
    }
  }

  static async setGreetingPreference(journeyId: string, greeting: string): Promise<boolean> {
    try {
      // Try backend first
      try {
        const response = await MorvoAIService.makeRequest('/onboarding/set-greeting', {
          method: 'POST',
          body: JSON.stringify({
            journey_id: journeyId,
            greeting_preference: greeting
          })
        });

        if (response.ok) {
          console.log('✅ Greeting preference set on backend');
        }
      } catch (backendError) {
        console.warn('⚠️ Backend greeting update failed:', backendError);
      }

      // Always save locally
      const { error } = await supabase
        .from('customer_profiles')
        .update({
          profile_data: { greeting_preference: greeting },
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', journeyId.replace('journey_', '').split('_')[0]);

      // Update journey phase
      await supabase
        .from('onboarding_journeys')
        .update({
          current_phase: 'website_analysis',
          profile_progress: 25,
          updated_at: new Date().toISOString()
        })
        .eq('journey_id', journeyId);

      return !error;
    } catch (error) {
      console.error('❌ Error setting greeting preference:', error);
      return false;
    }
  }

  static async startWebsiteAnalysis(journeyId: string, websiteUrl: string): Promise<boolean> {
    try {
      console.log('🔍 Starting website analysis for:', websiteUrl);
      
      const response = await MorvoAIService.makeRequest('/onboarding/website-analysis', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          website_url: websiteUrl
        })
      });

      const result = response.ok;
      console.log('✅ Website analysis started:', result);
      return result;
    } catch (error) {
      console.error('❌ Error starting website analysis:', error);
      return false;
    }
  }

  static async getAnalysisResults(journeyId: string): Promise<any> {
    try {
      const response = await MorvoAIService.makeRequest(`/onboarding/analysis-results/${journeyId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get analysis results: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error getting analysis results:', error);
      return null;
    }
  }

  static async saveProfileAnswer(journeyId: string, questionId: string, answer: string): Promise<boolean> {
    try {
      const response = await MorvoAIService.makeRequest('/onboarding/profile-answer', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          question_id: questionId,
          answer: answer
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error saving profile answer:', error);
      return false;
    }
  }

  static async generateStrategy(journeyId: string): Promise<any> {
    try {
      console.log('🎯 Generating strategy for journey:', journeyId);
      
      const response = await MorvoAIService.makeRequest(`/onboarding/generate-strategy/${journeyId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Failed to generate strategy: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Strategy generated:', data);
      return data;
    } catch (error) {
      console.error('❌ Error generating strategy:', error);
      return null;
    }
  }

  static async activateCommitment(journeyId: string): Promise<boolean> {
    try {
      const response = await MorvoAIService.makeRequest(`/onboarding/activate-commitment/${journeyId}`, {
        method: 'POST'
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error activating commitment:', error);
      return false;
    }
  }

  static getPhaseIndex(phase: string): number {
    return this.PHASES.indexOf(phase);
  }

  static getNextPhase(currentPhase: string): string | null {
    const currentIndex = this.getPhaseIndex(currentPhase);
    if (currentIndex === -1 || currentIndex === this.PHASES.length - 1) {
      return null;
    }
    return this.PHASES[currentIndex + 1];
  }

  static calculateProgress(phase: string): number {
    const phaseIndex = this.getPhaseIndex(phase);
    if (phaseIndex === -1) return 0;
    return Math.round(((phaseIndex + 1) / this.PHASES.length) * 100);
  }
}
