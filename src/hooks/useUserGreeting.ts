
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJourney } from '@/contexts/JourneyContext';
import { supabase } from '@/integrations/supabase/client';

interface UserGreetingData {
  firstName: string | null;
  lastName: string | null;
  greetingTitle: string | null;
  fullGreeting: string;
  displayName: string;
}

export const useUserGreeting = () => {
  const { user } = useAuth();
  const { greetingPreference } = useJourney();
  const [greetingData, setGreetingData] = useState<UserGreetingData>({
    firstName: null,
    lastName: null,
    greetingTitle: null,
    fullGreeting: 'مرحباً',
    displayName: 'مستخدم'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserGreeting = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Get user's basic info from auth metadata
        const firstName = user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || null;
        const lastName = user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null;

        // Get greeting preference from journey or customer profile
        let savedGreetingPreference = greetingPreference;
        
        if (!savedGreetingPreference) {
          const { data: profile } = await supabase
            .from('customer_profiles')
            .select('profile_data')
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (profile?.profile_data && typeof profile.profile_data === 'object') {
            const profileData = profile.profile_data as Record<string, any>;
            savedGreetingPreference = profileData.greeting_preference;
          }
        }

        // Build display name and greeting
        const displayName = firstName ? 
          (lastName ? `${firstName} ${lastName}` : firstName) : 
          'مستخدم';

        let fullGreeting = 'مرحباً';
        
        if (savedGreetingPreference && firstName) {
          switch (savedGreetingPreference) {
            case 'أستاذ':
              fullGreeting = `أستاذ ${firstName}`;
              break;
            case 'دكتور':
              fullGreeting = `دكتور ${firstName}`;
              break;
            case 'مهندس':
              fullGreeting = `مهندس ${firstName}`;
              break;
            case 'الاسم فقط':
              fullGreeting = firstName;
              break;
            default:
              fullGreeting = `أستاذ ${firstName}`;
          }
        } else if (firstName) {
          fullGreeting = `مرحباً ${firstName}`;
        }

        setGreetingData({
          firstName,
          lastName,
          greetingTitle: savedGreetingPreference,
          fullGreeting,
          displayName
        });

        console.log('✅ User greeting loaded:', {
          firstName,
          lastName,
          greetingTitle: savedGreetingPreference,
          fullGreeting,
          displayName
        });

      } catch (error) {
        console.error('❌ Error loading user greeting:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserGreeting();
  }, [user?.id, greetingPreference]);

  return {
    ...greetingData,
    loading
  };
};
