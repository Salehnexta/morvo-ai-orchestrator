import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id?: string;
  user_id: string;
  full_name?: string;
  company_name?: string;
  industry?: string;
  website_url?: string;
  business_type?: string;
  company_size?: string;
  target_market?: string;
  products_services?: any;
  contact_info?: any;
  marketing_experience?: string;
  primary_marketing_goals?: string[];
  target_audience?: any;
  monthly_marketing_budget?: string;
  current_monthly_revenue?: string;
  revenue_target?: string;
  average_order_value?: number;
  customer_acquisition_cost?: number;
  biggest_marketing_challenge?: string;
  unique_selling_points?: string[];
  main_competitors?: string[];
  competitor_analysis?: any;
  business_model?: string;
  service_areas?: string[];
  branch_locations?: string[];
  expansion_plans?: string[];
  seasonal_peaks?: string[];
  key_team_members?: any;
  recent_news?: string[];
  case_studies?: string[];
  company_overview?: string;
  seo_data?: any;
  last_seo_update?: string;
  preferred_language?: string;
  greeting_preference?: string;
  data_completeness_score?: number;
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
  created_at?: string;
  updated_at?: string;
  
  // Journey-related fields
  journey_id?: string;
  current_phase?: string;
  profile_progress?: number;
  is_completed?: boolean;
  journey_started_at?: string;
  completed_at?: string;
  phase_welcome_completed?: boolean;
  phase_greeting_preference_completed?: boolean;
  phase_website_analysis_completed?: boolean;
  phase_analysis_review_completed?: boolean;
  phase_profile_completion_completed?: boolean;
  phase_professional_analysis_completed?: boolean;
  phase_strategy_generation_completed?: boolean;
  phase_commitment_activation_completed?: boolean;
  website_analysis_complete?: boolean;
  strategy_generated?: boolean;
  commitment_confirmed?: boolean;
}

export class UserProfileService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  static async saveUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const now = new Date().toISOString();
      const dataToSave = {
        ...profileData,
        updated_at: now
      };

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update(dataToSave)
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating user profile:', error);
          return false;
        }
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            created_at: now,
            ...dataToSave
          });

        if (error) {
          console.error('Error creating user profile:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in saveUserProfile:', error);
      return false;
    }
  }

  static async calculateCompleteness(profile: UserProfile): Promise<number> {
    const requiredFields = [
      'greeting_preference',
      'company_name', 
      'industry', 
      'company_size',
      'company_overview',
      'core_offerings',
      'contact_email',
      'contact_phone'
    ];

    const optionalFields = [
      'website_url',
      'technical_products',
      'business_focus',
      'product_descriptions',
      'team_members'
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    // Check required fields
    requiredFields.forEach(field => {
      const value = profile[field as keyof UserProfile];
      if (value !== null && value !== undefined && value !== '') {
        if (field === 'team_members' && Array.isArray(value)) {
          if (value.length > 0 && value.some(member => member && member.trim())) {
            completedRequired++;
          }
        } else {
          completedRequired++;
        }
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      const value = profile[field as keyof UserProfile];
      if (value !== null && value !== undefined && value !== '') {
        if (field === 'team_members' && Array.isArray(value)) {
          if (value.length > 0 && value.some(member => member && member.trim())) {
            completedOptional++;
          }
        } else {
          completedOptional++;
        }
      }
    });

    // Calculate weighted score (required fields worth more)
    const requiredWeight = 0.7;
    const optionalWeight = 0.3;
    
    const requiredScore = (completedRequired / requiredFields.length) * requiredWeight;
    const optionalScore = (completedOptional / optionalFields.length) * optionalWeight;
    
    return Math.round((requiredScore + optionalScore) * 100);
  }

  static async updateCompleteness(userId: string): Promise<void> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) return;

      const completeness = await this.calculateCompleteness(profile);
      
      await this.saveUserProfile(userId, {
        data_completeness_score: completeness
      });
    } catch (error) {
      console.error('Error updating completeness:', error);
    }
  }
}
