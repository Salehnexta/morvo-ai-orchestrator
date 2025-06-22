
import { SimpleAuthWrapper } from "@/components/SimpleAuthWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useJourney } from "@/contexts/JourneyContext";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

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
  
  // Start with perplexity-test for immediate testing
  const [contentType, setContentType] = useState<'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'connection-test' | 'onboarding' | 'perplexity-test'>('perplexity-test');
  const [journeyInitialized, setJourneyInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

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
    
    // Update content based on the action
    switch (type) {
      case 'analytics':
      case 'view-analytics':
        setContentType('analytics');
        setShowOnboarding(false);
        break;
      case 'content-creator':
      case 'create-content':
        setContentType('content-creator');
        setShowOnboarding(false);
        break;
      case 'calendar':
      case 'schedule':
      case 'schedule-content':
        setContentType('calendar');
        setShowOnboarding(false);
        break;
      case 'campaign':
      case 'campaigns':
      case 'create-campaign':
        setContentType('campaign');
        setShowOnboarding(false);
        break;
      case 'onboarding':
      case 'start-onboarding':
        setContentType('onboarding');
        setShowOnboarding(true);
        break;
      case 'connection-test':
        setContentType('connection-test');
        setShowOnboarding(false);
        break;
      case 'perplexity-test':
        setContentType('perplexity-test');
        setShowOnboarding(false);
        break;
      default:
        setContentType('hero');
        setShowOnboarding(false);
    }
  };

  const handleContentAction = (action: string) => {
    console.log('🔄 Content action clicked:', action);
    handleContentTypeChange(action);
  };

  const handlePhaseComplete = (phase: string) => {
    console.log('✅ Phase completed:', phase);
    // After strategy generation (final phase), move to main dashboard
    if (phase === 'strategy_generation') {
      setShowOnboarding(false);
      setContentType('hero');
    }
  };

  const handleChatMessage = (message: string) => {
    setLastUserMessage(message);
    setConversationHistory(prev => [...prev.slice(-4), message]);
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

  console.log('📊 Dashboard with Smart Sidebar - Phase:', currentPhase, 'Show Onboarding:', showOnboarding);
  
  return (
    <SimpleAuthWrapper>
      <DashboardLayout
        isOnboardingComplete={isOnboardingComplete}
        contentType={contentType}
        showOnboarding={showOnboarding}
        lastUserMessage={lastUserMessage}
        conversationHistory={conversationHistory}
        onContentTypeChange={handleContentTypeChange}
        onMessageSent={handleChatMessage}
        onPhaseComplete={handlePhaseComplete}
        onContentAction={handleContentAction}
      />
    </SimpleAuthWrapper>
  );
};

export default Dashboard;
