
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ChatInterface } from "@/components/ChatInterface";
import { useState } from "react";
import { DashboardContent } from "@/components/DashboardContent";

export default function Dashboard() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<any>(null);

  const handleDashboardUpdate = (data: any) => {
    setDashboardData(data);
  };

  return (
    <div 
      className="min-h-screen flex w-full" 
      dir="rtl"
    >
      {/* Chat Area - 40% (Right side in RTL) */}
      <div className={`w-2/5 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-l border-gray-200`}>
        <ChatInterface onBack={() => {}} onDashboardUpdate={handleDashboardUpdate} />
      </div>

      {/* Photo Area - 60% (Left side in RTL) */}
      <div 
        className="w-3/5 relative"
        style={{
          backgroundImage: 'url(/lovable-uploads/f7658506-ad00-4cf7-a7c1-fb72fdbe720d.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-900/20' : 'bg-white/10'} backdrop-blur-[1px]`}>
          <DashboardContent 
            data={dashboardData} 
            theme={theme} 
            language={language}
            isRTL={true}
            content={{}}
          />
        </div>
      </div>
    </div>
  );
}
