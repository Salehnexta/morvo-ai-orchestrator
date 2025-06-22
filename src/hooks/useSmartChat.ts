
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService } from '@/services/userProfileService';

interface SmartChatState {
  isActive: boolean;
  context: any;
  userProfile: any;
  suggestions: string[];
}

export const useSmartChat = () => {
  const { user } = useAuth();
  const [chatState, setChatState] = useState<SmartChatState>({
    isActive: false,
    context: {},
    userProfile: null,
    suggestions: []
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserContext = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Use user_profiles table instead of customer_profiles
        const userProfile = await UserProfileService.getUserProfile(user.id);
        
        if (userProfile) {
          setChatState(prev => ({
            ...prev,
            userProfile,
            context: {
              companyName: userProfile.company_name,
              industry: userProfile.industry,
              marketingGoals: userProfile.primary_marketing_goals,
              greetingPreference: userProfile.greeting_preference
            }
          }));

          // Generate smart suggestions based on profile
          const suggestions = generateSmartSuggestions(userProfile);
          setChatState(prev => ({ ...prev, suggestions }));
        }
      } catch (error) {
        console.error('Error loading user context:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserContext();
  }, [user]);

  const generateSmartSuggestions = (profile: any): string[] => {
    const suggestions = [];

    if (!profile.company_name) {
      suggestions.push('أخبرني عن شركتك');
    }

    if (!profile.industry) {
      suggestions.push('ما هو مجال عملك؟');
    }

    if (!profile.primary_marketing_goals || profile.primary_marketing_goals.length === 0) {
      suggestions.push('ما هي أهدافك التسويقية؟');
    }

    if (!profile.website_url) {
      suggestions.push('هل لديك موقع إلكتروني؟');
    }

    if (!profile.monthly_marketing_budget) {
      suggestions.push('ما هي ميزانيتك التسويقية الشهرية؟');
    }

    // Default suggestions if profile is complete
    if (suggestions.length === 0) {
      suggestions.push(
        'كيف يمكنني تحسين استراتيجيتي التسويقية؟',
        'أريد تحليل منافسيني',
        'اقترح محتوى لوسائل التواصل الاجتماعي',
        'كيف أقيس نجاح حملاتي التسويقية؟'
      );
    }

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  };

  const updateContext = async (newContext: any) => {
    if (!user) return false;

    try {
      // Save updated context to user profile
      await UserProfileService.saveUserProfile(user.id, newContext);
      
      setChatState(prev => ({
        ...prev,
        context: { ...prev.context, ...newContext },
        userProfile: { ...prev.userProfile, ...newContext }
      }));

      return true;
    } catch (error) {
      console.error('Error updating context:', error);
      return false;
    }
  };

  const activateSmartMode = useCallback(() => {
    setChatState(prev => ({ ...prev, isActive: true }));
  }, []);

  const deactivateSmartMode = useCallback(() => {
    setChatState(prev => ({ ...prev, isActive: false }));
  }, []);

  const getContextualPrompt = useCallback((userMessage: string) => {
    const { context } = chatState;
    
    let prompt = `المستخدم يسأل: "${userMessage}"\n\n`;
    
    if (context.companyName) {
      prompt += `اسم الشركة: ${context.companyName}\n`;
    }
    
    if (context.industry) {
      prompt += `المجال: ${context.industry}\n`;
    }
    
    if (context.marketingGoals && context.marketingGoals.length > 0) {
      prompt += `الأهداف التسويقية: ${context.marketingGoals.join(', ')}\n`;
    }
    
    prompt += '\nيرجى تقديم إجابة مخصصة بناءً على هذه المعلومات.';
    
    return prompt;
  }, [chatState]);

  return {
    chatState,
    loading,
    activateSmartMode,
    deactivateSmartMode,
    updateContext,
    getContextualPrompt,
    suggestions: chatState.suggestions,
    isSmartModeActive: chatState.isActive
  };
};
