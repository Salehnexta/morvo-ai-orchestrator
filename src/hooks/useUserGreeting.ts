
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJourney } from '@/contexts/JourneyContext';
import { UserProfileService } from '@/services/userProfileService';

export const useUserGreeting = () => {
  const { user } = useAuth();
  const { greetingPreference } = useJourney();
  const [greeting, setGreeting] = useState<string>('أستاذ');
  const [displayName, setDisplayName] = useState<string>('مستخدم');
  const [fullGreeting, setFullGreeting] = useState<string>('مرحباً');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGreetingData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Use user_profiles table instead of customer_profiles
        const userProfile = await UserProfileService.getUserProfile(user.id);
        
        if (userProfile) {
          const userGreeting = userProfile.greeting_preference || greetingPreference || 'أستاذ';
          const userName = userProfile.full_name || user.email?.split('@')[0] || 'مستخدم';
          
          setGreeting(userGreeting);
          setDisplayName(userName);
          setFullGreeting(`${userGreeting} ${userName}`);
        } else {
          // Use fallback from context or default
          const fallbackGreeting = greetingPreference || 'أستاذ';
          const fallbackName = user.email?.split('@')[0] || 'مستخدم';
          
          setGreeting(fallbackGreeting);
          setDisplayName(fallbackName);
          setFullGreeting(`${fallbackGreeting} ${fallbackName}`);
        }
      } catch (error) {
        console.error('Error loading greeting data:', error);
        // Use fallbacks
        const fallbackGreeting = greetingPreference || 'أستاذ';
        const fallbackName = user.email?.split('@')[0] || 'مستخدم';
        
        setGreeting(fallbackGreeting);
        setDisplayName(fallbackName);
        setFullGreeting(`${fallbackGreeting} ${fallbackName}`);
      } finally {
        setLoading(false);
      }
    };

    loadGreetingData();
  }, [user, greetingPreference]);

  const updateGreeting = async (newGreeting: string) => {
    if (!user) return false;

    try {
      await UserProfileService.saveUserProfile(user.id, {
        greeting_preference: newGreeting
      });

      setGreeting(newGreeting);
      setFullGreeting(`${newGreeting} ${displayName}`);
      return true;
    } catch (error) {
      console.error('Error updating greeting:', error);
      return false;
    }
  };

  return {
    greeting,
    displayName,
    fullGreeting,
    loading,
    updateGreeting
  };
};
