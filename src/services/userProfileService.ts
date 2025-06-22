
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id?: string;
  user_id: string;
  
  // Personal Information (USER INPUT ONLY)
  full_name?: string;
  greeting_preference?: string;
  preferred_language?: string;
  
  // Business Identity (USER INPUT ONLY)
  company_name?: string;
  business_type?: string;
  industry?: string;
  
  // Marketing Profile (USER INPUT ONLY)
  marketing_experience?: string;
  primary_marketing_goals?: string[];
  monthly_marketing_budget?: string;
  
  // Target Audience (USER INPUT ONLY)
  target_audience?: {
    age_range?: string;
    gender?: string;
    interests?: string[];
  };
  
  // Business Insights (USER INPUT ONLY)
  unique_selling_points?: string[];
  biggest_marketing_challenge?: string;
  seasonal_peaks?: string[];
  revenue_target?: string;
  expansion_plans?: string[];
  current_monthly_revenue?: string;
  average_order_value?: number;
  customer_acquisition_cost?: number;
  
  // Website & Company Info (PERPLEXITY OR USER INPUT)
  website_url?: string;
  company_overview?: string;
  products_services?: {
    categories?: string[];
    top_products?: string[];
    price_range?: string;
  };
  key_team_members?: any[];
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
    social_media?: {
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  business_model?: string;
  target_market?: string;
  recent_news?: string[];
  case_studies?: string[];
  service_areas?: string[];
  branch_locations?: string[];
  
  // SE RANKING DATA (AUTOMATED ONLY)
  seo_data?: {
    domain_analysis?: {
      domain_authority?: number;
      trust_score?: number;
      domain_age?: string;
      alexa_rank?: number;
    };
    organic_metrics?: {
      total_keywords?: number;
      top_10_keywords?: number;
      organic_traffic?: number;
      traffic_value?: number;
      visibility_score?: number;
    };
    keyword_analysis?: {
      branded_keywords?: string[];
      non_branded_keywords?: string[];
      keyword_gaps?: string[];
      trending_keywords?: string[];
    };
    competitors?: any[];
    backlink_metrics?: {
      total_backlinks?: number;
      referring_domains?: number;
      dofollow_ratio?: number;
      anchor_text_distribution?: any;
    };
    technical_audit?: {
      page_speed_score?: number;
      mobile_friendly?: boolean;
      ssl_certificate?: boolean;
      sitemap_status?: string;
    };
    serp_features?: {
      featured_snippets?: string[];
      local_pack_presence?: boolean;
      knowledge_panel?: boolean;
    };
  };
  
  // Profile Management
  data_completeness_score?: number;
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
  last_seo_update?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export class UserProfileService {
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

  static async createInitialProfile(userId: string, initialData?: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          preferred_language: 'ar',
          greeting_preference: 'أستاذ',
          data_completeness_score: 0,
          onboarding_completed: false,
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

  static async updateSeoData(userId: string, seoData: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          seo_data: seoData,
          last_seo_update: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating SEO data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSeoData:', error);
      return false;
    }
  }

  static calculateCompleteness(profile: UserProfile): number {
    const requiredFields = [
      'company_name', 'industry', 'business_type', 'marketing_experience', 
      'primary_marketing_goals', 'target_audience'
    ];
    
    const optionalFields = [
      'website_url', 'company_overview', 'monthly_marketing_budget',
      'biggest_marketing_challenge', 'unique_selling_points'
    ];

    let score = 0;
    const totalFields = requiredFields.length + optionalFields.length;

    requiredFields.forEach(field => {
      if (profile[field as keyof UserProfile]) {
        score += 2;
      }
    });

    optionalFields.forEach(field => {
      if (profile[field as keyof UserProfile]) {
        score += 1;
      }
    });

    return Math.round((score / (requiredFields.length * 2 + optionalFields.length)) * 100);
  }

  static async updateCompletenessScore(userId: string): Promise<void> {
    try {
      const profile = await this.getUserProfile(userId);
      if (profile) {
        const completeness = this.calculateCompleteness(profile);
        await supabase
          .from('user_profiles')
          .update({
            data_completeness_score: completeness
          })
          .eq('user_id', userId);
      }
    } catch (error) {
      console.error('Error updating completeness score:', error);
    }
  }
}
