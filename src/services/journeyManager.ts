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
      
      // First check backend for journey status
      try {
        const backendJourney = await MorvoAIService.checkJourneyStatus(clientId);
        if (backendJourney && backendJourney.status !== 'completed') {
          console.log('✅ Found active backend journey:', backendJourney);
          
          // Save/update local record
          await this.saveJourneyLocally({
            journey_id: backendJourney.journey_id,
            client_id: clientId,
            current_phase: backendJourney.current_phase || 'welcome',
            profile_progress: backendJourney.completion_percentage || 0,
            is_completed: backendJourney.status === 'completed',
            created_at: backendJourney.created_at || new Date().toISOString(),
            updated_at: backendJourney.updated_at || new Date().toISOString()
          });
          
          return {
            journey_id: backendJourney.journey_id,
            client_id: clientId,
            current_phase: backendJourney.current_phase || 'welcome',
            profile_progress: backendJourney.completion_percentage || 0,
            is_completed: backendJourney.status === 'completed',
            created_at: backendJourney.created_at || new Date().toISOString(),
            updated_at: backendJourney.updated_at || new Date().toISOString()
          };
        }
      } catch (backendError) {
        console.warn('⚠️ Backend journey check failed, checking local:', backendError);
      }
      
      // Fallback to local database
      const { data: localJourney } = await supabase
        .from('onboarding_journeys')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

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

      // Check if user already has a completed profile (legacy users)
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', clientId)
        .maybeSingle();

      if (profile?.profile_data && typeof profile.profile_data === 'object' && Object.keys(profile.profile_data).length > 3) {
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

  static async startJourney(clientId: string, websiteUrl?: string): Promise<OnboardingJourney | null> {
    try {
      // Check if journey already exists
      const existingJourney = await this.checkExistingJourney(clientId);
      if (existingJourney && !existingJourney.is_completed) {
        console.log('✅ Using existing journey:', existingJourney);
        return existingJourney;
      }

      console.log('🚀 Starting new journey for client:', clientId);
      
      // Try backend first if website URL is provided
      if (websiteUrl) {
        try {
          const backendJourney = await MorvoAIService.startJourneyWithWebsite(websiteUrl);
          
          if (backendJourney) {
            console.log('✅ Backend journey started:', backendJourney);
            
            const journey = {
              journey_id: backendJourney.journey_id,
              client_id: clientId,
              current_phase: backendJourney.current_phase || 'website_analysis',
              profile_progress: backendJourney.completion_percentage || 25,
              is_completed: false,
              created_at: backendJourney.created_at || new Date().toISOString(),
              updated_at: backendJourney.updated_at || new Date().toISOString()
            };
            
            // Save to local database
            await this.saveJourneyLocally(journey);
            return journey;
          }
        } catch (backendError) {
          console.warn('⚠️ Backend journey creation failed, creating locally:', backendError);
        }
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
      // Extract client ID from journey ID for backend lookup
      const clientId = journeyId.includes('_') ? journeyId.split('_')[1] : journeyId;
      
      // Try backend first
      try {
        const backendStatus = await MorvoAIService.checkJourneyStatus(clientId);
        if (backendStatus) {
          return {
            journey_id: backendStatus.journey_id,
            current_phase: backendStatus.current_phase,
            completed: backendStatus.status === 'completed',
            profile_progress: backendStatus.completion_percentage || 0,
            needs_onboarding: backendStatus.status !== 'completed',
            greeting_preference: backendStatus.data?.greeting_preference,
            website_url: backendStatus.data?.website_url
          };
        }
      } catch (backendError) {
        console.warn('⚠️ Backend status fetch failed, using local data:', backendError);
      }

      // Fallback to local database
      const { data: localJourney } = await supabase
        .from('onboarding_journeys')
        .select('*')
        .eq('journey_id', journeyId)
        .maybeSingle();

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
      console.log('🔄 Setting greeting preference:', greeting, 'for journey:', journeyId);
      
      // Try backend first
      try {
        const success = await MorvoAIService.setGreetingPreference(journeyId, greeting);
        if (success) {
          console.log('✅ Greeting preference set on backend');
        }
      } catch (backendError) {
        console.warn('⚠️ Backend greeting update failed:', backendError);
      }

      // Extract client ID from journey ID
      const clientId = journeyId.includes('_') ? journeyId.split('_')[1] : journeyId;
      
      // Always save locally - first check if profile exists
      const { data: existingProfile } = await supabase
        .from('customer_profiles')
        .select('profile_data')
        .eq('customer_id', clientId)
        .maybeSingle();

      // Fix the spread operator issue by ensuring we have a proper object
      const existingData = (existingProfile?.profile_data && typeof existingProfile.profile_data === 'object') 
        ? existingProfile.profile_data as Record<string, any>
        : {};
      
      const { error: profileError } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: clientId,
          profile_data: { 
            ...existingData,
            greeting_preference: greeting 
          },
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('❌ Error saving greeting to profile:', profileError);
      }

      // Update journey phase
      const { error: journeyError } = await supabase
        .from('onboarding_journeys')
        .update({
          current_phase: 'website_analysis',
          profile_progress: 25,
          updated_at: new Date().toISOString()
        })
        .eq('journey_id', journeyId);

      if (journeyError) {
        console.error('❌ Error updating journey phase:', journeyError);
      }

      console.log('✅ Greeting preference saved locally');
      return !profileError;
    } catch (error) {
      console.error('❌ Error setting greeting preference:', error);
      return false;
    }
  }

  static async startWebsiteAnalysis(journeyId: string, websiteUrl: string): Promise<boolean> {
    try {
      console.log('🔍 Starting website analysis for:', websiteUrl);
      
      const success = await MorvoAIService.startWebsiteAnalysis(journeyId, websiteUrl);
      console.log('✅ Website analysis started:', success);
      return success;
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
