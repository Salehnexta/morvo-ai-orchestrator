import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User, Loader2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MorvoAIService } from "@/services/morvoAIService";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  cost?: number;
  agents_involved?: string[];
}

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: language === 'ar' 
        ? 'مرحباً! أنا مساعدك الذكي في منصة زد. كيف يمكنني مساعدتك في إدارة متجرك الإلكتروني اليوم؟\n\nHello! I\'m your smart assistant at Zid platform. How can I help you manage your online store today?'
        : 'Hello! I\'m your smart assistant at Zid platform. How can I help you manage your online store today?\n\nمرحباً! أنا مساعدك الذكي في منصة زد. كيف يمكنني مساعدتك في إدارة متجرك الإلكتروني اليوم؟',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const content = {
    ar: {
      back: "رجوع",
      masterAgent: "المساعد الذكي",
      clientAgent: "وكيل خدمة العملاء",
      active: "نشط",
      thinking: "المساعد الذكي يفكر...",
      placeholder: "اكتب رسالتك بالعربية أو الإنجليزية..."
    },
    en: {
      back: "Back",
      masterAgent: "Smart Assistant",
      clientAgent: "Customer Service Agent",
      active: "Active",
      thinking: "Smart Assistant is thinking...",
      placeholder: "Type your message in Arabic or English..."
    }
  };

  const t = content[language];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to Morvo AI:', input);
      const response = await MorvoAIService.sendMessage(input);
      
      console.log('Morvo AI response:', response);

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: response.processing_time,
        cost: response.cost_tracking?.total_cost,
        agents_involved: response.agents_involved
      };

      setMessages(prev => [...prev, agentMessage]);

      if (response.processing_time) {
        toast({
          title: "Response Generated",
          description: `Processed in ${response.processing_time}s${response.cost_tracking?.total_cost ? ` - Cost: $${response.cost_tracking.total_cost.toFixed(4)}` : ''}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.\n\nSorry, there was a connection error. Please try again.',
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to Morvo AI. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
        : 'bg-gradient-to-br from-white via-blue-50 to-purple-50'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`backdrop-blur-sm border-b p-4 ${
        theme === 'dark' 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className={`max-w-4xl mx-auto flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className={`${isRTL ? 'flex-row-reverse' : ''} ${
              theme === 'dark' 
                ? 'text-white hover:bg-white/10' 
                : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.back}
          </Button>
          
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.masterAgent}
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                {t.clientAgent}
              </p>
            </div>
          </div>

          <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-2`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`${
                theme === 'dark' 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                {t.active}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' 
                    ? isRTL ? 'justify-start' : 'justify-end'
                    : isRTL ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'agent' && !isRTL && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : theme === 'dark'
                      ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                      : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                  }`}
                  style={{ direction: 'auto' }}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  
                  <div className={`flex items-center justify-between mt-2 pt-2 border-t text-xs ${
                    message.sender === 'user'
                      ? 'border-white/20 text-white/70'
                      : theme === 'dark'
                      ? 'border-white/10 text-white/60'
                      : 'border-gray-200 text-gray-500'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.processing_time && (
                      <span>{message.processing_time}s</span>
                    )}
                    {message.cost && (
                      <span>${message.cost.toFixed(4)}</span>
                    )}
                  </div>
                </div>

                {message.sender === 'user' && isRTL && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    theme === 'dark' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    <User className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                )}

                {message.sender === 'agent' && isRTL && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                {message.sender === 'user' && !isRTL && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    theme === 'dark' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    <User className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className={`flex gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                {!isRTL && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${
                    theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.thinking}</span>
                  </div>
                </div>
                {isRTL && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className={`backdrop-blur-sm border-t p-4 ${
        theme === 'dark' 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className={`max-w-4xl mx-auto flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            className={`flex-1 ${
              theme === 'dark' 
                ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
            } ${isRTL ? 'text-right' : 'text-left'}`}
            disabled={isLoading}
            dir="auto"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
