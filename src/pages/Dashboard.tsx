
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJourney } from '@/contexts/JourneyContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">جاري التحميل...</div>
      </div>
    );
  }

  const handlePhaseComplete = (phase: string) => {
    console.log('Phase completed:', phase);
  };

  const dashboardProps = {
    isOnboardingComplete,
    contentType: 'onboarding' as const,
    showOnboarding: !isOnboardingComplete,
    lastUserMessage: '',
    conversationHistory: [],
    onContentTypeChange: () => {},
    onMessageSent: () => {},
    onPhaseComplete: handlePhaseComplete,
    onContentAction: () => {}
  };

  return (
    <DashboardLayout {...dashboardProps}>
      {isOnboardingComplete ? (
        <PostOnboardingLayout
          lastUserMessage=""
          conversationHistory={[]}
          onContentTypeChange={() => {}}
          onMessageSent={() => {}}
          onContentAction={() => {}}
        />
      ) : (
        <OnboardingLayout
          contentType="onboarding"
          showOnboarding={true}
          onContentTypeChange={() => {}}
          onMessageSent={() => {}}
          onPhaseComplete={handlePhaseComplete}
          onContentAction={() => {}}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
