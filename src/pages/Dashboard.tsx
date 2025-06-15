
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ChatInterface } from "@/components/ChatInterface";
import { useState } from "react";
import { DashboardContent } from "@/components/DashboardContent";

export default function Dashboard() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<any>(null);

  const content = {
    ar: {
      title: "لوحة التحكم",
      welcome: "أهلاً بك في لوحة التحكم",
      overview: "نظرة عامة",
      totalSales: "إجمالي المبيعات",
      totalUsers: "إجمالي المستخدمين",
      totalOrders: "إجمالي الطلبات",
      growth: "النمو",
      recentActivity: "النشاط الأخير",
      quickActions: "إجراءات سريعة",
      viewReports: "عرض التقارير",
      manageUsers: "إدارة المستخدمين",
      addProduct: "إضافة منتج",
      settings: "الإعدادات"
    },
    en: {
      title: "Dashboard",
      welcome: "Welcome to your Dashboard",
      overview: "Overview",
      totalSales: "Total Sales",
      totalUsers: "Total Users",
      totalOrders: "Total Orders",
      growth: "Growth",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      viewReports: "View Reports",
      manageUsers: "Manage Users",
      addProduct: "Add Product",
      settings: "Settings"
    }
  };

  const t = content[language];

  const handleDashboardUpdate = (data: any) => {
    setDashboardData(data);
  };

  return (
    <MainLayout>
      <div 
        className="min-h-screen flex w-full" 
        dir="rtl"
        style={{
          backgroundImage: 'url(/lovable-uploads/39febb03-65a7-47c5-9aca-0d3db40793e8.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dashboard/Image Area - 60% (Left side in RTL) */}
        <div className={`w-3/5 ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-sm`}>
          <DashboardContent 
            data={dashboardData} 
            theme={theme} 
            language={language}
            isRTL={true}
            content={t}
          />
        </div>

        {/* Chat Area - 40% (Right side in RTL) */}
        <div className={`w-2/5 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-l border-gray-200`}>
          <ChatInterface onBack={() => {}} onDashboardUpdate={handleDashboardUpdate} />
        </div>
      </div>
    </MainLayout>
  );
}
