
import { useState } from 'react';
import { SimpleRailwayAuth } from '@/services/simpleRailwayAuth';
import { UserProfileService } from '@/services/userProfileService';
import { SERankingService } from '@/services/seRankingService';

interface MessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  tokens_used?: number;
  metadata?: any;
}

export const useChatMessageHandler = (
  user: any,
  userProfile: any,
  messages: MessageData[],
  setMessages: (messages: MessageData[] | ((prev: MessageData[]) => MessageData[])) => void,
  setIsConnected: (connected: boolean) => void,
  emotionalContext: any,
  conversationState: any,
  enhanceConversation: any,
  generateContextualResponse: (message: string) => Promise<string>,
  extractUrlFromMessage: (message: string) => string | null,
  toast: any,
  language: string,
  runDiagnostics: () => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (
    messageText: string,
    onMessageSent?: (message: string) => void,
    handleSidebarContentChange?: (message: string) => void,
    onContentTypeChange?: (type: string) => void,
    setProcessingStatus?: (status: 'idle' | 'sending' | 'diagnosing') => void
  ) => {
    if (!messageText.trim() || !user || isLoading) {
      return;
    }

    const userMessage: MessageData = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setProcessingStatus?.('sending');

    onMessageSent?.(messageText);
    handleSidebarContentChange?.(messageText);

    try {
      // Handle website URL analysis if provided
      const websiteUrl = extractUrlFromMessage(messageText);
      if (websiteUrl && (!userProfile?.website_url || userProfile.website_url !== websiteUrl)) {
        console.log('🔍 New website detected, analyzing...');
        await UserProfileService.saveUserProfile(user.id, { website_url: websiteUrl });
        await SERankingService.updateUserSeoData(user.id, websiteUrl);
      }

      // Handle profile updates for onboarding
      if (!userProfile?.onboarding_completed) {
        if (!userProfile?.company_name && messageText.trim()) {
          await UserProfileService.saveUserProfile(user.id, { 
            company_name: messageText.trim() 
          });
        }
      }

      // Enhanced message sending with auto-retry
      const context = {
        conversation_history: messages.slice(-3).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        user_profile: userProfile,
        emotional_context: emotionalContext,
        conversation_state: conversationState,
        user_id: user.id
      };

      const railwayResponse = await SimpleRailwayAuth.sendMessage(messageText, context);
      
      let botResponse: string;
      let processingTime: number = 0;
      let tokensUsed: number = 0;

      if (railwayResponse.success) {
        botResponse = railwayResponse.message;
        processingTime = railwayResponse.processing_time_ms || 0;
        tokensUsed = railwayResponse.tokens_used || 0;
        setIsConnected(true);
        
        console.log('✅ Railway authenticated response received', {
          processingTime,
          tokensUsed,
          conversationId: railwayResponse.conversation_id
        });
        
      } else {
        console.warn('⚠️ Railway service failed, using local response:', railwayResponse.error);
        
        // If it's a 422 error, suggest running diagnostics
        if (railwayResponse.error?.includes('422') || railwayResponse.error?.includes('Unprocessable')) {
          toast({
            title: language === 'ar' ? 'خطأ في التنسيق' : 'Format Error',
            description: language === 'ar' 
              ? 'تشغيل التشخيص التلقائي...'
              : 'Running automatic diagnostics...',
            variant: "destructive",
          });
          
          // Auto-run diagnostics on 422 errors
          setTimeout(() => runDiagnostics(), 1000);
        }
        
        botResponse = await generateContextualResponse(messageText);
        processingTime = 150;
        setIsConnected(false);
      }

      // Enhance the conversation
      const enhancement = await enhanceConversation(messageText, botResponse);
      
      const botMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: enhancement.personalizedResponse,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: processingTime,
        tokens_used: tokensUsed,
        metadata: {
          contextualInsights: enhancement.contextualInsights,
          emotionalContext: emotionalContext,
          isAuthenticated: railwayResponse.success,
          endpointUsed: railwayResponse.success ? 'railway_auth' : 'local_fallback',
          processingSteps: ['sent', 'processed', 'enhanced']
        }
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle sidebar content changes
      if (onContentTypeChange) {
        const lowerMessage = messageText.toLowerCase();
        if (lowerMessage.includes('تحليل') || lowerMessage.includes('افحص') || lowerMessage.includes('موقع')) {
          onContentTypeChange('analytics');
        } else if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشور') || lowerMessage.includes('كتابة')) {
          onContentTypeChange('content-creator');
        } else if (lowerMessage.includes('حملة') || lowerMessage.includes('إعلان') || lowerMessage.includes('تسويق')) {
          onContentTypeChange('campaign');
        } else if (lowerMessage.includes('جدولة') || lowerMessage.includes('تاريخ') || lowerMessage.includes('موعد')) {
          onContentTypeChange('calendar');
        }
      }

      // Success notification
      if (railwayResponse.success && processingTime > 0) {
        toast({
          title: language === 'ar' ? 'تم بنجاح!' : 'Success!',
          description: language === 'ar' 
            ? `تمت المعالجة في ${processingTime}ms` 
            : `Processed in ${processingTime}ms`,
          variant: "default",
        });
      }

    } catch (error) {
      console.error('❌ Chat error:', error);
      
      const errorMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? 'أعتذر، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى أو تشغيل التشخيص.' 
          : 'Sorry, a temporary error occurred. Please try again or run diagnostics.',
        sender: 'agent',
        timestamp: new Date(),
        metadata: {
          isError: true,
          errorHandled: true
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);

      toast({
        title: language === 'ar' ? 'خطأ مؤقت' : 'Temporary Error',
        description: language === 'ar' 
          ? 'يرجى المحاولة مرة أخرى أو تشغيل التشخيص'
          : 'Please try again or run diagnostics',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProcessingStatus?.('idle');
    }
  };

  return {
    isLoading,
    handleSendMessage
  };
};
