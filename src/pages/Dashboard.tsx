
import { ChatInterface } from "@/components/ChatInterface";
import { DynamicContentPanel } from "@/components/DynamicContentPanel";
import { SimpleAuthWrapper } from "@/components/SimpleAuthWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Dashboard = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const [contentType, setContentType] = useState<'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign'>('hero');

  const handleDashboardUpdate = (data: any) => {
    console.log('Dashboard update:', data);
    // Handle chart data updates from chat
    if (data.chartType) {
      setContentType('analytics');
    }
  };

  const handleContentAction = (action: string) => {
    console.log('Content action:', action);
    // Handle action button clicks from the dynamic panel
    switch (action) {
      case 'analytics':
        setContentType('analytics');
        break;
      case 'create-content':
        setContentType('content-creator');
        break;
      case 'schedule':
        setContentType('calendar');
        break;
      case 'campaigns':
        setContentType('campaign');
        break;
      default:
        setContentType('hero');
    }
  };

  return (
    <SimpleAuthWrapper>
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/lovable-uploads/ac9c9c9b-a4db-48f3-ae39-d0ae9a8c5ed4.png')` }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Natural overlay for better text readability */}
        <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20">
          {/* 2-Panel Dashboard Layout - 40/60 split */}
          <div className="h-screen flex">
            {/* Chat Panel - 40% width */}
            <div className="w-2/5 glass-panel border-r border-white/20">
              <ChatInterface 
                onBack={() => {}} 
                onDashboardUpdate={handleDashboardUpdate}
              />
            </div>

            {/* Dynamic Content Panel - 60% width */}
            <div className="w-3/5 glass-panel">
              <DynamicContentPanel 
                contentType={contentType}
                onActionClick={handleContentAction}
              />
            </div>
          </div>
        </div>
      </div>
    </SimpleAuthWrapper>
  );
};

export default Dashboard;
