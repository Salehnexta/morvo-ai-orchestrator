
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Plus, Paperclip } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSmartChat } from '@/hooks/useSmartChat';

interface EnhancedChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder
}) => {
  const { language, isRTL } = useLanguage();
  const { processMessage, getProfileCompleteness, getMissingFields } = useSmartChat();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const content = {
    ar: {
      placeholder: placeholder || 'اكتب رسالتك هنا...',
      send: 'إرسال',
      listening: 'جاري الاستماع...',
      voiceInput: 'إدخال صوتي',
      attach: 'إرفاق ملف',
      suggestions: 'اقتراحات'
    },
    en: {
      placeholder: placeholder || 'Type your message here...',
      send: 'Send',
      listening: 'Listening...',
      voiceInput: 'Voice input',
      attach: 'Attach file',
      suggestions: 'Suggestions'
    }
  };

  const t = content[language];

  const handleSend = async () => {
    if (message.trim()) {
      // Process the message for data extraction
      await processMessage(message);
      
      // Send the message
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const getSuggestions = () => {
    const missingFields = getMissingFields();
    const completeness = getProfileCompleteness();
    
    if (completeness < 50) {
      const suggestions = {
        ar: [
          'أخبرني عن شركتك',
          'ما هي أهدافك التسويقية؟',
          'من هو جمهورك المستهدف؟'
        ],
        en: [
          'Tell me about your company',
          'What are your marketing goals?',
          'Who is your target audience?'
        ]
      };
      return suggestions[language];
    }
    
    return [];
  };

  const suggestions = getSuggestions();

  return (
    <div className="space-y-3">
      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setMessage(suggestion)}
              className="text-xs bg-blue-500/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        {/* Additional Actions */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={startVoiceInput}
            className={`text-gray-400 hover:text-white hover:bg-white/10 ${isListening ? 'text-red-400' : ''}`}
            disabled={isListening}
          >
            <Mic className="w-4 h-4" />
          </Button>
        </div>

        {/* Text Input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          placeholder={isListening ? t.listening : t.placeholder}
          disabled={disabled || isListening}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-400"
          dir={isRTL ? 'rtl' : 'ltr'}
        />

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim() || isListening}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
