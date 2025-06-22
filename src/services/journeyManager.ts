
import { UserProfileService } from './userProfileService';

interface JourneyData {
  journey_id: string;
  client_id: string;
  current_phase: string;
  profile_progress: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export class JourneyManager {
  static async initializeJourney(userId: string): Promise<string | null> {
    try {
      // Create journey record using user_profiles as the main tracking table
      const journeyId = crypto.randomUUID();
      
      const success = await UserProfileService.saveUserProfile(userId, {
        journey_id: journeyId,
        current_phase: 'welcome',
        profile_progress: 0,
        is_completed: false,
        journey_started_at: new Date().toISOString()
      });

      return success ? journeyId : null;
    } catch (error) {
      console.error('Error initializing journey:', error);
      return null;
    }
  }

  static async getJourney(userId: string): Promise<JourneyData | null> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      if (!profile) return null;

      // Map user profile data to journey data structure
      return {
        journey_id: profile.id, // Use profile ID as journey ID
        client_id: userId,
        current_phase: profile.onboarding_completed ? 'completed' : 'welcome',
        profile_progress: profile.data_completeness_score || 0,
        is_completed: profile.onboarding_completed || false,
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting journey:', error);
      return null;
    }
  }

  static async updateJourneyPhase(userId: string, phase: string): Promise<boolean> {
    try {
      const success = await UserProfileService.saveUserProfile(userId, {
        current_phase: phase,
        updated_at: new Date().toISOString()
      });

      return success;
    } catch (error) {
      console.error('Error updating journey phase:', error);
      return false;
    }
  }

  static async completeJourney(userId: string): Promise<boolean> {
    try {
      const success = await UserProfileService.saveUserProfile(userId, {
        is_completed: true,
        onboarding_completed: true,
        current_phase: 'completed',
        profile_progress: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return success;
    } catch (error) {
      console.error('Error completing journey:', error);
      return false;
    }
  }

  static async getJourneyProgress(userId: string): Promise<number> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      return profile?.data_completeness_score || 0;
    } catch (error) {
      console.error('Error getting journey progress:', error);
      return 0;
    }
  }

  static async isJourneyCompleted(userId: string): Promise<boolean> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      return profile?.onboarding_completed || false;
    } catch (error) {
      console.error('Error checking journey completion:', error);
      return false;
    }
  }
}
