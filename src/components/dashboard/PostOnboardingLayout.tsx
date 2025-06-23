
import React from 'react';
import { UnifiedChatInterface } from "@/components/UnifiedChatInterface";
import { SidebarContentManager } from "@/components/sidebar/SidebarContentManager";

interface PostOnboardingLayoutProps {
  lastUserMessage: string;
  conversationHistory: string[];
  onContentTypeChange: (type: string) => void;
  onMessageSent: (message: string) => void;
  onContentAction: (action: string) => void;
}

export const PostOnboardingLayout: React.FC<PostOnboardingLayoutProps> = ({
  lastUserMessage,
  conversationHistory,
  onContentTypeChange,
  onMessageSent,
  onContentAction
}) => {
  return (
    <>
      {/* Smart Dynamic Sidebar - 60% width */}
      <div className="w-[60%] relative z-10 border-r border-gray-200 dark:border-gray-700">
        <SidebarContentManager 
          lastMessage={lastUserMessage}
          conversationHistory={conversationHistory}
          onActionClick={onContentAction}
        />
      </div>

      {/* Chat Interface - 40% width */}
      <div className="w-[40%] bg-black/30 backdrop-blur-xl border-l border-white/10 relative z-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="relative z-10 h-full">
          <UnifiedChatInterface 
            onContentTypeChange={onContentTypeChange}
            onMessageSent={onMessageSent}
          />
        </div>
      </div>
    </>
  );
};
