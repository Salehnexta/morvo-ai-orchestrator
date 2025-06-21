
import { supabase } from "@/integrations/supabase/client";
import { CustomerData } from "./types";

export class AgentCustomerDataService {
  // Save customer data to client_profiles table
  static async saveCustomerData(clientId: string, data: any): Promise<boolean> {
    try {
      console.log('Saving customer data:', { clientId, data });

      const { error } = await supabase
        .from('client_profiles')
        .upsert({
          client_id: clientId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving customer data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveCustomerData:', error);
      return false;
    }
  }

  // Get customer data from client_profiles table
  static async getCustomerData(clientId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting customer data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCustomerData:', error);
      return null;
    }
  }

  // Get complete customer profile with related data
  static async getCompleteCustomerProfile(clientId: string): Promise<any> {
    try {
      // Get customer profile from client_profiles
      const { data: customerProfile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', clientId)
        .maybeSingle();

      // Get subscription data
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('client_id', clientData?.id)
        .eq('status', 'active')
        .maybeSingle();

      // Get conversation history from messages table
      const { data: conversationHistory } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(20);

      return {
        customerProfile,
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
}
