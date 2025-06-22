
import { UserProfileService, UserProfile } from "./userProfileService";

export class CustomerDataService {
  static async saveCustomerData(userId: string, data: Partial<UserProfile>): Promise<boolean> {
    return UserProfileService.saveUserProfile(userId, data);
  }

  static async getCustomerData(userId: string): Promise<UserProfile | null> {
    return UserProfileService.getUserProfile(userId);
  }

  static async getCompleteCustomerProfile(userId: string): Promise<any> {
    try {
      // Get unified user profile
      const userProfile = await UserProfileService.getUserProfile(userId);
      if (!userProfile) {
        return null;
      }

      return {
        userProfile,
        completeness: UserProfileService.calculateCompleteness(userProfile),
        lastUpdate: userProfile.updated_at,
        seoLastUpdate: userProfile.last_seo_update,
        onboardingComplete: userProfile.onboarding_completed
      };
    } catch (error) {
      console.error('Error getting complete customer profile:', error);
      return null;
    }
  }

  // Legacy methods for backward compatibility
  static async saveCustomerProfile(userId: string, data: Partial<UserProfile>): Promise<boolean> {
    return this.saveCustomerData(userId, data);
  }

  static async getCustomerProfile(userId: string): Promise<UserProfile | null> {
    return this.getCustomerData(userId);
  }
}
