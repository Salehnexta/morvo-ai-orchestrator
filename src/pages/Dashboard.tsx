
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
        className="h-screen w-full bg-cover bg-center bg-no-repeat flex"
        style={{ backgroundImage: `url('/lovable-uploads/362bdb5b-6c5c-4340-8368-eee2d1eb2564.png')` }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Chat Panel - Left 40% with dark overlay */}
        <div className="w-2/5 bg-black/40 backdrop-blur-sm border-r border-white/10">
          <ChatInterface 
            onBack={() => {}} 
            onDashboardUpdate={handleDashboardUpdate}
          />
        </div>

        {/* Dynamic Content Panel - Right 60% directly over background */}
        <div className="w-3/5">
          <DynamicContentPanel 
            contentType={contentType}
            onActionClick={handleContentAction}
          />
        </div>
      </div>
    </SimpleAuthWrapper>
  );
};

export default Dashboard;
