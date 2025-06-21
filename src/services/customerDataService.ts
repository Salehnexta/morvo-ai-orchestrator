
import { supabase } from "@/integrations/supabase/client";
import { UserProfileService, UserProfile } from "./userProfileService";

export class CustomerDataService {
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

      // Get client data for additional relationships
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Get subscription data if client exists
      let subscriptionData = null;
      if (clientData) {
        const { data } = await supabase
          .from('user_subscriptions')
          .select(`
            *,
            subscription_plans(*)
          `)
          .eq('client_id', clientData.id)
          .eq('status', 'active')
          .maybeSingle();
        subscriptionData = data;
      }

      // Get conversation history from messages table
      const { data: conversationHistory } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      return {
        userProfile,
        clientData,
        subscriptionData,
        conversationHistory,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting complete customer profile:', error);
      return null;
    }
  }

  // Legacy methods for backward compatibility
  static async saveCustomerProfile(userId: string, data: any): Promise<boolean> {
    return this.saveCustomerData(userId, data);
  }

  static async getCustomerProfile(userId: string): Promise<UserProfile | null> {
    return this.getCustomerData(userId);
  }
}
