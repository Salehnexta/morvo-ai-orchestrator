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
  first_time_setup_completed?: boolean;
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
      const timestamp = new Date().toISOString();
      console.log(`📊 [${timestamp}] Fetching user profile for ID:`, userId);
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details
        });
        return null;
      }

      console.log(`✅ [${timestamp}] User profile fetched successfully:`, {
        profileExists: !!profile,
        userId: profile?.user_id,
        setupCompleted: profile?.first_time_setup_completed,
        companyName: profile?.company_name,
        industry: profile?.industry,
        marketingExperience: profile?.marketing_experience,
        monthlyBudget: profile?.monthly_marketing_budget,
        greetingPreference: profile?.greeting_preference,
        completenessScore: profile?.data_completeness_score
      });
      
      return profile;
    } catch (error) {
      console.error('❌ Unexpected error in getUserProfile:', error);
      return null;
    }
  }

  static async saveUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    try {
      const timestamp = new Date().toISOString();
      console.log(`💾 [${timestamp}] Saving user profile for ID:`, userId);
      console.log('💾 Profile data to save:', profileData);

      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Error checking existing profile:', fetchError);
        return false;
      }

      const now = new Date().toISOString();
      const dataToSave = {
        ...profileData,
        updated_at: now
      };

      console.log('💾 Data to save after processing:', dataToSave);

      if (existingProfile) {
        console.log('🔄 Updating existing profile...');
        const { error } = await supabase
          .from('user_profiles')
          .update(dataToSave)
          .eq('user_id', userId);

        if (error) {
          console.error('❌ Error updating user profile:', error);
          console.error('❌ Update error details:', {
            message: error.message,
            code: error.code,
            hint: error.hint,
            details: error.details
          });
          return false;
        }
        console.log(`✅ [${timestamp}] Profile updated successfully`);
      } else {
        console.log('➕ Creating new profile...');
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            created_at: now,
            ...dataToSave
          });

        if (error) {
          console.error('❌ Error creating user profile:', error);
          console.error('❌ Insert error details:', {
            message: error.message,
            code: error.code,
            hint: error.hint,
            details: error.details
          });
          return false;
        }
        console.log(`✅ [${timestamp}] Profile created successfully`);
      }

      return true;
    } catch (error) {
      console.error('❌ Unexpected error in saveUserProfile:', error);
      return false;
    }
  }

  static async calculateCompleteness(profile: UserProfile): Promise<number> {
    // Essential required fields that should be filled
    const requiredFields = [
      'greeting_preference',
      'company_name', 
      'industry', 
      'company_size',
      'business_type',
      'marketing_experience',
      'monthly_marketing_budget',
      'current_monthly_revenue'
    ];

    // Important optional fields that add to completeness
    const optionalFields = [
      'full_name',
      'website_url',
      'company_overview',
      'target_market',
      'revenue_target',
      'biggest_marketing_challenge',
      'primary_marketing_goals',
      'unique_selling_points',
      'contact_info'
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    console.log('🔍 Calculating completeness for profile:', profile);

    // Check required fields
    requiredFields.forEach(field => {
      const value = profile[field as keyof UserProfile];
      console.log(`🔍 Required field ${field}:`, value);
      
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          completedRequired++;
        } else if (!Array.isArray(value)) {
          completedRequired++;
        }
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      const value = profile[field as keyof UserProfile];
      console.log(`🔍 Optional field ${field}:`, value);
      
      if (value !== null && value !== undefined && value !== '') {
        if (field === 'primary_marketing_goals' && Array.isArray(value) && value.length > 0) {
          completedOptional++;
        } else if (field === 'unique_selling_points' && Array.isArray(value) && value.length > 0) {
          completedOptional++;
        } else if (field === 'contact_info' && typeof value === 'object' && value !== null) {
          const contactInfo = value as any;
          if (contactInfo.email || contactInfo.phone) {
            completedOptional++;
          }
        } else if (!Array.isArray(value) && typeof value !== 'object') {
          completedOptional++;
        }
      }
    });

    // Calculate weighted score (required fields worth more)
    const requiredWeight = 0.7;
    const optionalWeight = 0.3;
    
    const requiredScore = (completedRequired / requiredFields.length) * requiredWeight;
    const optionalScore = (completedOptional / optionalFields.length) * optionalWeight;
    
    const finalScore = Math.round((requiredScore + optionalScore) * 100);
    
    console.log('🔍 Completeness calculation:', {
      completedRequired,
      totalRequired: requiredFields.length,
      completedOptional,
      totalOptional: optionalFields.length,
      requiredScore,
      optionalScore,
      finalScore
    });

    return finalScore;
  }

  static async updateCompleteness(userId: string): Promise<void> {
    try {
      console.log('📊 Updating completeness for user:', userId);
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        console.log('❌ No profile found to update completeness');
        return;
      }

      const completeness = await this.calculateCompleteness(profile);
      console.log('📊 Calculated completeness:', completeness);
      
      const success = await this.saveUserProfile(userId, {
        data_completeness_score: completeness
      });
      
      if (success) {
        console.log('✅ Completeness updated successfully');
      } else {
        console.log('❌ Failed to update completeness');
      }
    } catch (error) {
      console.error('❌ Error updating completeness:', error);
    }
  }

  // Debug method to check profile status
  static async debugUserProfile(userId: string): Promise<void> {
    try {
      console.log('🔍 DEBUG: Checking user profile status for:', userId);
      
      // Check if user exists in auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('🔍 DEBUG: Current auth user:', user?.id, user?.email);
      
      if (authError) {
        console.error('🔍 DEBUG: Auth error:', authError);
      }

      // Check profile in database
      const profile = await this.getUserProfile(userId);
      console.log('🔍 DEBUG: Profile from database:', profile);
      
      if (profile) {
        const completeness = await this.calculateCompleteness(profile);
        console.log('🔍 DEBUG: Profile completeness:', completeness);
        console.log('🔍 DEBUG: Setup completed?', profile.first_time_setup_completed);
        console.log('🔍 DEBUG: Onboarding completed?', profile.onboarding_completed);
      }
    } catch (error) {
      console.error('🔍 DEBUG: Error in debug method:', error);
    }
  }
}
