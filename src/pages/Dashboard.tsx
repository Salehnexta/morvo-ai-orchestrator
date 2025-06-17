import { ChatInterface } from "@/components/ChatInterface";
import { DynamicContentPanel } from "@/components/DynamicContentPanel";
import { SimpleAuthWrapper } from "@/components/SimpleAuthWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Dashboard = () => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const [contentType, setContentType] = useState<'hero' | 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'connection-test'>('hero');

  const handleContentTypeChange = (type: string) => {
    console.log('🎯 Content type change:', type);
    // Handle intent-based content switching from chat
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

  return (
    <SimpleAuthWrapper>
      <div 
        className="h-screen w-full bg-cover bg-center bg-no-repeat flex"
        style={{ backgroundImage: `url('/lovable-uploads/362bdb5b-6c5c-4340-8368-eee2d1eb2564.png')` }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Chat Panel - Left side like Layla */}
        <div className="w-1/2 bg-black/40 backdrop-blur-sm border-r border-white/10">
          <ChatInterface 
            onContentTypeChange={handleContentTypeChange}
          />
        </div>

        {/* Dynamic Content Panel - Right side like Layla */}
        <div className="w-1/2">
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
