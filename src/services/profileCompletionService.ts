
import { UserProfileService, UserProfile } from './userProfileService';
import { SERankingService } from './seRankingService';

export class ProfileCompletionService {
  // Check if profile meets completion criteria
  static async checkProfileCompleteness(profile: UserProfile): Promise<boolean> {
    // Essential fields required for completion
    const requiredFields = [
      profile.company_name,
      profile.industry,
      profile.marketing_experience,
      profile.monthly_marketing_budget,
      profile.greeting_preference
    ];

    // Check if at least 80% of required fields are filled
    const filledFields = requiredFields.filter(field => field && field.trim() !== '').length;
    return filledFields >= Math.ceil(requiredFields.length * 0.8);
  }

  // Complete profile setup with SEO analysis trigger
  static async completeProfileSetup(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    try {
      console.log('🔄 Starting profile completion for user:', userId);
      
      // Get current profile
      const currentProfile = await UserProfileService.getUserProfile(userId);
      const updatedProfile = { ...currentProfile, ...profileData };
      
      // Check if profile is now complete
      const isComplete = await this.checkProfileCompleteness(updatedProfile as UserProfile);
      
      if (isComplete) {
        console.log('✅ Profile meets completion criteria');
        
        // Mark profile as completed using existing fields
        const completionData = {
          ...profileData,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          first_time_setup_completed: true,
          data_completeness_score: await UserProfileService.calculateCompleteness(updatedProfile as UserProfile)
        };
        
        // Save profile with completion status
        const saved = await UserProfileService.saveUserProfile(userId, completionData);
        
        if (saved && updatedProfile.website_url) {
          console.log('🔍 Triggering SEO analysis for:', updatedProfile.website_url);
          
          // Trigger SEO analysis (non-blocking)
          this.triggerSEOAnalysis(userId, updatedProfile.website_url).catch(error => {
            console.error('❌ SEO analysis failed:', error);
          });
        }
        
        return saved;
      } else {
        console.log('⏳ Profile not yet complete, saving progress');
        return await UserProfileService.saveUserProfile(userId, profileData);
      }
    } catch (error) {
      console.error('❌ Profile completion failed:', error);
      return false;
    }
  }

  // Trigger SEO analysis asynchronously
  private static async triggerSEOAnalysis(userId: string, websiteUrl: string): Promise<void> {
    try {
      console.log('🔍 Starting SEO analysis for:', websiteUrl);
      
      // Perform SEO analysis
      const analysisResult = await SERankingService.analyzeDomain(websiteUrl, userId);
      
      if (analysisResult) {
        console.log('✅ SEO analysis completed successfully');
        
        // Mark analysis as completed using existing fields
        await UserProfileService.saveUserProfile(userId, {
          last_seo_update: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ SEO analysis error:', error);
    }
  }

  // Get completion status with contextual information
  static async getCompletionStatus(userId: string): Promise<{
    isComplete: boolean;
    completenessScore: number;
    missingFields: string[];
    hasWebsiteAnalysis: boolean;
  }> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      
      if (!profile) {
        return {
          isComplete: false,
          completenessScore: 0,
          missingFields: ['All profile data'],
          hasWebsiteAnalysis: false
        };
      }

      const isComplete = await this.checkProfileCompleteness(profile);
      const completenessScore = await UserProfileService.calculateCompleteness(profile);
      
      const missingFields = [];
      if (!profile.company_name) missingFields.push('اسم الشركة');
      if (!profile.industry) missingFields.push('المجال');
      if (!profile.marketing_experience) missingFields.push('الخبرة التسويقية');
      if (!profile.monthly_marketing_budget) missingFields.push('الميزانية الشهرية');
      
      return {
        isComplete,
        completenessScore,
        missingFields,
        hasWebsiteAnalysis: !!(profile.seo_data && profile.last_seo_update)
      };
    } catch (error) {
      console.error('❌ Error getting completion status:', error);
      return {
        isComplete: false,
        completenessScore: 0,
        missingFields: ['خطأ في تحميل البيانات'],
        hasWebsiteAnalysis: false
      };
    }
  }
}
