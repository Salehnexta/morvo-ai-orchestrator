
import React from 'react';
import { ChatInterface } from "@/components/ChatInterface";
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
      {/* Smart Dynamic Sidebar - Left side */}
      <div className="w-80 relative z-10 border-r border-gray-200 dark:border-gray-700">
        <SidebarContentManager 
          lastMessage={lastUserMessage}
          conversationHistory={conversationHistory}
          onActionClick={onContentAction}
        />
      </div>

      {/* Chat Interface - Right side (takes remaining space) */}
      <div className="flex-1 bg-black/30 backdrop-blur-xl border-l border-white/10 relative z-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="relative z-10 h-full">
          <ChatInterface 
            onContentTypeChange={onContentTypeChange}
            onMessageSent={onMessageSent}
          />
        </div>
      </div>
    </>
  );
};
