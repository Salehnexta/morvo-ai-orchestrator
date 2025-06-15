import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, ShoppingCart, TrendingUp, Plus, Settings, PieChart, LineChart, FileBarChart, UserCog } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

interface DashboardContentProps {
  data: any;
  theme: string;
  language: string;
  isRTL: boolean;
  content: any;
}

export const DashboardContent = ({ data, theme, language, isRTL, content }: DashboardContentProps) => {
  const defaultStats = [
    { title: content.totalSales, value: "$24,567", change: "+12%", icon: TrendingUp },
    { title: content.totalUsers, value: "1,234", change: "+8%", icon: Users },
    { title: content.totalOrders, value: "567", change: "+15%", icon: ShoppingCart },
    { title: content.growth, value: "23%", change: "+3%", icon: BarChart3 }
  ];

  const salesData = [
    { month: "Jan", sales: 4000, orders: 240 },
    { month: "Feb", sales: 3000, orders: 139 },
    { month: "Mar", sales: 2000, orders: 980 },
    { month: "Apr", sales: 2780, orders: 390 },
    { month: "May", sales: 1890, orders: 480 },
    { month: "Jun", sales: 2390, orders: 380 },
  ];

  const pieData = [
    { name: 'Desktop', value: 400, fill: '#3B82F6' },
    { name: 'Mobile', value: 300, fill: '#10B981' },
    { name: 'Tablet', value: 200, fill: '#F59E0B' },
    { name: 'Other', value: 100, fill: '#EF4444' },
  ];

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders", 
      color: "hsl(var(--chart-2))",
    },
  };

  // Enhanced Arabic action buttons with improved styling
  const arabicActions = [
    { text: "عرض التقارير المالية", icon: FileBarChart, color: "from-indigo-500 via-purple-500 to-pink-500", bgOpacity: "bg-white/10" },
    { text: "إدارة المستخدمين", icon: UserCog, color: "from-emerald-500 via-teal-500 to-cyan-500", bgOpacity: "bg-white/10" },
    { text: "إضافة منتج جديد", icon: Plus, color: "from-orange-500 via-red-500 to-pink-500", bgOpacity: "bg-white/10" },
    { text: "إعدادات النظام", icon: Settings, color: "from-violet-500 via-purple-500 to-blue-500", bgOpacity: "bg-white/10" }
  ];

  const renderChart = () => {
    if (!data || !data.chartType) return null;

    switch (data.chartType) {
      case 'bar':
        return (
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/90'} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                {data.title || 'Sales Analytics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.data || salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case 'line':
        return (
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/90'} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                {data.title || 'Trend Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={data.data || salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case 'pie':
        return (
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/90'} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                {data.title || 'Distribution Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={data.data || pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {(data.data || pieData).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-y-auto p-6 font-cairo" dir="rtl">
      {/* Enhanced Arabic Header with Premium Styling */}
      <div className="mb-8 text-right relative">
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent rounded-3xl"></div>
        <div className="relative p-8 backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-3 leading-tight">
            مرحباً بك في منصة زد
          </h1>
          <p className="text-2xl text-white/95 drop-shadow-lg font-medium">
            لوحة التحكم الذكية لإدارة أعمالك بكفاءة عالية
          </p>
          <div className="mt-4 flex items-center justify-end gap-4">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full">
              <span className="text-white font-medium">نشط الآن</span>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          </div>
        </div>
      </div>

      {/* Premium Arabic Action Buttons */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {arabicActions.map((action, index) => (
          <Button
            key={index}
            className={`h-20 bg-gradient-to-br ${action.color} hover:scale-105 transform transition-all duration-300 text-white font-bold text-lg rounded-3xl shadow-2xl border-0 backdrop-blur-md ${action.bgOpacity} hover:shadow-3xl group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            <div className="relative flex items-center gap-4">
              <action.icon className="w-7 h-7 drop-shadow-lg" />
              <span className="drop-shadow-lg">{action.text}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(data?.stats || defaultStats).map((stat: any, index: number) => (
          <Card key={index} className={`${theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95'} backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  من الشهر الماضي
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dynamic Chart Section */}
      {data && renderChart()}

      {/* Enhanced Default Content */}
      {!data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className={`${theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95'} backdrop-blur-md rounded-3xl shadow-xl border-0`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-right text-xl`}>
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "طلب جديد تم استلامه", desc: "طلب رقم #1234", time: "منذ ساعة", color: "from-blue-500 to-purple-600" },
                    { title: "تم إتمام عملية بيع", desc: "بقيمة 150 ريال", time: "منذ ساعتين", color: "from-green-500 to-teal-600" },
                    { title: "عميل جديد انضم", desc: "أحمد محمد", time: "منذ 3 ساعات", color: "from-orange-500 to-red-600" },
                    { title: "تحديث المخزون", desc: "تم إضافة 50 منتج", time: "منذ 4 ساعات", color: "from-purple-500 to-pink-600" }
                  ].map((item, index) => (
                    <div key={index} className={`flex items-center gap-4 p-4 rounded-2xl ${theme === 'dark' ? 'bg-gray-700/70' : 'bg-gray-50/90'} backdrop-blur-sm hover:scale-102 transition-transform duration-200`}>
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 text-right">
                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
                          {item.title}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.desc}
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full`}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Stats */}
          <div>
            <Card className={`${theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95'} backdrop-blur-md rounded-3xl shadow-xl border-0`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-right text-xl`}>
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm">
                  <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                    127
                  </div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    عدد الطلبات اليوم
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-sm">
                  <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                    ٨٥٪
                  </div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    معدل رضا العملاء
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm">
                  <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                    ١٢٫٣ك
                  </div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    إجمالي المبيعات (ريال)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
