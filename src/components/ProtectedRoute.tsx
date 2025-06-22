
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
    console.log('🔒 ProtectedRoute check:', { user: !!user, session: !!session, loading });
    
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
    if (!user) return;

    try {
      const profile = await UserProfileService.getUserProfile(user.id);
      
      // If no profile exists or setup not completed, redirect to first-time setup
      if (!profile || !profile.first_time_setup_completed) {
        console.log('🔒 Redirecting to first-time setup');
        navigate('/first-time-setup', { replace: true });
        return;
      }
    } catch (error) {
      console.error('Error checking first-time setup:', error);
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
    return null;
  }

  // Render children when authenticated and setup is complete
  return <>{children}</>;
};
