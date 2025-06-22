
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

  useEffect(() => {
    console.log('🔒 ProtectedRoute check:', { 
      user: !!user, 
      session: !!session, 
      loading, 
      path: location.pathname,
      userId: user?.id,
      userEmail: user?.email
    });
    
    if (!loading && (!user || !session)) {
      console.log('🔒 Redirecting to login - no authentication');
      navigate(redirectTo, { replace: true });
      return;
    }

    // Check if user needs first-time setup (only if authenticated and not already on setup page)
    if (user && session && location.pathname !== '/first-time-setup') {
      checkFirstTimeSetup();
    } else {
      setCheckingSetup(false);
    }
  }, [user, session, loading, navigate, redirectTo, location.pathname]);

  const checkFirstTimeSetup = async () => {
    if (!user) {
      console.log('🔒 No user found, stopping setup check');
      setCheckingSetup(false);
      return;
    }

    try {
      console.log('🔒 Checking first-time setup for user:', user.email, 'ID:', user.id);
      const profile = await UserProfileService.getUserProfile(user.id);
      
      console.log('🔒 User profile check result:', { 
        profileExists: !!profile, 
        setupCompleted: profile?.first_time_setup_completed,
        completenessScore: profile?.data_completeness_score,
        companyName: profile?.company_name,
        greetingPreference: profile?.greeting_preference,
        fullProfile: profile
      });
      
      // Calculate completeness score if not already calculated
      let completenessScore = profile?.data_completeness_score || 0;
      if (profile && !completenessScore) {
        completenessScore = await UserProfileService.calculateCompleteness(profile);
        console.log('🔒 Calculated completeness score:', completenessScore);
      }
      
      // If no profile exists OR setup not completed OR completeness is too low, redirect to first-time setup
      const minimumCompleteness = 50; // Require at least 50% completeness
      const needsSetup = !profile || 
                        profile.first_time_setup_completed !== true || 
                        completenessScore < minimumCompleteness;
      
      if (needsSetup) {
        console.log('🔒 Redirecting to first-time setup - reasons:', {
          noProfile: !profile,
          setupNotCompleted: profile?.first_time_setup_completed !== true,
          lowCompleteness: completenessScore < minimumCompleteness,
          currentCompleteness: completenessScore,
          minimumRequired: minimumCompleteness
        });
        navigate('/first-time-setup', { replace: true });
        return;
      }
      
      console.log('🔒 Setup complete - allowing access to protected route');
    } catch (error) {
      console.error('🔒 Error checking first-time setup:', error);
      // On error, redirect to setup to be safe
      console.log('🔒 Error occurred, redirecting to setup as fallback');
      navigate('/first-time-setup', { replace: true });
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
