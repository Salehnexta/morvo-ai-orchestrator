
import React from 'react';
import { ChatInterface } from "@/components/ChatInterface";
import { DynamicContentPanel } from "@/components/DynamicContentPanel";
import { JourneyPhaseHandler } from "@/components/onboarding/JourneyPhaseHandler";
import { PerplexityTest } from "@/components/PerplexityTest";

interface OnboardingLayoutProps {
  contentType: 'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'connection-test' | 'onboarding' | 'perplexity-test';
  showOnboarding: boolean;
  onContentTypeChange: (type: string) => void;
  onMessageSent: (message: string) => void;
  onPhaseComplete: (phase: string) => void;
  onContentAction: (action: string) => void;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  contentType,
  showOnboarding,
  onContentTypeChange,
  onMessageSent,
  onPhaseComplete,
  onContentAction
}) => {
  return (
    <>
      {/* Chat Panel - Left side with Journey integration */}
      <div className="w-1/2 bg-black/30 backdrop-blur-xl border-r border-white/10 relative z-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="relative z-10 h-full">
          <ChatInterface 
            onContentTypeChange={onContentTypeChange}
            onMessageSent={onMessageSent}
          />
        </div>
      </div>

      {/* Dynamic Content Panel - Right side */}
      <div className="w-1/2 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent"></div>
        <div className="relative z-10 h-full bg-white/5 backdrop-blur-sm">
          {showOnboarding && contentType === 'onboarding' ? (
            <div className="h-full p-6 overflow-y-auto">
              <JourneyPhaseHandler 
                onPhaseComplete={onPhaseComplete}
                className="max-w-2xl mx-auto"
              />
            </div>
          ) : contentType === 'perplexity-test' ? (
            <div className="h-full p-6 overflow-y-auto">
              <PerplexityTest />
            </div>
          ) : (
            <DynamicContentPanel 
              contentType={contentType}
              onActionClick={onContentAction}
            />
          )}
        </div>
      </div>
    </>
  );
};
