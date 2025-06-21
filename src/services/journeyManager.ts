
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

  static async startJourney(clientId: string): Promise<OnboardingJourney | null> {
    try {
      console.log('🚀 Starting backend journey for client:', clientId);
      
      const response = await MorvoAIService.makeRequest('/onboarding/start', {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
          language: 'ar'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to start journey: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Journey started:', data);
      
      return data.journey;
    } catch (error) {
      console.error('❌ Error starting journey:', error);
      return null;
    }
  }

  static async getJourneyStatus(journeyId: string): Promise<JourneyStatus | null> {
    try {
      const response = await MorvoAIService.makeRequest(`/onboarding/journey-status/${journeyId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get journey status: ${response.status}`);
      }

      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error('❌ Error getting journey status:', error);
      return null;
    }
  }

  static async setGreetingPreference(journeyId: string, greeting: string): Promise<boolean> {
    try {
      const response = await MorvoAIService.makeRequest('/onboarding/greeting-preference', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          greeting_preference: greeting
        })
      });

      return response.ok;
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
