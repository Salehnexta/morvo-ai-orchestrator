
import { ChatInterface } from "@/components/ChatInterface";
import { DynamicContentPanel } from "@/components/DynamicContentPanel";
import { SimpleAuthWrapper } from "@/components/SimpleAuthWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useJourney } from "@/contexts/JourneyContext";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const { 
    loading, 
    isOnboardingComplete, 
    currentPhase, 
    startJourney, 
    hasExistingJourney,
    journey 
  } = useJourney();
  
  const [contentType, setContentType] = useState<'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'connection-test'>('hero');
  const [journeyInitialized, setJourneyInitialized] = useState(false);

  // Auto-start journey for new users (only once)
  useEffect(() => {
    const initializeJourney = async () => {
      if (loading || journeyInitialized) {
        return;
      }

      console.log('🔍 Checking journey initialization...', {
        hasExistingJourney,
        isOnboardingComplete,
        journey: !!journey
      });

      // Only start journey if user doesn't have one and hasn't completed onboarding
      if (!hasExistingJourney && !isOnboardingComplete && !journey) {
        console.log('🚀 Auto-starting journey for new user');
        await startJourney();
      }

      setJourneyInitialized(true);
    };

    initializeJourney();
  }, [loading, hasExistingJourney, isOnboardingComplete, journey, startJourney, journeyInitialized]);

  const handleContentTypeChange = (type: string) => {
    console.log('🎯 Content type change:', type);
    switch (type) {
      case 'analytics':
      case 'view-analytics':
        setContentType('analytics');
        break;
      case 'content-creator':
      case 'create-content':
        setContentType('content-creator');
        break;
      case 'calendar':
      case 'schedule':
      case 'schedule-content':
        setContentType('calendar');
        break;
      case 'campaign':
      case 'campaigns':
      case 'create-campaign':
        setContentType('campaign');
        break;
      case 'connection-test':
        setContentType('connection-test');
        break;
      default:
        setContentType('hero');
    }
  };

  const handleContentAction = (action: string) => {
    console.log('🔄 Content action clicked:', action);
    handleContentTypeChange(action);
  };

  // Show loading while checking journey status
  if (loading) {
    return (
      <SimpleAuthWrapper>
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
            <p className="text-white">جاري تحضير رحلتك التسويقية...</p>
          </div>
        </div>
      </SimpleAuthWrapper>
    );
  }

  console.log('📊 Dashboard with Journey Integration - Phase:', currentPhase);
  return (
    <SimpleAuthWrapper>
      <div 
        className="h-screen w-full flex relative overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Enhanced Background with Multiple Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        </div>

        {/* Chat Panel - Left side with Journey integration */}
        <div className="w-1/2 bg-black/30 backdrop-blur-xl border-r border-white/10 relative z-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="relative z-10 h-full">
            <ChatInterface 
              onContentTypeChange={handleContentTypeChange}
            />
          </div>
        </div>

        {/* Dynamic Content Panel - Right side */}
        <div className="w-1/2 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent"></div>
          <div className="relative z-10 h-full bg-white/5 backdrop-blur-sm">
            <DynamicContentPanel 
              contentType={contentType}
              onActionClick={handleContentAction}
            />
          </div>
        </div>

        {/* Floating Elements for Visual Enhancement */}
        <div className="absolute top-8 right-8 w-4 h-4 bg-blue-400/30 rounded-full animate-ping z-5"></div>
        <div className="absolute bottom-8 left-8 w-3 h-3 bg-purple-400/30 rounded-full animate-ping delay-700 z-5"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-400/30 rounded-full animate-ping delay-300 z-5"></div>
      </div>
    </SimpleAuthWrapper>
  );
};

export default Dashboard;
