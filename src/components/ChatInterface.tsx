import { useState, useEffect } from "react";
import { MorvoAIService } from "@/services/morvoAIService";
import { CustomerDataService } from "@/services/customerDataService";
import { AgentControlService, AgentCommand, AgentResponse } from "@/services/agent";
import { TokenService, TokenUsage } from "@/services/tokenService";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";
import { FreeAccountDialog } from "./chat/FreeAccountDialog";

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
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
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
        setIsPublicMode(false);
        
        // تحديث حالة العميل كمدفوع إذا كان saleh@nexta.sa
        if (session.user.email === 'saleh@nexta.sa') {
          await AgentControlService.markCustomerAsPaid(session.user.id);
          console.log('✅ تم تحديث حالة العميل saleh@nexta.sa كمدفوع');
        }
      } else {
        // Public mode - generate a temporary client ID
        setClientId('public-' + Date.now());
        setIsPublicMode(true);
        console.log('🌐 وضع المحادثة العامة مُفعّل');
      }
    } catch (error) {
      console.error('Error getting session:', error);
      setIsPublicMode(true);
      setClientId('public-' + Date.now());
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
        content: isPublicMode 
          ? "مرحباً بك في المحادثة التجريبية لمورفو! 🌟\n\nأنا المساعد الذكي مورفو. يمكنني مساعدتك في:\n- التسويق الرقمي\n- تطوير الاستراتيجيات\n- تحليل البيانات\n- الإجابة على الأسئلة العامة\n\nكيف يمكنني مساعدتك اليوم؟\n\n💡 للحصول على الميزات الكاملة، يرجى تسجيل الدخول"
          : testResponse.message || "مرحباً بك! أنا المساعد الذكي مورفو. لديّ الآن كامل معلوماتك وتاريخ أعمالك، وأستطيع تقديم نصائح مخصصة تماماً لك. كيف يمكنني مساعدتك اليوم؟",
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

  const updateTokenUsage = async (clientId: string) => {
    const usage = await TokenService.checkTokenLimit(clientId);
    setTokenUsage(usage);
    
    if (usage.isLimitReached) {
      toast({
        title: "تم الوصول للحد الأقصى",
        description: usage.accountType === 'guest' 
          ? "تم استنفاد التوكنز المجانية. يرجى إنشاء حساب مجاني للحصول على المزيد."
          : "تم استنفاد التوكنز الشهرية. يرجى الترقية للحساب المدفوع.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleSend = async (messageText?: string, shouldClearInput: boolean = true) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isLoading) return;

    // فحص حد التوكنز قبل الإرسال
    if (tokenUsage?.isLimitReached) {
      if (tokenUsage.accountType === 'guest') {
        toast({
          title: "حد التوكنز المجانية",
          description: "تم استنفاد التوكنز المجانية. أنشئ حساباً مجانياً للحصول على 5000 توكن شهرياً!",
          variant: "destructive",
          action: (
            <button 
              onClick={() => setShowUpgradeDialog(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              إنشاء حساب مجاني
            </button>
          ),
        });
      } else {
        setShowUpgradeDialog(true);
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Only save customer data if not in public mode
    if (clientId && !isPublicMode) {
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
      
      // For public mode, send message without enriched context
      let finalMessage = messageToSend;
      if (!isPublicMode && clientId) {
        finalMessage = await AgentControlService.enrichAgentContext(clientId, messageToSend);
        console.log('الرسالة المُحسّنة بالسياق:', finalMessage.substring(0, 500) + '...');
      } else {
        console.log('وضع المحادثة العامة - بدون سياق مُحسّن');
      }

      const response = await MorvoAIService.sendMessage(finalMessage);
      console.log('استجابة Morvo AI:', response);

      // تتبع استخدام التوكنز
      const estimatedTokens = Math.ceil(messageToSend.length / 4) + Math.ceil((response.message || '').length / 4);
      await TokenService.trackTokenUsage(clientId, estimatedTokens);
      
      if (clientId.startsWith('public-')) {
        TokenService.updateGuestTokenUsage(clientId, estimatedTokens);
      }
      
      // تحديث عداد التوكنز
      await updateTokenUsage(clientId);

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

      // Only process commands and save data if not in public mode
      if (!isPublicMode) {
        for (const command of commands) {
          if (command.type === 'save_data' && clientId) {
            await AgentControlService.saveCustomerData(clientId, command.data);
            console.log('تم حفظ البيانات تلقائياً:', command.data);
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
      }

      if (response.processing_time) {
        toast({
          title: "تم إنشاء الاستجابة",
          description: `تمت المعالجة في ${response.processing_time}s${response.cost_tracking?.total_cost ? ` - التكلفة: $${response.cost_tracking.total_cost.toFixed(4)}` : ''}${isPublicMode ? ' (وضع تجريبي)' : ''}${tokenUsage ? ` - التوكنز المتبقية: ${tokenUsage.remainingTokens}` : ''}`,
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

  const handleFreeAccountCreated = async (clientId: string) => {
    setShowUpgradeDialog(false);
    setClientId(clientId);
    setIsPublicMode(false);
    await updateTokenUsage(clientId);
    
    toast({
      title: "تم إنشاء الحساب بنجاح!",
      description: "مرحباً بك! لديك الآن 5000 توكن شهرياً. يمكنك المتابعة في المحادثة.",
      duration: 5000,
    });
  };

  return (
    <div className={`h-screen flex flex-col bg-transparent transition-colors duration-300`} dir={isRTL ? 'rtl' : 'ltr'}>
      <ChatHeader 
        theme={theme}
        isRTL={isRTL}
        content={t}
        isConnecting={isConnecting}
        onToggleTheme={toggleTheme}
        tokenUsage={tokenUsage}
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
        isLoading={isLoading}
        theme={theme}
        isRTL={isRTL}
        placeholder={isPublicMode ? (language === 'ar' ? "اكتب رسالتك (وضع تجريبي)..." : "Type your message (demo mode)...") : t.placeholder}
        onInputChange={setInput}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
        tokenUsage={tokenUsage}
      />

      <FreeAccountDialog 
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        onAccountCreated={handleFreeAccountCreated}
        isUpgrade={tokenUsage?.accountType === 'free'}
      />
    </div>
  );
};
