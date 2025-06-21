
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SmartContentDetector, DetectionResult } from '@/services/smartContentDetector';
import { AnalyticsSidebar } from './content/AnalyticsSidebar';
import { ContentCreatorSidebar } from './content/ContentCreatorSidebar';
import { CalendarSidebar } from './content/CalendarSidebar';
import { CampaignSidebar } from './content/CampaignSidebar';
import { ChartSidebar } from './content/ChartSidebar';
import { PlanSidebar } from './content/PlanSidebar';
import { DefaultSidebar } from './content/DefaultSidebar';

interface SidebarContentManagerProps {
  lastMessage?: string;
  conversationHistory?: string[];
  onActionClick?: (action: string) => void;
}

export const SidebarContentManager: React.FC<SidebarContentManagerProps> = ({
  lastMessage,
  conversationHistory = [],
  onActionClick
}) => {
  const { language, isRTL } = useLanguage();
  const [currentContent, setCurrentContent] = useState<DetectionResult | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (lastMessage) {
      const detection = SmartContentDetector.detectIntent(lastMessage, conversationHistory);
      
      // Only update if there's a significant change
      if (!currentContent || currentContent.primary.type !== detection.primary.type) {
        setIsTransitioning(true);
        
        setTimeout(() => {
          setCurrentContent(detection);
          setIsTransitioning(false);
        }, 200);
      }
    }
  }, [lastMessage, conversationHistory, currentContent]);

  const renderContent = () => {
    if (!currentContent) {
      return <DefaultSidebar onActionClick={onActionClick} />;
    }

    const { primary, contextData } = currentContent;

    switch (primary.type) {
      case 'analytics':
        return <AnalyticsSidebar contextData={contextData} onActionClick={onActionClick} />;
      case 'content-creator':
        return <ContentCreatorSidebar contextData={contextData} onActionClick={onActionClick} />;
      case 'calendar':
        return <CalendarSidebar contextData={contextData} onActionClick={onActionClick} />;
      case 'campaign':
        return <CampaignSidebar contextData={contextData} onActionClick={onActionClick} />;
      case 'chart':
        return <ChartSidebar contextData={contextData} onActionClick={onActionClick} />;
      case 'plan':
        return <PlanSidebar contextData={contextData} onActionClick={onActionClick} />;
      default:
        return <DefaultSidebar onActionClick={onActionClick} />;
    }
  };

  return (
    <div 
      className={`h-full transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {renderContent()}
    </div>
  );
};
