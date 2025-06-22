import { supabase } from "@/integrations/supabase/client";

export class DatabaseCleanupService {
  
  static async cleanupDuplicateProfiles(customerId: string): Promise<void> {
    try {
      console.log('🧹 Starting database cleanup for customer:', customerId);
      
      // Get all profiles for this customer from user_profiles table
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', customerId)
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
        return { ...merged, ...profile };
      }, {} as Record<string, any>);

      // Update the kept profile with merged data
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...mergedProfileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', keepProfile.id);

      if (updateError) {
        console.error('❌ Error updating merged profile:', updateError);
        return;
      }

      // Delete duplicate profiles
      if (duplicateIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('user_profiles')
          .delete()
          .in('id', duplicateIds);

        if (deleteError) {
          console.error('❌ Error deleting duplicates:', deleteError);
          return;
        }
      }

      console.log(`✅ Cleaned up ${duplicateIds.length} duplicate profiles`);
      
    } catch (error) {
      console.error('❌ Database cleanup failed:', error);
    }
  }

  static async ensureUserProfile(userId: string): Promise<string | null> {
    try {
      // Check if user has a profile
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingProfile) {
        console.log('✅ User profile exists:', existingProfile.id);
        return existingProfile.id;
      }

      // Create initial profile for user
      const { data: newProfile, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          preferred_language: 'ar',
          greeting_preference: 'أستاذ',
          data_completeness_score: 0,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user profile:', error);
        return null;
      }

      console.log('✅ Created user profile:', newProfile.id);
      return newProfile.id;
      
    } catch (error) {
      console.error('❌ Error ensuring user profile:', error);
      return null;
    }
  }
}
