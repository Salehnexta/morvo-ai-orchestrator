
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJourney } from '@/contexts/JourneyContext';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { OnboardingLayout } from '@/components/dashboard/OnboardingLayout';
import { PostOnboardingLayout } from '@/components/dashboard/PostOnboardingLayout';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    isOnboardingComplete, 
    loading,
    startJourney
  } = useJourney();

  useEffect(() => {
    if (user && !loading && !isOnboardingComplete) {
      // Start journey for new users
      startJourney();
    }
  }, [user, loading, isOnboardingComplete, startJourney]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const handlePhaseComplete = (phase: string) => {
    console.log('Phase completed:', phase);
  };

  const handleContentTypeChange = (type: string) => {
    console.log('Content type changed:', type);
  };

  const handleMessageSent = (message: string) => {
    console.log('Message sent:', message);
  };

  const handleContentAction = (action: string) => {
    console.log('Content action:', action);
  };

  return (
    <div className="min-h-screen flex">
      <DashboardBackground />
      
      {!isOnboardingComplete ? (
        <OnboardingLayout
          contentType="onboarding"
          showOnboarding={true}
          onContentTypeChange={handleContentTypeChange}
          onMessageSent={handleMessageSent}
          onPhaseComplete={handlePhaseComplete}
          onContentAction={handleContentAction}
        />
      ) : (
        <PostOnboardingLayout
          lastUserMessage=""
          conversationHistory={[]}
          onContentTypeChange={handleContentTypeChange}
          onMessageSent={handleMessageSent}
          onContentAction={handleContentAction}
        />
      )}
    </div>
  );
};

export default Dashboard;
