
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, ShoppingCart, TrendingUp, Plus, Settings } from "lucide-react";

export default function Dashboard() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

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

  const stats = [
    { title: t.totalSales, value: "$24,567", change: "+12%", icon: TrendingUp },
    { title: t.totalUsers, value: "1,234", change: "+8%", icon: Users },
    { title: t.totalOrders, value: "567", change: "+15%", icon: ShoppingCart },
    { title: t.growth, value: "23%", change: "+3%", icon: BarChart3 }
  ];

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              {t.welcome}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.recentActivity}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className={`flex items-center gap-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{item}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Activity {item}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Description of activity {item}
                          </p>
                        </div>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item}h ago
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.quickActions}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {t.viewReports}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    {t.manageUsers}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addProduct}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    {t.settings}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
