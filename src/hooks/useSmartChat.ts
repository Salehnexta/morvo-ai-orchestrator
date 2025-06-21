import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationalOnboarding } from '@/services/conversationalOnboarding';
import { SmartResponseGenerator } from '@/services/smartResponseGenerator';

interface OnboardingData {
  [key: string]: any;
}

export const useSmartChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const processOnboardingMessage = useCallback(async (message: string) => {
    if (!user?.id) return null;

    try {
      // Get current onboarding state
      const nextQuestion = ConversationalOnboarding.getNextQuestion(onboardingData);
      
      if (!nextQuestion) return null;

      // Extract answer from message
      const answer = ConversationalOnboarding.extractAnswerFromText(message, nextQuestion);
      
      if (answer) {
        const updatedData = {
          ...onboardingData,
          [nextQuestion.field]: answer
        };
        
        setOnboardingData(updatedData);

        // Save to database incrementally
        await saveOnboardingProgress(updatedData);

        // Check if onboarding is complete
        if (ConversationalOnboarding.isOnboardingComplete(updatedData)) {
          await completeOnboarding(updatedData);
          return {
            isComplete: true,
            response: nextQuestion.field === 'completed' ? nextQuestion.question : 
              'ممتاز! تم حفظ إجابتك. ' + ConversationalOnboarding.getNextQuestion(updatedData)?.question
          };
        }

        // Get next question
        const nextQ = ConversationalOnboarding.getNextQuestion(updatedData);
        return {
          isComplete: false,
          response: nextQ ? `ممتاز! تم حفظ إجابتك. ${nextQ.question}` : 
            'شكراً لك! دعني أراجع معلوماتك وسأعود إليك قريباً.'
        };
      }

      return null;
    } catch (error) {
      console.error('Error processing onboarding message:', error);
      return null;
    }
  }, [onboardingData, user?.id]);

  const generateSmartResponse = useCallback(async (
    message: string,
    context: {
      conversationHistory: Array<{ role: string; content: string }>;
      onboardingStatus: any;
      currentPhase: string;
    }
  ) => {
    try {
      setIsLoading(true);
      
      const response = await SmartResponseGenerator.generateResponse({
        userMessage: message,
        conversationHistory: context.conversationHistory,
        onboardingStatus: context.onboardingStatus,
        currentPhase: context.currentPhase
      });
      
      return response;
    } catch (error) {
      console.error('Error generating smart response:', error);
      return {
        response: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        suggestedActions: []
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveOnboardingProgress = useCallback(async (data: OnboardingData) => {
    if (!user?.id) return false;

    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) return false;

      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: user.id,
          client_id: clientData.id,
          profile_data: {
            ...data,
            onboarding_started: true,
            last_updated: new Date().toISOString()
          },
          status: 'active',
          updated_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      return false;
    }
  }, [user?.id]);

  const completeOnboarding = useCallback(async (data: OnboardingData) => {
    if (!user?.id) return false;

    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) return false;

      const profileData = ConversationalOnboarding.formatProfileData(data);
      
      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: user.id,
          client_id: clientData.id,
          profile_data: profileData,
          status: 'active',
          updated_at: new Date().toISOString()
        });

      if (!error) {
        toast({
          title: "مبروك!",
          description: "تم إكمال إعداد ملفك الشخصي بنجاح",
        });
      }

      return !error;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }, [user?.id, toast]);

  const getOnboardingProgress = useCallback(() => {
    const totalQuestions = 7; // Excluding welcome and completion
    const answeredQuestions = Object.keys(onboardingData).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }, [onboardingData]);

  const isOnboardingMessage = useCallback((message: string) => {
    // Simple heuristics to detect onboarding-related messages
    const onboardingKeywords = [
      'شركت', 'مشروع', 'قطاع', 'موظف', 'ميزانية', 'هدف', 'جمهور', 'خبرة',
      'company', 'business', 'industry', 'budget', 'goal', 'audience', 'experience'
    ];
    
    return onboardingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }, []);

  return {
    isLoading,
    processOnboardingMessage,
    generateSmartResponse,
    getOnboardingProgress,
    isOnboardingMessage,
    onboardingData,
    setOnboardingData
  };
};
