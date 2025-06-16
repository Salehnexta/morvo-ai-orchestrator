
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TokenUsage } from "@/services/tokenService";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  theme: string;
  isRTL: boolean;
  placeholder: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  tokenUsage?: TokenUsage | null;
}

export const ChatInput = ({ 
  input, 
  isLoading, 
  theme, 
  isRTL, 
  placeholder, 
  onInputChange, 
  onSend, 
  onKeyPress,
  tokenUsage 
}: ChatInputProps) => {
  const isDisabled = isLoading || (tokenUsage?.isLimitReached ?? false);

  return (
    <div className={`p-4 border-t backdrop-blur-lg bg-black/5 ${
      theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {tokenUsage?.isLimitReached && (
          <div className="mb-3 p-3 rounded-lg bg-red-100 border border-red-200 text-red-800 text-sm">
            {tokenUsage.accountType === 'guest' 
              ? "تم استنفاد التوكنز التجريبية. أنشئ حساباً مجانياً للحصول على 5000 توكن شهرياً!"
              : "تم استنفاد التوكنز الشهرية. ترقية للحساب المدفوع للحصول على توكنز غير محدودة."
            }
          </div>
        )}
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={isDisabled ? "تم الوصول للحد الأقصى من التوكنز..." : placeholder}
            disabled={isDisabled}
            className={`flex-1 min-h-[60px] max-h-[200px] resize-none rounded-xl border transition-all ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={onSend}
            disabled={isDisabled || !input.trim()}
            className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {tokenUsage && !tokenUsage.isLimitReached && tokenUsage.remainingTokens < 500 && (
          <div className="mt-2 text-sm text-yellow-600">
            تحذير: {tokenUsage.remainingTokens} توكن متبقي فقط
          </div>
        )}
      </div>
    </div>
  );
};
