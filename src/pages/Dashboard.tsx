
import { ChatInterface } from "@/components/ChatInterface";
import { DynamicContentPanel } from "@/components/DynamicContentPanel";
import { SimpleAuthWrapper } from "@/components/SimpleAuthWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmartOnboarding } from "@/hooks/useSmartOnboarding";
import { useRailwayIntegration } from "@/hooks/useRailwayIntegration";
import { useState, useEffect } from "react";
import { Loader2, Wifi, WifiOff, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const { status, loading } = useSmartOnboarding();
  const { 
    status: railwayStatus, 
    checkConnection, 
    runDiagnostics 
  } = useRailwayIntegration();
  
  const [contentType, setContentType] = useState<'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'connection-test'>('hero');
  const [showRailwayStatus, setShowRailwayStatus] = useState(true);

  useEffect(() => {
    // Hide Railway status after 10 seconds if connected
    if (railwayStatus.isConnected) {
      const timer = setTimeout(() => setShowRailwayStatus(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [railwayStatus.isConnected]);

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

  const handleRunDiagnostics = async () => {
    await runDiagnostics();
  };

  // Show loading while checking onboarding status
  if (loading) {
    return (
      <SimpleAuthWrapper>
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
            <p className="text-white">جاري التحقق من حالة حسابك...</p>
          </div>
        </div>
      </SimpleAuthWrapper>
    );
  }

  console.log('📊 Dashboard Phase 4: Railway backend integrated');
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

        {/* Railway Backend Status Indicator - Phase 4 */}
        {showRailwayStatus && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`px-4 py-2 rounded-full backdrop-blur-xl border flex items-center gap-2 ${
              railwayStatus.isConnected 
                ? 'bg-green-500/20 border-green-400/30 text-green-200' 
                : 'bg-red-500/20 border-red-400/30 text-red-200'
            }`}>
              {railwayStatus.isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">Railway Backend متصل</span>
                  <Activity className="w-4 h-4 animate-pulse" />
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">Railway Backend غير متصل</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs h-6 px-2 ml-2"
                    onClick={handleRunDiagnostics}
                  >
                    اختبار
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Panel - Left side with Railway integration */}
        <div className="w-1/2 bg-black/30 backdrop-blur-xl border-r border-white/10 relative z-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="relative z-10 h-full">
            <ChatInterface 
              onContentTypeChange={handleContentTypeChange}
              onboardingStatus={status}
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

        {/* Phase 4 Status Indicators */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
          {railwayStatus.isConnected && (
            <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg text-green-200 text-xs">
              🚀 Phase 4 Active
            </div>
          )}
          
          {railwayStatus.serverInfo && (
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-200 text-xs">
              {railwayStatus.serverInfo.version || 'v2.0.0'}
            </div>
          )}

          {railwayStatus.error && (
            <div className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-xs max-w-48 truncate">
              {railwayStatus.error}
            </div>
          )}
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
