
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OnboardingQuestion } from '@/services/onboardingService';

interface OnboardingMessageProps {
  question: OnboardingQuestion;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  theme: 'light' | 'dark';
  isRTL: boolean;
  progress: number;
  currentIndex: number;
  totalQuestions: number;
}

export const OnboardingMessage = ({
  question,
  onAnswer,
  onSkip,
  theme,
  isRTL,
  progress,
  currentIndex,
  totalQuestions
}: OnboardingMessageProps) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  const handleOptionSelect = (value: string) => {
    onAnswer(value);
  };

  return (
    <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'} direction-${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-blue-200">
          <span>سؤال {currentIndex + 1} من {totalQuestions}</span>
          <span>%{progress}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className={`p-4 rounded-xl ${
        theme === 'dark' 
          ? 'bg-blue-900/30 border border-blue-400/30' 
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <h3 className="text-lg font-semibold text-blue-200 mb-3">
          {question.question}
        </h3>

        {/* Answer input based on question type */}
        {question.type === 'text' && (
          <div className="space-y-3">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="اكتب إجابتك هنا..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              dir={isRTL ? 'rtl' : 'ltr'}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={onSkip}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
              >
                تخطي
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        {question.type === 'choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                {option.label}
              </Button>
            ))}
            <div className="flex justify-end mt-3">
              <Button
                onClick={onSkip}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
              >
                تخطي
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
