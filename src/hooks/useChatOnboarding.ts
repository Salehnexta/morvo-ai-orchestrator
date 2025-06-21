
import { useState, useEffect } from 'react';
import { OnboardingService, OnboardingQuestion } from '@/services/onboardingService';
import { useAuth } from '@/contexts/AuthContext';

export const useChatOnboarding = () => {
  const { user } = useAuth();
  const [onboardingQuestions, setOnboardingQuestions] = useState<OnboardingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    loadOnboardingQuestions();
  }, []);

  const loadOnboardingQuestions = async () => {
    try {
      const response = await OnboardingService.getOnboardingQuestions();
      setOnboardingQuestions(response.questions || []);
    } catch (error) {
      console.error('Failed to load onboarding questions:', error);
      setOnboardingQuestions([]); // Set empty array as fallback
    }
  };

  const startOnboarding = () => {
    setIsOnboardingActive(true);
    setCurrentQuestionIndex(0);
  };

  const getCurrentQuestion = (): OnboardingQuestion | null => {
    if (!isOnboardingActive || !onboardingQuestions || currentQuestionIndex >= onboardingQuestions.length) {
      return null;
    }
    return onboardingQuestions[currentQuestionIndex];
  };

  const answerCurrentQuestion = async (answer: string): Promise<boolean> => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion || !user) return false;

    // Save answer locally
    setOnboardingAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    // Save to backend
    const saved = await OnboardingService.saveOnboardingProgress(
      user.id,
      currentQuestion.id,
      answer
    );

    if (saved) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Check if onboarding is complete
      if (currentQuestionIndex + 1 >= (onboardingQuestions?.length || 0)) {
        setIsOnboardingActive(false);
      }
    }

    return saved;
  };

  const skipCurrentQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    if (currentQuestionIndex + 1 >= (onboardingQuestions?.length || 0)) {
      setIsOnboardingActive(false);
    }
  };

  const getOnboardingProgress = () => {
    if (!onboardingQuestions || onboardingQuestions.length === 0) return 0;
    return Math.round((currentQuestionIndex / onboardingQuestions.length) * 100);
  };

  const isOnboardingComplete = () => {
    return currentQuestionIndex >= (onboardingQuestions?.length || 0);
  };

  return {
    onboardingQuestions: onboardingQuestions || [],
    currentQuestion: getCurrentQuestion(),
    isOnboardingActive,
    onboardingAnswers,
    startOnboarding,
    answerCurrentQuestion,
    skipCurrentQuestion,
    getOnboardingProgress,
    isOnboardingComplete,
    currentQuestionIndex,
    totalQuestions: onboardingQuestions?.length || 0
  };
};
