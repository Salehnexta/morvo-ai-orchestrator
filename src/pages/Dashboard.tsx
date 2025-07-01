import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useDirectGPT4Chat } from '@/hooks/useDirectGPT4Chat';

const Dashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { theme } = useTheme();
  
  // Use the GPT-4 chat hook for messaging functionality
  const {
    messages,
    handleSendMessage,
    isLoading,
    resetChat
  } = useDirectGPT4Chat();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Convert messages to conversation history for the layout
  const conversationHistory = messages.map(msg => msg.content);
  const lastUserMessage = messages.filter(msg => msg.sender === 'user').pop()?.content || '';

  const handleMessageSent = (message: string) => {
    handleSendMessage(message);
  };

  const handleContentTypeChange = (type: string) => {
    // Keep existing functionality
    console.log('Content type changed to:', type);
  };

  const handlePhaseComplete = (phase: string) => {
    // Keep existing functionality
    console.log('Phase completed:', phase);
  };

  const handleContentAction = (action: string) => {
    // Keep existing functionality
    console.log('Content action:', action);
  };

  return (
    <DashboardLayout
      isOnboardingComplete={true}
      contentType="chat"
      showOnboarding={false}
      lastUserMessage={lastUserMessage}
      conversationHistory={conversationHistory}
      onContentTypeChange={handleContentTypeChange}
      onMessageSent={handleMessageSent}
      onPhaseComplete={handlePhaseComplete}
      onContentAction={handleContentAction}
    />
  );
};

export default Dashboard;
