
import { ChatInterface } from "@/components/ChatInterface";
import { DynamicContentPanel } from "@/components/DynamicContentPanel";
import { DynamicSidebar } from "@/components/DynamicSidebar";
import { SimpleAuthWrapper } from "@/components/SimpleAuthWrapper";
import { JourneyPhaseHandler } from "@/components/onboarding/JourneyPhaseHandler";
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
  
  const [contentType, setContentType] = useState<'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'connection-test' | 'onboarding'>('hero');
  const [sidebarContentType, setSidebarContentType] = useState<'default' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'chart' | 'plan'>('default');
  const [journeyInitialized, setJourneyInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Auto-start journey for new users (only once)
  useEffect(() => {
    const initializeJourney = async () => {
      if (loading || journeyInitialized) {
        return;
      }

      console.log('🔍 Checking journey initialization...', {
        hasExistingJourney,
        isOnboardingComplete,
        journey: !!journey,
        currentPhase
      });

      // Show onboarding if user has a journey but hasn't completed it
      if (journey && !isOnboardingComplete) {
        setShowOnboarding(true);
        setContentType('onboarding');
      }

      // Only start journey if user doesn't have one and hasn't completed onboarding
      if (!hasExistingJourney && !isOnboardingComplete && !journey) {
        console.log('🚀 Auto-starting journey for new user');
        await startJourney();
        setShowOnboarding(true);
        setContentType('onboarding');
      }

      setJourneyInitialized(true);
    };

    initializeJourney();
  }, [loading, hasExistingJourney, isOnboardingComplete, journey, startJourney, journeyInitialized, currentPhase]);

  const handleContentTypeChange = (type: string) => {
    console.log('🎯 Content type change:', type);
    
    // Update sidebar content based on the action
    switch (type) {
      case 'analytics':
      case 'view-analytics':
        setSidebarContentType('analytics');
        setContentType('analytics');
        setShowOnboarding(false);
        break;
      case 'content-creator':
      case 'create-content':
        setSidebarContentType('content-creator');
        setContentType('content-creator');
        setShowOnboarding(false);
        break;
      case 'calendar':
      case 'schedule':
      case 'schedule-content':
        setSidebarContentType('calendar');
        setContentType('calendar');
        setShowOnboarding(false);
        break;
      case 'campaign':
      case 'campaigns':
      case 'create-campaign':
        setSidebarContentType('campaign');
        setContentType('campaign');
        setShowOnboarding(false);
        break;
      case 'chart':
      case 'show-chart':
        setSidebarContentType('chart');
        setContentType('analytics');
        setShowOnboarding(false);
        break;
      case 'plan':
      case 'show-plan':
        setSidebarContentType('plan');
        setContentType('campaign');
        setShowOnboarding(false);
        break;
      case 'onboarding':
      case 'start-onboarding':
        setContentType('onboarding');
        setShowOnboarding(true);
        setSidebarContentType('default');
        break;
      case 'connection-test':
        setContentType('connection-test');
        setShowOnboarding(false);
        setSidebarContentType('default');
        break;
      default:
        setContentType('hero');
        setShowOnboarding(false);
        setSidebarContentType('default');
    }
  };

  const handleContentAction = (action: string) => {
    console.log('🔄 Content action clicked:', action);
    handleContentTypeChange(action);
  };

  const handlePhaseComplete = (phase: string) => {
    console.log('✅ Phase completed:', phase);
    // Optionally update content type when certain phases are completed
    if (phase === 'commitment_activation') {
      setShowOnboarding(false);
      setContentType('hero');
      setSidebarContentType('default');
    }
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

  console.log('📊 Dashboard with Enhanced Journey - Phase:', currentPhase, 'Show Onboarding:', showOnboarding);
  
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

        {/* Conditional Layout based on onboarding status */}
        {!isOnboardingComplete ? (
          // During Onboarding: Traditional Chat + Content Panel Layout
          <>
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
                {showOnboarding && contentType === 'onboarding' ? (
                  <div className="h-full p-6 overflow-y-auto">
                    <JourneyPhaseHandler 
                      onPhaseComplete={handlePhaseComplete}
                      className="max-w-2xl mx-auto"
                    />
                  </div>
                ) : (
                  <DynamicContentPanel 
                    contentType={contentType}
                    onActionClick={handleContentAction}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          // After Onboarding: Dynamic Sidebar + Chat Layout
          <>
            {/* Dynamic Sidebar - Left side */}
            <div className="relative z-10">
              <DynamicSidebar 
                contentType={sidebarContentType}
                onActionClick={handleContentAction}
              />
            </div>

            {/* Chat Interface - Right side (takes remaining space) */}
            <div className="flex-1 bg-black/30 backdrop-blur-xl border-l border-white/10 relative z-10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
              <div className="relative z-10 h-full">
                <ChatInterface 
                  onContentTypeChange={handleContentTypeChange}
                />
              </div>
            </div>
          </>
        )}

        {/* Floating Elements for Visual Enhancement */}
        <div className="absolute top-8 right-8 w-4 h-4 bg-blue-400/30 rounded-full animate-ping z-5"></div>
        <div className="absolute bottom-8 left-8 w-3 h-3 bg-purple-400/30 rounded-full animate-ping delay-700 z-5"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-400/30 rounded-full animate-ping delay-300 z-5"></div>
      </div>
    </SimpleAuthWrapper>
  );
};

export default Dashboard;
