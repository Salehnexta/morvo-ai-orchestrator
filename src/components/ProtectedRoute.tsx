
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
      
      // Debug the profile status
      await UserProfileService.debugUserProfile(user.id);
      
      const profile = await UserProfileService.getUserProfile(user.id);
      
      console.log('🔒 User profile check result:', { 
        profileExists: !!profile, 
        setupCompleted: profile?.first_time_setup_completed,
        onboardingCompleted: profile?.onboarding_completed,
        completenessScore: profile?.data_completeness_score,
        companyName: profile?.company_name,
        greetingPreference: profile?.greeting_preference,
        marketingExperience: profile?.marketing_experience,
        monthlyBudget: profile?.monthly_marketing_budget,
        fullProfile: profile
      });
      
      if (!profile) {
        console.log('🔒 No profile found - redirecting to first-time setup');
        navigate('/first-time-setup', { replace: true });
        return;
      }

      // Calculate completeness score if not already calculated
      let completenessScore = profile?.data_completeness_score || 0;
      if (!completenessScore) {
        completenessScore = await UserProfileService.calculateCompleteness(profile);
        console.log('🔒 Calculated completeness score:', completenessScore);
      }
      
      // Check if setup is truly complete
      const hasEssentialInfo = profile.company_name && 
                              profile.industry && 
                              profile.marketing_experience && 
                              profile.monthly_marketing_budget;
      
      const setupComplete = profile.first_time_setup_completed === true && hasEssentialInfo;
      
      console.log('🔒 Setup completion check:', {
        first_time_setup_completed: profile.first_time_setup_completed,
        hasEssentialInfo,
        setupComplete,
        completenessScore,
        company_name: profile.company_name,
        industry: profile.industry,
        marketing_experience: profile.marketing_experience,
        monthly_marketing_budget: profile.monthly_marketing_budget
      });
      
      if (!setupComplete) {
        console.log('🔒 Setup not complete - redirecting to first-time setup');
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
