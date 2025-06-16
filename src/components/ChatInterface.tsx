import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MorvoAIService } from "@/services/morvoAIService";
import { CustomerDataService } from "@/services/customerDataService";
import { AgentControlService, AgentCommand, AgentResponse } from "@/services/agent";
import AgentCommands from "./AgentCommands";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  cost?: number;
  agents_involved?: string[];
  commands?: AgentCommand[];
}

interface ChatInterfaceProps {
  onBack: () => void;
  onDashboardUpdate?: (data: any) => void;
}

export const ChatInterface = ({ onBack, onDashboardUpdate }: ChatInterfaceProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, isRTL } = useLanguage();
  const [clientId, setClientId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const content = {
    ar: {
      masterAgent: "المساعد الذكي",
      clientAgent: "وكيل خدمة العملاء",
      active: "نشط",
      connecting: "جاري الاتصال بـ Railway...",
      connected: "متصل",
      connectionFailed: "فشل الاتصال",
      thinking: "المساعد الذكي يفكر...",
      placeholder: "اكتب رسالتك بالعربية أو الإنجليزية..."
    },
    en: {
      masterAgent: "Smart Assistant",
      clientAgent: "Customer Service Agent", 
      active: "Active",
      connecting: "Connecting to Railway...",
      connected: "Connected",
      connectionFailed: "Connection Failed",
      thinking: "Smart Assistant is thinking...",
      placeholder: "Type your message in Arabic or English..."
    }
  };

  const t = content[language];

  useEffect(() => {
    initializeClient();
    testRailwayConnection();
  }, []);

  const initializeClient = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setClientId(session.user.id);
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
  };

  const testRailwayConnection = async () => {
    setIsConnecting(true);
    try {
      console.log('اختبار الاتصال التلقائي مع Railway...');
      
      await MorvoAIService.healthCheck();
      console.log('✅ Health Check نجح');
      
      await MorvoAIService.getAgents();
      console.log('✅ جلب الوكلاء نجح');
      
      const testResponse = await MorvoAIService.sendMessage("مرحبا، هذا اختبار اتصال");
      console.log('✅ اختبار المحادثة نجح:', testResponse);
      
      toast({
        title: "✅ تم الاتصال بنجاح",
        description: "Railway متصل وجاهز للاستخدام",
        duration: 3000,
      });

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: testResponse.message || "مرحباً بك! أنا المساعد الذكي مورفو. كيف يمكنني مساعدتك اليوم؟",
        sender: 'agent',
        timestamp: new Date(),
        processing_time: testResponse.processing_time,
        cost: testResponse.cost_tracking?.total_cost,
        agents_involved: testResponse.agents_involved
      };
      
      setMessages([welcomeMessage]);
      
    } catch (error) {
      console.error('❌ فشل اختبار الاتصال:', error);
      toast({
        title: "❌ فشل الاتصال",
        description: "لا يمكن الاتصال بـ Railway. سيتم المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "عذراً، حدث خطأ في الاتصال مع الخدمة. يرجى المحاولة مرة أخرى لاحقاً.",
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages([errorMessage]);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const analyzeMessageForDashboard = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
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

  const handleAgentCommandResponse = async (response: AgentResponse) => {
    console.log('استجابة العميل على أمر الوكيل:', response);

    if (clientId) {
      await AgentControlService.processUserResponse(clientId, response);
    }

    const userResponseMessage: Message = {
      id: Date.now().toString(),
      content: response.type === 'form_submitted' 
        ? `تم إرسال النموذج: ${response.data ? Object.entries(response.data).map(([key, value]) => `${key}: ${value}`).join(', ') : ''}`
        : response.type === 'button_clicked'
        ? `تم الضغط على: ${response.data?.text || 'زر'}`
        : JSON.stringify(response.data),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userResponseMessage]);

    const updateMessage = `تفاعل العميل: ${JSON.stringify(response)}`;
    await handleSend(updateMessage, false);
  };

  const handleSend = async (messageText?: string, shouldClearInput: boolean = true) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    if (clientId) {
      await CustomerDataService.extractAndSaveCustomerData(
        messageToSend, 
        clientId, 
        MorvoAIService.getConversationInfo().conversationId || 'default'
      );
    }

    const dashboardData = analyzeMessageForDashboard(messageToSend);
    if (dashboardData && onDashboardUpdate) {
      onDashboardUpdate(dashboardData);
    }

    if (shouldClearInput) {
      setInput('');
    }
    setIsLoading(true);

    try {
      console.log('إرسال رسالة إلى Morvo AI:', messageToSend);
      
      const enrichedMessage = clientId 
        ? await AgentControlService.enrichAgentContext(clientId, messageToSend)
        : messageToSend;

      const response = await MorvoAIService.sendMessage(enrichedMessage);
      console.log('استجابة Morvo AI:', response);

      const { message: cleanMessage, commands } = AgentControlService.parseAgentResponse(response.message);

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: cleanMessage,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: response.processing_time,
        cost: response.cost_tracking?.total_cost,
        agents_involved: response.agents_involved,
        commands: commands.length > 0 ? commands : undefined
      };

      setMessages(prev => [...prev, agentMessage]);

      for (const command of commands) {
        if (command.type === 'save_data' && clientId) {
          await AgentControlService.saveCustomerData(clientId, command.data);
          console.log('تم حفظ البيانات تلقائياً:', command.data);
        }
      }

      if (clientId) {
        // Convert commands to serializable format for database storage
        const serializableCommands = commands.map(cmd => ({
          type: cmd.type,
          data: cmd.data,
          id: cmd.id
        }));

        await supabase
          .from('conversation_messages')
          .insert({
            client_id: clientId,
            conversation_id: MorvoAIService.getConversationInfo().conversationId || 'default',
            content: cleanMessage,
            sender_type: 'agent',
            sender_id: response.agents_involved?.[0] || 'morvo_ai',
            metadata: {
              processing_time: response.processing_time,
              cost: response.cost_tracking?.total_cost,
              agents_involved: response.agents_involved,
              commands: serializableCommands
            } as any,
            timestamp: new Date().toISOString()
          });
      }

      if (response.processing_time) {
        toast({
          title: "تم إنشاء الاستجابة",
          description: `تمت المعالجة في ${response.processing_time}s${response.cost_tracking?.total_cost ? ` - التكلفة: $${response.cost_tracking.total_cost.toFixed(4)}` : ''}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.\n\nSorry, there was a connection error. Please try again.',
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "خطأ في الاتصال",
        description: "فشل الاتصال مع Morvo AI. يرجى المحاولة مرة أخرى.",
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
    <div className={`h-screen flex flex-col bg-transparent transition-colors duration-300`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`backdrop-blur-md border-b p-4 ${
        theme === 'dark' 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/20 border-white/30'
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
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isConnecting ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {isConnecting ? t.connecting : t.connected}
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
              <div key={message.id} className="space-y-2">
                <div
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
                    className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : theme === 'dark'
                        ? 'bg-black/40 border border-white/20 text-white'
                        : 'bg-white/50 border border-gray-200 text-gray-900'
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

                {message.commands && message.commands.length > 0 && (
                  <div className={`${
                    isRTL ? 'mr-11' : 'ml-11'
                  }`}>
                    {message.commands.map((command) => (
                      <AgentCommands
                        key={command.id}
                        command={command}
                        onResponse={handleAgentCommandResponse}
                        theme={theme}
                      />
                    ))}
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
                <div className={`p-4 rounded-2xl shadow-md ${
                  theme === 'dark' 
                    ? 'bg-black/40 border border-white/20' 
                    : 'bg-white/50 border border-gray-200'
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
      <div className={`backdrop-blur-md border-t p-4 ${
        theme === 'dark' 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/20 border-white/30'
      }`}>
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            className={`flex-1 transition-colors ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500' 
                : 'bg-black/5 border-black/20 text-black placeholder:text-gray-700 focus:border-blue-500'
            } ${isRTL ? 'text-right' : 'text-left'}`}
            disabled={isLoading}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={() => handleSend()}
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
