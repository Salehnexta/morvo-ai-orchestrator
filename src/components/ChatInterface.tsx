import { useState, useEffect } from "react";
import { MorvoAIService } from "@/services/morvoAIService";
import { CustomerDataService } from "@/services/customerDataService";
import { AgentControlService, AgentCommand, AgentResponse } from "@/services/agent";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTokens } from "@/hooks/useTokens";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";
import { AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  cost?: number;
  agents_involved?: string[];
  commands?: AgentCommand[];
  isError?: boolean;
}

interface ChatInterfaceProps {
  onBack: () => void;
  onDashboardUpdate?: (data: any) => void;
}

export const ChatInterface = ({ onBack, onDashboardUpdate }: ChatInterfaceProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, isRTL } = useLanguage();
  const { tokenData, deductTokens, getRemainingTokens, isLowTokens } = useTokens();
  const [clientId, setClientId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  const content = {
    ar: {
      masterAgent: "المساعد الذكي",
      clientAgent: "وكيل خدمة العملاء",
      active: "نشط",
      connecting: "جاري الاتصال...",
      connected: "متصل",
      connectionFailed: "فشل الاتصال",
      thinking: "المساعد الذكي يفكر...",
      placeholder: "اكتب رسالتك بالعربية أو الإنجليزية...",
      noTokens: "نفد رصيدك من الطلبات",
      upgradePrompt: "يرجى ترقية باقتك للمتابعة",
      lowTokens: "رصيدك من الطلبات يقترب من النهاية"
    },
    en: {
      masterAgent: "Smart Assistant",
      clientAgent: "Customer Service Agent", 
      active: "Active",
      connecting: "Connecting...",
      connected: "Connected",
      connectionFailed: "Connection Failed",
      thinking: "Smart Assistant is thinking...",
      placeholder: "Type your message in Arabic or English...",
      noTokens: "You've exhausted your request limit",
      upgradePrompt: "Please upgrade your plan to continue",
      lowTokens: "Your request balance is running low"
    }
  };

  const t = content[language];

  useEffect(() => {
    initializeClient();
    testRailwayConnection();
  }, []);

  useEffect(() => {
    if (clientId) {
      loadUserProfile();
    }
  }, [clientId]);

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await MorvoAIService.healthCheck();
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };
    
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeClient = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setClientId(session.user.id);
        
        // تحديث حالة العميل كمدفوع إذا كان saleh@nexta.sa
        if (session.user.email === 'saleh@nexta.sa') {
          await AgentControlService.markCustomerAsPaid(session.user.id);
          console.log('✅ تم تحديث حالة العميل saleh@nexta.sa كمدفوع');
        }
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
  };

  const loadUserProfile = async () => {
    if (!clientId) return;
    
    try {
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', clientId)
        .single();
      
      setUserProfile(profile);
    } catch (error) {
      console.log('No profile found, will collect during chat');
    }
  };

  const testRailwayConnection = async () => {
    setConnectionStatus('checking');
    try {
      console.log('اختبار الاتصال التلقائي مع Railway...');
      
      const isConnected = await MorvoAIService.testRailwayConnection();
      
      if (isConnected) {
        setConnectionStatus('connected');
        toast({
          title: "✅ تم الاتصال بنجاح",
          description: "Morvo AI متصل وجاهز للاستخدام",
          duration: 3000,
        });

        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: "مرحباً بك! أنا المساعد الذكي مورفو. أستطيع مساعدتك في التسويق الرقمي والاستراتيجيات التجارية. كيف يمكنني مساعدتك اليوم؟",
          sender: 'agent',
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
      } else {
        throw new Error('Connection test failed');
      }
      
    } catch (error) {
      console.error('❌ فشل اختبار الاتصال:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "❌ فشل الاتصال",
        description: "لا يمكن الاتصال بـ Morvo AI. سيتم المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 5000,
      });
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "عذراً، حدث خطأ في الاتصال مع الخدمة. يرجى المحاولة مرة أخرى لاحقاً.",
        sender: 'agent',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages([errorMessage]);
    }
  };

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

    // Check connection status
    if (connectionStatus === 'disconnected') {
      toast({
        title: "❌ لا يوجد اتصال",
        description: "يرجى انتظار إعادة الاتصال",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Check if user has tokens
    const remainingTokens = getRemainingTokens();
    if (remainingTokens <= 0) {
      toast({
        title: "🚫 " + t.noTokens,
        description: t.upgradePrompt,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Show warning if very low on tokens
    if (remainingTokens <= 5 && remainingTokens > 0) {
      toast({
        title: "⚠️ " + t.lowTokens,
        description: `باقي لديك ${remainingTokens} طلب فقط`,
        duration: 4000,
      });
    }

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
      console.log('إرسال رسالة إلى Morvo AI مع السياق الكامل:', messageToSend);
      
      // Deduct token before API call
      const tokenDeducted = await deductTokens(1);
      if (!tokenDeducted) {
        throw new Error('فشل في خصم الرمز المميز');
      }

      // Use retry mechanism for better reliability
      const response = await MorvoAIService.sendMessageWithRetry(messageToSend, userProfile);
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

      // Update connection status on successful response
      setConnectionStatus('connected');

      for (const command of commands) {
        if (command.type === 'save_data' && clientId) {
          await AgentControlService.saveCustomerData(clientId, command.data);
          console.log('تم حفظ البيانات تلقائياً:', command.data);
          // Reload profile after saving data
          await loadUserProfile();
        }
      }

      if (clientId) {
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
              commands: serializableCommands,
              context_enriched: true
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
      
      // Update connection status on error
      setConnectionStatus('disconnected');
      
      // Refund token on error
      await deductTokens(-1);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.\n\nSorry, there was a connection error. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
        isError: true
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

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const remainingTokens = getRemainingTokens();
  const isConnecting = connectionStatus === 'checking';

  return (
    <div className="h-full flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Token Warning Banner */}
      {isLowTokens() && (
        <div className="bg-yellow-600/20 backdrop-blur-sm border-b border-yellow-400/30 p-3">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-yellow-200">
              رصيد منخفض: {remainingTokens} طلب متبقي
            </span>
            <button
              onClick={() => window.location.href = '/pricing'}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                isRTL ? 'mr-auto' : 'ml-auto'
              } bg-yellow-500 hover:bg-yellow-600 text-white`}
            >
              ترقية
            </button>
          </div>
        </div>
      )}

      <ChatHeader 
        theme={theme}
        isRTL={isRTL}
        content={{
          ...t,
          connecting: connectionStatus === 'checking' ? t.connecting : connectionStatus === 'connected' ? t.connected : t.connectionFailed
        }}
        isConnecting={isConnecting}
        clientId={clientId}
        tokenBalance={remainingTokens}
        onToggleTheme={toggleTheme}
        onUpgrade={() => window.location.href = '/pricing'}
      />

      <MessageList 
        messages={messages}
        isLoading={isLoading}
        theme={theme}
        isRTL={isRTL}
        thinkingText={t.thinking}
        onCommandResponse={handleAgentCommandResponse}
      />

      <ChatInput 
        input={input}
        isLoading={isLoading || remainingTokens <= 0 || connectionStatus === 'disconnected'}
        theme={theme}
        isRTL={isRTL}
        placeholder={remainingTokens <= 0 ? t.noTokens : connectionStatus === 'disconnected' ? 'غير متصل...' : t.placeholder}
        onInputChange={setInput}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};
