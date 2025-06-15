
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sun, Moon } from "lucide-react";
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
  onDashboardUpdate?: (data: any) => void;
}

export const ChatInterface = ({ onBack, onDashboardUpdate }: ChatInterfaceProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: language === 'ar' 
        ? 'انا مورفر وابشرك وصلت خير ...... راح اكون موظفك المسؤل عن التسويق'
        : 'Hello! I\'m your smart assistant at Zid platform. I can help you analyze data and create reports and charts. Try asking me about sales or analytics!',
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
      masterAgent: "المساعد الذكي",
      clientAgent: "وكيل خدمة العملاء",
      active: "نشط",
      thinking: "المساعد الذكي يفكر...",
      placeholder: "اكتب رسالتك بالعربية أو الإنجليزية..."
    },
    en: {
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

  const analyzeMessageForDashboard = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword analysis to determine chart type
    if (lowerMessage.includes('sales') || lowerMessage.includes('مبيعات')) {
      return {
        chartType: 'bar',
        title: 'Sales Analytics',
        data: [
          { month: "Jan", sales: 4000 },
          { month: "Feb", sales: 3000 },
          { month: "Mar", sales: 2000 },
          { month: "Apr", sales: 2780 },
          { month: "May", sales: 1890 },
          { month: "Jun", sales: 2390 },
        ]
      };
    } else if (lowerMessage.includes('trend') || lowerMessage.includes('اتجاه')) {
      return {
        chartType: 'line',
        title: 'Trend Analysis',
        data: [
          { month: "Jan", sales: 2000 },
          { month: "Feb", sales: 2200 },
          { month: "Mar", sales: 2800 },
          { month: "Apr", sales: 3200 },
          { month: "May", sales: 3800 },
          { month: "Jun", sales: 4200 },
        ]
      };
    } else if (lowerMessage.includes('distribution') || lowerMessage.includes('توزيع')) {
      return {
        chartType: 'pie',
        title: 'Distribution Analysis',
        data: [
          { name: 'Desktop', value: 400, fill: '#3B82F6' },
          { name: 'Mobile', value: 300, fill: '#10B981' },
          { name: 'Tablet', value: 200, fill: '#F59E0B' },
          { name: 'Other', value: 100, fill: '#EF4444' },
        ]
      };
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Analyze message for dashboard updates
    const dashboardData = analyzeMessageForDashboard(input);
    if (dashboardData && onDashboardUpdate) {
      onDashboardUpdate(dashboardData);
    }

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
    <div className={`h-screen flex flex-col transition-colors duration-300`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`backdrop-blur-sm border-b p-4 ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-gray-800' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-100 border-gray-200'
      }`}>
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.masterAgent}
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                  ? 'text-white hover:bg-gray-800' 
                  : 'text-gray-900 hover:bg-white/50'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.active}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : theme === 'dark'
                      ? 'bg-gray-800 border border-gray-700 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-900 shadow-md'
                  }`}
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  
                  <div className={`flex items-center justify-between mt-2 pt-2 border-t text-xs ${
                    message.sender === 'user'
                      ? 'border-white/20 text-white/70'
                      : theme === 'dark'
                      ? 'border-gray-600 text-gray-400'
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
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <User className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                )}

                {message.sender === 'agent' && isRTL && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                {message.sender === 'user' && !isRTL && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <User className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className={`flex gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                {!isRTL && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 shadow-md' 
                    : 'bg-white border border-gray-200 shadow-md'
                }`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.thinking}</span>
                  </div>
                </div>
                {isRTL && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
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
          ? 'bg-gray-900/95 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            className={`flex-1 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
            } ${isRTL ? 'text-right' : 'text-left'}`}
            disabled={isLoading}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
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
