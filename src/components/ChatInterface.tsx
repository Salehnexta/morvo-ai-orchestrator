
import { useState, useEffect } from "react";
import { MorvoAIService } from "@/services/morvoAIService";
import { CustomerDataService } from "@/services/customerDataService";
import { AgentControlService, AgentCommand, AgentResponse } from "@/services/agent";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";

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
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
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
      placeholder: "اكتب رسالتك بالعربية أو الإنجليزية...",
      noTokens: "نفد رصيدك من الطلبات",
      upgradePrompt: "يرجى ترقية باقتك للمتابعة",
      lowTokens: "رصيدك من الطلبات يقترب من النهاية"
    },
    en: {
      masterAgent: "Smart Assistant",
      clientAgent: "Customer Service Agent", 
      active: "Active",
      connecting: "Connecting to Railway...",
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
      loadTokenBalance();
      loadUserProfile();
    }
  }, [clientId]);

  const initializeClient = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        // Get or create client record
        let { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (clientError || !clientData) {
          // Create client if doesn't exist with 20,000 free tokens
          const { data: newClient, error: createError } = await supabase
            .from('clients')
            .insert({
              name: session.user.email || 'User',
              user_id: session.user.id,
              active: true,
              quota_limit: 20000,
              quota_used: 0
            })
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating client:', createError);
            return;
          }
          clientData = newClient;
        }

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

  const loadTokenBalance = async () => {
    if (!clientId) return;
    
    try {
      const { data: client } = await supabase
        .from('clients')
        .select('quota_limit, quota_used')
        .eq('user_id', clientId)
        .single();
      
      if (client) {
        const remaining = client.quota_limit - client.quota_used;
        setTokenBalance(remaining);
        
        // Show upgrade prompt if tokens are low
        if (remaining < 1000 && remaining > 0) {
          setShowUpgradePrompt(true);
          toast({
            title: "⚠️ " + t.lowTokens,
            description: `باقي لديك ${remaining} طلب فقط`,
            duration: 5000,
          });
        } else if (remaining <= 0) {
          toast({
            title: "🚫 " + t.noTokens,
            description: t.upgradePrompt,
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error loading token balance:', error);
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

  const deductTokens = async (tokensUsed: number) => {
    if (!clientId) return;
    
    try {
      const { data: client } = await supabase
        .from('clients')
        .select('quota_used')
        .eq('user_id', clientId)
        .single();
      
      if (client) {
        await supabase
          .from('clients')
          .update({ quota_used: client.quota_used + tokensUsed })
          .eq('user_id', clientId);
        
        // Update local state
        setTokenBalance(prev => Math.max(0, prev - tokensUsed));
      }
    } catch (error) {
      console.error('Error deducting tokens:', error);
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
        content: testResponse.message || "مرحباً بك! أنا المساعد الذكي مورفو. أستطيع مساعدتك في التسويق الرقمي والاستراتيجيات التجارية. لتقديم أفضل خدمة مخصصة لك، دعني أتعرف عليك أكثر. ما هو اسم شركتك؟",
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

    // Check if user has tokens
    if (tokenBalance <= 0) {
      toast({
        title: "🚫 " + t.noTokens,
        description: t.upgradePrompt,
        variant: "destructive",
        duration: 5000,
      });
      return;
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
      
      // استخدام البيانات الشاملة للعميل
      const enrichedMessage = clientId 
        ? await AgentControlService.enrichAgentContext(clientId, messageToSend)
        : messageToSend;

      console.log('الرسالة المُحسّنة بالسياق:', enrichedMessage.substring(0, 500) + '...');

      // Send profile context with message
      const response = await MorvoAIService.sendMessage(enrichedMessage, userProfile);
      console.log('استجابة Morvo AI:', response);

      // Deduct tokens after successful response
      if (response.cost_tracking?.total_cost) {
        const tokensUsed = Math.ceil(response.cost_tracking.total_cost * 1000); // Convert cost to tokens
        await deductTokens(tokensUsed);
      } else {
        // Default token deduction if no cost provided
        await deductTokens(10);
      }

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

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  return (
    <div className={`h-screen flex flex-col bg-transparent transition-colors duration-300`} dir={isRTL ? 'rtl' : 'ltr'}>
      <ChatHeader 
        theme={theme}
        isRTL={isRTL}
        content={t}
        isConnecting={isConnecting}
        clientId={clientId}
        tokenBalance={tokenBalance}
        onToggleTheme={toggleTheme}
        onUpgrade={handleUpgrade}
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
        isLoading={isLoading || tokenBalance <= 0}
        theme={theme}
        isRTL={isRTL}
        placeholder={tokenBalance <= 0 ? t.noTokens : t.placeholder}
        onInputChange={setInput}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};
