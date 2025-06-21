
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id?: string;
  user_id: string;
  
  // Basic Information
  company_name?: string;
  industry?: string;
  business_type?: string;
  company_size?: string;
  website_url?: string;
  
  // Location & Contact
  address_location?: string;
  contact_information?: any;
  social_media_accounts?: any;
  
  // Business Details
  company_overview?: string;
  core_offerings?: string;
  technical_products?: string;
  product_descriptions?: string;
  business_focus?: string;
  years_in_business?: number;
  founded_year?: number;
  monthly_revenue?: number;
  
  // Marketing Information
  marketing_experience?: string;
  marketing_budget?: string;
  current_marketing_budget?: number;
  marketing_priority?: string;
  primary_goal?: string;
  biggest_challenge?: string;
  competitive_advantage?: string;
  current_marketing_tools?: any;
  primary_marketing_goals?: string[];
  current_marketing_channels?: any;
  
  // Team & Operations
  team_size?: string;
  current_sales?: string;
  customer_sources?: string;
  target_region?: string;
  best_sales_season?: string;
  most_profitable_product?: string;
  
  // Additional Data
  target_audience?: any;
  competitive_advantages?: string[];
  main_competitors?: string[];
  additional_insights?: string;
  blog_updates?: any;
  
  // Preferences & Settings
  preferred_language?: string;
  communication_preferences?: any;
  personality_profile?: any;
  
  // Metadata
  analysis_source?: string;
  data_completeness_score?: number;
  completeness_score?: number;
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export class UserProfileService {
  // Save or update user profile
  static async saveUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    try {
      console.log('Saving user profile:', { userId, profileData });

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving user profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveUserProfile:', error);
      return false;
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  // Create initial profile for new user
  static async createInitialProfile(userId: string, initialData?: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          preferred_language: 'ar',
          data_completeness_score: 0,
          completeness_score: 0.0,
          onboarding_completed: false,
          analysis_source: 'manual',
          ...initialData
        });

      if (error) {
        console.error('Error creating initial profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createInitialProfile:', error);
      return false;
    }
  }

  // Update onboarding completion
  static async markOnboardingComplete(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error marking onboarding complete:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markOnboardingComplete:', error);
      return false;
    }
  }

  // Calculate profile completeness
  static calculateCompleteness(profile: UserProfile): number {
    const requiredFields = [
      'company_name', 'industry', 'business_type', 'company_size',
      'marketing_experience', 'primary_goal', 'target_audience'
    ];
    
    const optionalFields = [
      'website_url', 'company_overview', 'core_offerings', 'marketing_budget',
      'team_size', 'years_in_business', 'competitive_advantage'
    ];

    let score = 0;
    const totalFields = requiredFields.length + optionalFields.length;

    // Required fields (worth more)
    requiredFields.forEach(field => {
      if (profile[field as keyof UserProfile]) {
        score += 2;
      }
    });

    // Optional fields
    optionalFields.forEach(field => {
      if (profile[field as keyof UserProfile]) {
        score += 1;
      }
    });

    return Math.round((score / (requiredFields.length * 2 + optionalFields.length)) * 100);
  }

  // Update completeness score
  static async updateCompletenessScore(userId: string): Promise<void> {
    try {
      const profile = await this.getUserProfile(userId);
      if (profile) {
        const completeness = this.calculateCompleteness(profile);
        await supabase
          .from('user_profiles')
          .update({
            completeness_score: completeness / 100,
            data_completeness_score: completeness
          })
          .eq('user_id', userId);
      }
    } catch (error) {
      console.error('Error updating completeness score:', error);
    }
  }
}
