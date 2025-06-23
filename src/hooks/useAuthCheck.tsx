
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfileService } from '@/services/userProfileService';

interface AuthCheckResult {
  isChecking: boolean;
  hasChecked: boolean;
  debugInfo: any;
}

export const useAuthCheck = (redirectTo: string = '/auth/login'): AuthCheckResult => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const currentTime = new Date().toISOString();
    console.log(`🔒 [${currentTime}] Auth check triggered:`, { 
      user: !!user, 
      session: !!session, 
      loading, 
      path: location.pathname,
      hasChecked
    });
    
    // Prevent multiple checks
    if (hasChecked) {
      console.log('🔒 Already checked, skipping...');
      return;
    }
    
    if (!loading && (!user || !session)) {
      console.log('🔒 Redirecting to login - no authentication');
      navigate(redirectTo, { replace: true });
      setIsChecking(false);
      return;
    }

    // Check if user needs first-time setup (only if authenticated and not already on setup page)
    if (user && session && location.pathname !== '/first-time-setup') {
      console.log('🔒 Starting first-time setup check...');
      checkFirstTimeSetup();
    } else if (location.pathname === '/first-time-setup') {
      console.log('🔒 Already on setup page, allowing access');
      setIsChecking(false);
      setHasChecked(true);
    } else {
      console.log('🔒 Conditions not met for setup check, setting isChecking to false');
      setIsChecking(false);
    }
  }, [user, session, loading, navigate, redirectTo, location.pathname, hasChecked]);

  const checkFirstTimeSetup = async () => {
    if (!user) {
      console.log('🔒 No user found, stopping setup check');
      setIsChecking(false);
      return;
    }

    try {
      console.log('🔒 Fetching user profile for setup check...');
      
      const profile = await UserProfileService.getUserProfile(user.id);
      
      const currentDebugInfo = {
        profileExists: !!profile,
        profileData: profile ? {
          first_time_setup_completed: profile.first_time_setup_completed,
          company_name: profile.company_name,
          industry: profile.industry,
          marketing_experience: profile.marketing_experience,
          monthly_marketing_budget: profile.monthly_marketing_budget,
          greeting_preference: profile.greeting_preference,
          data_completeness_score: profile.data_completeness_score
        } : null,
        timestamp: new Date().toISOString()
      };
      
      setDebugInfo(currentDebugInfo);
      console.log('🔒 Debug Info:', currentDebugInfo);
      
      if (!profile) {
        console.log('🔒 No profile found - redirecting to first-time setup');
        setHasChecked(true);
        navigate('/first-time-setup', { replace: true });
        return;
      }

      console.log('🔒 Profile found, checking completion status:', {
        first_time_setup_completed: profile.first_time_setup_completed,
        company_name: !!profile.company_name,
        industry: !!profile.industry,
        marketing_experience: !!profile.marketing_experience,
        monthly_marketing_budget: !!profile.monthly_marketing_budget
      });
      
      const fieldChecks = {
        company_name: {
          value: profile.company_name,
          exists: !!(profile.company_name && profile.company_name.trim())
        },
        industry: {
          value: profile.industry,
          exists: !!(profile.industry && profile.industry.trim())
        },
        marketing_experience: {
          value: profile.marketing_experience,
          exists: !!(profile.marketing_experience && profile.marketing_experience.trim())
        },
        monthly_marketing_budget: {
          value: profile.monthly_marketing_budget,
          exists: !!(profile.monthly_marketing_budget && profile.monthly_marketing_budget.trim())
        }
      };
      
      console.log('🔒 Field checks:', fieldChecks);
      
      const hasEssentialInfo = fieldChecks.company_name.exists && 
                              fieldChecks.industry.exists && 
                              fieldChecks.marketing_experience.exists && 
                              fieldChecks.monthly_marketing_budget.exists;
      
      const setupComplete = profile.first_time_setup_completed === true && hasEssentialInfo;
      
      console.log('🔒 Setup completion result:', {
        hasEssentialInfo,
        setupComplete,
        flagValue: profile.first_time_setup_completed,
        flagType: typeof profile.first_time_setup_completed
      });
      
      if (!setupComplete) {
        console.log('🔒 Setup incomplete - redirecting to first-time setup');
        setHasChecked(true);
        navigate('/first-time-setup', { replace: true });
        return;
      }
      
      console.log('🔒 Setup complete - allowing access to protected route');
      setHasChecked(true);
      
    } catch (error) {
      console.error('🔒 Error checking first-time setup:', error);
      setHasChecked(true);
    } finally {
      setIsChecking(false);
    }
  };

  return { isChecking, hasChecked, debugInfo };
};
