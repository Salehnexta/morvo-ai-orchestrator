
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useAuthCheck } from '@/hooks/useAuthCheck';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const { user, session, loading } = useAuth();
  const { isChecking, debugInfo } = useAuthCheck(redirectTo);

  // Show loading state while checking authentication or setup status
  if (loading || isChecking) {
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
