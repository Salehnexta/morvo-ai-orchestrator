
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { UserProfileService } from '@/services/userProfileService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const currentTime = new Date().toISOString();
    console.log(`🔒 [${currentTime}] ProtectedRoute useEffect triggered:`, { 
      user: !!user, 
      session: !!session, 
      loading, 
      path: location.pathname,
      userId: user?.id,
      userEmail: user?.email,
      hasChecked,
      checkingSetup
    });
    
    // Prevent multiple checks
    if (hasChecked) {
      console.log('🔒 Already checked, skipping...');
      return;
    }
    
    if (!loading && (!user || !session)) {
      console.log('🔒 Redirecting to login - no authentication');
      navigate(redirectTo, { replace: true });
      setCheckingSetup(false);
      return;
    }

    // Check if user needs first-time setup (only if authenticated and not already on setup page)
    if (user && session && location.pathname !== '/first-time-setup') {
      console.log('🔒 Starting first-time setup check...');
      checkFirstTimeSetup();
    } else if (location.pathname === '/first-time-setup') {
      console.log('🔒 Already on setup page, allowing access');
      setCheckingSetup(false);
      setHasChecked(true);
    } else {
      console.log('🔒 Conditions not met for setup check, setting checkingSetup to false');
      setCheckingSetup(false);
    }
  }, [user, session, loading, navigate, redirectTo, location.pathname, hasChecked]);

  const checkFirstTimeSetup = async () => {
    if (!user) {
      console.log('🔒 No user found, stopping setup check');
      setCheckingSetup(false);
      return;
    }

    try {
      console.log('🔒 Fetching user profile for setup check...');
      
      const profile = await UserProfileService.getUserProfile(user.id);
      
      // Store debug info for analysis
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
      
      // Check essential fields with detailed logging
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
      
      // Setup is complete if flag is true AND essential info exists
      const setupComplete = profile.first_time_setup_completed === true && hasEssentialInfo;
      
      console.log('🔒 Setup completion result:', {
        hasEssentialInfo,
        setupComplete,
        flagValue: profile.first_time_setup_completed,
        flagType: typeof profile.first_time_setup_completed
      });
      
      if (!setupComplete) {
        console.log('🔒 Setup incomplete - redirecting to first-time setup');
        console.log('🔒 Reason for incompleteness:', {
          flagNotTrue: profile.first_time_setup_completed !== true,
          missingEssentialInfo: !hasEssentialInfo
        });
        setHasChecked(true);
        navigate('/first-time-setup', { replace: true });
        return;
      }
      
      console.log('🔒 Setup complete - allowing access to protected route');
      setHasChecked(true);
      
    } catch (error) {
      console.error('🔒 Error checking first-time setup:', error);
      console.error('🔒 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      // On error, allow access but mark as checked to prevent loops
      console.log('🔒 Error occurred, allowing access and marking as checked');
      setHasChecked(true);
    } finally {
      setCheckingSetup(false);
    }
  };

  // Show loading state while checking authentication or setup status
  if (loading || checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-white">جاري التحقق من تسجيل الدخول...</p>
          {debugInfo.timestamp && (
            <div className="mt-4 text-xs text-gray-400 max-w-md">
              <p>Debug: Last check at {debugInfo.timestamp}</p>
              <p>Profile exists: {debugInfo.profileExists ? 'Yes' : 'No'}</p>
              {debugInfo.profileData && (
                <p>Setup flag: {String(debugInfo.profileData.first_time_setup_completed)}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user || !session) {
    console.log('🔒 Not rendering children - no auth');
    return null;
  }

  // Render children when authenticated and setup is complete
  console.log('🔒 Rendering protected content');
  return <>{children}</>;
};
