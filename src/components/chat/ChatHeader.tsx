import { Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "./ConnectionStatus";
import { TokenUsage } from "@/services/tokenService";

interface ChatHeaderProps {
  theme: "dark" | "light";
  isRTL: boolean;
  content: any;
  isConnecting: boolean;
  onToggleTheme: () => void;
  tokenUsage?: TokenUsage | null;
}

export const ChatHeader = ({ theme, isRTL, content, isConnecting, onToggleTheme, tokenUsage }: ChatHeaderProps) => {
  return (
    <div className={`p-4 border-b backdrop-blur-lg bg-black/10 ${
      theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {content.masterAgent}
            </h2>
            <ConnectionStatus isConnecting={isConnecting} theme={theme} content={content} />
          </div>
          
          <div className="flex items-center gap-2">
            {tokenUsage && (
              <div className={`px-3 py-1 rounded-full text-sm ${
                tokenUsage.isLimitReached 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : tokenUsage.remainingTokens < 1000
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {tokenUsage.accountType === 'guest' 
                  ? `تجريبي: ${tokenUsage.remainingTokens} توكن متبقي`
                  : `حساب مجاني: ${tokenUsage.remainingTokens} توكن متبقي`
                }
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              className={`${
                theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
