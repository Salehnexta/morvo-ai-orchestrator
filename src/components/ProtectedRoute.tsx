
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

  useEffect(() => {
    console.log('🔒 ProtectedRoute useEffect triggered:', { 
      user: !!user, 
      session: !!session, 
      loading, 
      path: location.pathname,
      userId: user?.id,
      userEmail: user?.email,
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
      
      // Check essential fields
      const hasEssentialInfo = !!(
        profile.company_name && 
        profile.industry && 
        profile.marketing_experience && 
        profile.monthly_marketing_budget
      );
      
      // Setup is complete if flag is true AND essential info exists
      const setupComplete = profile.first_time_setup_completed === true && hasEssentialInfo;
      
      console.log('🔒 Setup completion result:', {
        hasEssentialInfo,
        setupComplete,
        flagValue: profile.first_time_setup_completed
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
