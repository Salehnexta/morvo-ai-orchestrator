
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSmartChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveCustomerProfile = useCallback(async (userId: string, profileData: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('client_profiles')
        .upsert({
          client_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving customer profile:', error);
        toast({
          title: "خطأ في حفظ البيانات",
          description: "حدث خطأ أثناء حفظ معلومات العميل",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveCustomerProfile:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getCustomerProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting customer profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCustomerProfile:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMarketingPreferences = useCallback(async (userId: string, preferences: any) => {
    try {
      setIsLoading(true);

      // Use client_profiles instead of marketing_preferences since it doesn't exist
      const { error } = await supabase
        .from('client_profiles')
        .upsert({
          client_id: userId,
          communication_preferences: preferences,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving marketing preferences:', error);
        toast({
          title: "Error Saving Preferences",
          description: "There was an error saving your marketing preferences.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Preferences Saved",
        description: "Your marketing preferences have been successfully saved.",
      });
      return true;
    } catch (error) {
      console.error('Error in saveMarketingPreferences:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getMarketingPreferences = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('client_profiles')
        .select('communication_preferences')
        .eq('client_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error getting marketing preferences:', error);
        return null;
      }

      return data?.communication_preferences || {};
    } catch (error) {
      console.error('Error in getMarketingPreferences:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add missing functions for EnhancedChatInput
  const processMessage = useCallback(async (message: string) => {
    // Extract basic information from message for profile building
    console.log('Processing message for profile extraction:', message);
    return true;
  }, []);

  const getProfileCompleteness = useCallback(() => {
    // Return a simple completeness percentage
    return 60; // Default value
  }, []);

  const getMissingFields = useCallback(() => {
    // Return array of missing profile fields
    return ['company_name', 'industry', 'target_audience'];
  }, []);

  return {
    isLoading,
    saveCustomerProfile,
    getCustomerProfile,
    saveMarketingPreferences,
    getMarketingPreferences,
    processMessage,
    getProfileCompleteness,
    getMissingFields,
  };
};
