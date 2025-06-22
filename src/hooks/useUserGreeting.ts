
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService } from '@/services/userProfileService';

export const useUserGreeting = () => {
  const { user } = useAuth();
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
        const userProfile = await UserProfileService.getUserProfile(user.id);
        
        if (userProfile) {
          const userGreeting = userProfile.greeting_preference || 'أستاذ';
          const userName = userProfile.full_name || user.email?.split('@')[0] || 'مستخدم';
          
          setGreeting(userGreeting);
          setDisplayName(userName);
          setFullGreeting(`${userGreeting} ${userName}`);
        } else {
          // Use fallback defaults
          const fallbackGreeting = 'أستاذ';
          const fallbackName = user.email?.split('@')[0] || 'مستخدم';
          
          setGreeting(fallbackGreeting);
          setDisplayName(fallbackName);
          setFullGreeting(`${fallbackGreeting} ${fallbackName}`);
        }
      } catch (error) {
        console.error('Error loading greeting data:', error);
        // Use fallbacks
        const fallbackGreeting = 'أستاذ';
        const fallbackName = user.email?.split('@')[0] || 'مستخدم';
        
        setGreeting(fallbackGreeting);
        setDisplayName(fallbackName);
        setFullGreeting(`${fallbackGreeting} ${fallbackName}`);
      } finally {
        setLoading(false);
      }
    };

    loadGreetingData();
  }, [user]);

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
