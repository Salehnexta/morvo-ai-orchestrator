
import React from 'react';
import { UnifiedChatInterface } from "@/components/UnifiedChatInterface";
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
      {/* Chat Panel - Left side with improved visibility */}
      <div className="w-1/2 bg-gray-900/85 backdrop-blur-md border-r border-white/10 relative z-10 shadow-xl">
        <div className="relative z-10 h-full">
          <UnifiedChatInterface 
            onContentTypeChange={onContentTypeChange}
            onMessageSent={onMessageSent}
          />
        </div>
      </div>

      {/* Dynamic Content Panel - Right side with better contrast */}
      <div className="w-1/2 relative z-10">
        <div className="relative z-10 h-full bg-gray-800/90 backdrop-blur-sm">
          {showOnboarding && contentType === 'onboarding' ? (
            <div className="h-full p-6 overflow-y-auto bg-gray-900/50 rounded-lg">
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
