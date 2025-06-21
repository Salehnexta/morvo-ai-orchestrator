
import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardBackground } from './DashboardBackground';
import { OnboardingLayout } from './OnboardingLayout';
import { PostOnboardingLayout } from './PostOnboardingLayout';

interface DashboardLayoutProps {
  isOnboardingComplete: boolean;
  contentType: 'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'connection-test' | 'onboarding' | 'perplexity-test';
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
  const { isRTL } = useLanguage();

  return (
    <div 
      className="h-screen w-full flex relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <DashboardBackground />

      {/* Conditional Layout based on onboarding status */}
      {!isOnboardingComplete ? (
        <OnboardingLayout
          contentType={contentType}
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
