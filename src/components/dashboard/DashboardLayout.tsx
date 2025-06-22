
import React from 'react';
import { DashboardBackground } from './DashboardBackground';
import { OnboardingLayout } from './OnboardingLayout';
import { PostOnboardingLayout } from './PostOnboardingLayout';
import { useUserGreeting } from '@/hooks/useUserGreeting';

interface DashboardLayoutProps {
  isOnboardingComplete: boolean;
  contentType: string;
  showOnboarding: boolean;
  lastUserMessage: string;
  conversationHistory: string[];
  onContentTypeChange: (type: string) => void;
  onMessageSent: (message: string) => void;
  onPhaseComplete: (phase: string) => void;
  onContentAction: (action: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  isOnboardingComplete,
  contentType,
  showOnboarding,
  lastUserMessage,
  conversationHistory,
  onContentTypeChange,
  onMessageSent,
  onPhaseComplete,
  onContentAction
}) => {
  const { fullGreeting, displayName, loading: greetingLoading } = useUserGreeting();

  return (
    <div className="min-h-screen">
      <DashboardBackground />
      
      {showOnboarding ? (
        <OnboardingLayout 
          contentType={contentType as any}
          showOnboarding={showOnboarding}
          onContentTypeChange={onContentTypeChange}
          onMessageSent={onMessageSent}
          onPhaseComplete={onPhaseComplete}
          onContentAction={onContentAction}
        />
      ) : (
        <PostOnboardingLayout
          lastUserMessage={lastUserMessage}
          conversationHistory={conversationHistory}
          onContentTypeChange={onContentTypeChange}
          onMessageSent={onMessageSent}
          onContentAction={onContentAction}
        />
      )}
    </div>
  );
};
