
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentsBeloService } from "@/services/agentsBeloService";
import { useToast } from "@/hooks/use-toast";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'مرحباً! أنا الوكيل الرئيسي في منصة Morvo AI. كيف يمكنني مساعدتك في استراتيجية التسويق اليوم؟\n\nHello! I\'m the Master Agent at Morvo AI. How can I help you with your marketing strategy today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      console.log('Sending message to AgentsBelo:', input);
      const response = await AgentsBeloService.sendMessage(input);
      
      console.log('AgentsBelo response:', response);

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: response.processing_time_ms,
        cost: response.cost_tracking?.total_cost,
        agents_involved: response.agents_involved
      };

      setMessages(prev => [...prev, agentMessage]);

      if (response.processing_time_ms) {
        toast({
          title: "Response Generated",
          description: `Processed in ${response.processing_time_ms}ms${response.cost_tracking?.total_cost ? ` - Cost: $${response.cost_tracking.total_cost.toFixed(4)}` : ''}`,
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
        description: "Failed to connect to AgentsBelo. Please try again.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold">Master Agent</h1>
              <p className="text-white/70 text-sm">ClientExperienceAgent • وكيل تجربة العملاء</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/70 text-sm">Active</span>
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
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'agent' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-xs text-white/60">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.processing_time && (
                      <span>{message.processing_time}ms</span>
                    )}
                    {message.cost && (
                      <span>${message.cost.toFixed(4)}</span>
                    )}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-white/70">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Master Agent is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message in Arabic or English..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
            disabled={isLoading}
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
