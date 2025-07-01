
import React from 'react';
import { DirectGPT4ChatInterface } from '@/components/chat/DirectGPT4ChatInterface';
import { DynamicSidebar } from '@/components/DynamicSidebar';
import { SidebarContentManager } from '@/components/sidebar/SidebarContentManager';

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
    <div className="flex w-full min-h-screen relative z-10">
      {/* Dynamic Sidebar */}
      <div className="w-80 flex-shrink-0">
        <DynamicSidebar 
          contentType="chat"
          onContentTypeChange={onContentTypeChange}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2">
            مورفو - المساعد الذكي للتسويق الرقمي
          </h1>
          <p className="text-white/70">
            اسأل مورفو عن أي شيء يتعلق بالتسويق الرقمي والأعمال
          </p>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 p-6">
          <div className="h-full max-w-4xl mx-auto">
            <DirectGPT4ChatInterface />
          </div>
        </div>

        {/* Sidebar Content Manager */}
        <div className="absolute right-0 top-0 h-full w-80 pointer-events-none">
          <SidebarContentManager 
            contentType="chat"
            lastUserMessage={lastUserMessage}
            conversationHistory={conversationHistory}
            onContentAction={onContentAction}
          />
        </div>
      </div>
    </div>
  );
};
