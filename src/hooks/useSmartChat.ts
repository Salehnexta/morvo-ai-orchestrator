
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
        .from('customer_profiles')
        .upsert({
          customer_id: userId,
          client_id: profileData.client_id,
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
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', userId)
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

  const saveMarketingPreferences = useCallback(async (userId: string, preferences: any, clientId?: string) => {
    try {
      setIsLoading(true);

      // Get client_id if not provided
      let targetClientId = clientId;
      if (!targetClientId) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', userId)
          .single();
        
        if (clientData) {
          targetClientId = clientData.id;
        }
      }

      if (!targetClientId) {
        console.error('No client_id found for user');
        return false;
      }

      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: userId,
          client_id: targetClientId,
          preferences: preferences,
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
        .from('customer_profiles')
        .select('preferences')
        .eq('customer_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error getting marketing preferences:', error);
        return null;
      }

      return data?.preferences || {};
    } catch (error) {
      console.error('Error in getMarketingPreferences:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processMessage = useCallback(async (message: string) => {
    console.log('Processing message for profile extraction:', message);
    return true;
  }, []);

  const getProfileCompleteness = useCallback(() => {
    return 60; // Default value
  }, []);

  const getMissingFields = useCallback(() => {
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
