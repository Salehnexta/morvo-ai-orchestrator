
import { supabase } from "@/integrations/supabase/client";

export class DatabaseCleanupService {
  
  static async cleanupDuplicateProfiles(customerId: string): Promise<void> {
    try {
      console.log('🧹 Starting database cleanup for customer:', customerId);
      
      // Get all profiles for this customer
      const { data: profiles, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching profiles:', error);
        return;
      }

      if (!profiles || profiles.length <= 1) {
        console.log('ℹ️ No duplicate profiles found');
        return;
      }

      console.log(`🔍 Found ${profiles.length} profiles, keeping most recent`);
      
      // Keep the most recent profile (first in the ordered list)
      const keepProfile = profiles[0];
      const duplicateIds = profiles.slice(1).map(p => p.id);
      
      // Merge profile data from all profiles
      const mergedProfileData = profiles.reduce((merged, profile) => {
        if (profile.profile_data && typeof profile.profile_data === 'object') {
          const profileData = profile.profile_data as Record<string, any>;
          return { ...merged, ...profileData };
        }
        return merged;
      }, {} as Record<string, any>);

      // Update the kept profile with merged data
      const { error: updateError } = await supabase
        .from('customer_profiles')
        .update({
          profile_data: mergedProfileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', keepProfile.id);

      if (updateError) {
        console.error('❌ Error updating merged profile:', updateError);
        return;
      }

      // Delete duplicate profiles
      const { error: deleteError } = await supabase
        .from('customer_profiles')
        .delete()
        .in('id', duplicateIds);

      if (deleteError) {
        console.error('❌ Error deleting duplicates:', deleteError);
        return;
      }

      console.log(`✅ Cleaned up ${duplicateIds.length} duplicate profiles`);
      
    } catch (error) {
      console.error('❌ Database cleanup failed:', error);
    }
  }

  static async ensureJourneyRecord(customerId: string): Promise<string | null> {
    try {
      // Check if user has any journey record
      const { data: existingJourney } = await supabase
        .from('onboarding_journeys')
        .select('*')
        .eq('client_id', customerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingJourney) {
        console.log('✅ Journey record exists:', existingJourney.journey_id);
        return existingJourney.journey_id;
      }

      // Check if user has completed profile
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('profile_data')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const hasCompletedProfile = profile?.profile_data && 
        typeof profile.profile_data === 'object' && 
        Object.keys(profile.profile_data).length > 3;

      // Create journey record for user with completed profile
      const journeyId = `journey_${customerId}_${Date.now()}`;
      
      const { error } = await supabase
        .from('onboarding_journeys')
        .insert({
          journey_id: journeyId,
          client_id: customerId,
          current_phase: hasCompletedProfile ? 'strategy_generation' : 'welcome',
          profile_progress: hasCompletedProfile ? 100 : 0,
          is_completed: hasCompletedProfile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('❌ Error creating journey record:', error);
        return null;
      }

      console.log('✅ Created journey record:', journeyId);
      return journeyId;
      
    } catch (error) {
      console.error('❌ Error ensuring journey record:', error);
      return null;
    }
  }
}
