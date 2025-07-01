
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useDirectGPT4Chat } from '@/hooks/useDirectGPT4Chat';
import { RefreshCw, Sparkles } from 'lucide-react';

export const DirectGPT4ChatInterface: React.FC = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    messagesEndRef,
    user,
    language,
    isRTL,
    theme,
    t,
    handleSendMessage,
    resetChat,
    userProfile
  } = useDirectGPT4Chat();

  const handleSend = () => {
    if (input.trim()) {
      handleSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-indigo-900/90 border-white/10 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">
                مورفو - مساعدك الذكي
              </CardTitle>
              <div className="text-sm text-blue-300">
                جاهز لمساعدتك في التسويق الرقمي
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetChat}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              إعادة تعيين
            </Button>
          </div>
        </div>

        {userProfile && (
          <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-white/80 text-sm">
              <span className="text-blue-300">مرحباً {userProfile.greeting_preference || 'أستاذ'}</span>
              {userProfile.full_name && (
                <span className="text-white"> {userProfile.full_name}</span>
              )}
              {userProfile.job_title && (
                <span className="text-white/60"> - {userProfile.job_title}</span>
              )}
            </div>
            {userProfile.company_name && (
              <div className="text-white/60 text-xs mt-1">
                {userProfile.company_name} • {userProfile.industry || 'مجال غير محدد'}
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-col h-full p-0">
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            theme={theme}
            isRTL={isRTL}
            thinkingText="مورفو يفكر..."
            onCommandResponse={() => {}}
            language={language}
          />
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          input={input}
          isLoading={isLoading}
          theme={theme}
          isRTL={isRTL}
          placeholder="اكتب رسالتك هنا..."
          onInputChange={setInput}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
          hasTokens={true}
        />
      </CardContent>
    </Card>
  );
};
