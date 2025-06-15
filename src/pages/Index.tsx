
import { useState } from "react";
import { MessageSquare, Sparkles, Zap, Globe, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Master Agent",
      description: "Intelligent coordinator managing 9 specialized AI agents for comprehensive marketing solutions"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Bilingual AI",
      description: "Native Arabic and English support with Saudi dialect optimization for regional excellence"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Sub-10 second responses with live cost tracking and performance monitoring"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Agent Ecosystem",
      description: "9 specialized agents covering SEO, social media, analytics, content, and competitive intelligence"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Enterprise Analytics",
      description: "Advanced business intelligence with ROI analysis and data-driven insights"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Scalable Platform",
      description: "Railway deployment with 99.9% uptime handling 1000+ concurrent clients"
    }
  ];

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Next-Generation AI Marketing Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Morvo AI
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Marketing Revolution
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              9 Specialized AI Agents working in harmony to revolutionize your digital marketing strategy with intelligent coordination and bilingual excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with Master Agent
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powered by Intelligent Agent Coordination
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the future of marketing automation where specialized AI agents collaborate to deliver expert-level strategies at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl"
            >
              <div className="text-blue-400 mb-4 group-hover:text-purple-400 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">9</div>
              <div className="text-white/70">Specialized Agents</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/70">Uptime</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">&lt;10s</div>
              <div className="text-white/70">Response Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/70">Concurrent Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to revolutionize your marketing with AI?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Start with the Master Agent and experience the power of coordinated AI marketing intelligence.
          </p>
          <Button 
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
