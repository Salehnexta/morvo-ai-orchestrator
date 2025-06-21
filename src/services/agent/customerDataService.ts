
import { UserProfileService, UserProfile } from "../userProfileService";

export class AgentCustomerDataService {
  // Save customer data to user_profiles table
  static async saveCustomerData(userId: string, data: any): Promise<boolean> {
    return UserProfileService.saveUserProfile(userId, data);
  }

  // Get customer data from user_profiles table
  static async getCustomerData(userId: string): Promise<UserProfile | null> {
    return UserProfileService.getUserProfile(userId);
  }

  // Get complete customer profile with related data
  static async getCompleteCustomerProfile(userId: string): Promise<any> {
    try {
      // Get user profile
      const userProfile = await UserProfileService.getUserProfile(userId);

      return {
        userProfile,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting complete customer profile:', error);
      return null;
    }
  }
}
