
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, ShoppingCart, TrendingUp, Plus, Settings, PieChart, LineChart } from "lucide-react";
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

  // Arabic action buttons
  const arabicActions = [
    { text: "عرض التقارير", icon: BarChart3, color: "from-blue-500 to-blue-600" },
    { text: "إدارة المستخدمين", icon: Users, color: "from-green-500 to-green-600" },
    { text: "إضافة منتج", icon: Plus, color: "from-purple-500 to-purple-600" },
    { text: "الإعدادات", icon: Settings, color: "from-orange-500 to-orange-600" }
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
      {/* Arabic Header with Overlay */}
      <div className="mb-8 text-right relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent rounded-lg"></div>
        <div className="relative p-6">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            مرحباً بك في منصة زد
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            لوحة التحكم الذكية لإدارة أعمالك
          </p>
        </div>
      </div>

      {/* Arabic Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {arabicActions.map((action, index) => (
          <Button
            key={index}
            className={`h-16 bg-gradient-to-r ${action.color} hover:scale-105 transform transition-all duration-200 text-white font-bold text-lg rounded-2xl shadow-lg border-0`}
          >
            <action.icon className="w-6 h-6 ml-3" />
            {action.text}
          </Button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(data?.stats || defaultStats).map((stat: any, index: number) => (
          <Card key={index} className={`${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90'} backdrop-blur-sm rounded-2xl shadow-lg`}>
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

      {/* Dynamic Chart Section */}
      {data && renderChart()}

      {/* Default Content when no specific data */}
      {!data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className={`${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90'} backdrop-blur-sm rounded-2xl shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-right`}>
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "طلب جديد تم استلامه", desc: "طلب رقم #1234", time: "منذ ساعة" },
                    { title: "تم إتمام عملية بيع", desc: "بقيمة 150 ريال", time: "منذ ساعتين" },
                    { title: "عميل جديد انضم", desc: "أحمد محمد", time: "منذ 3 ساعات" },
                    { title: "تحديث المخزون", desc: "تم إضافة 50 منتج", time: "منذ 4 ساعات" }
                  ].map((item, index) => (
                    <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80'}`}>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 text-right">
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {item.title}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.desc}
                        </p>
                      </div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card className={`${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90'} backdrop-blur-sm rounded-2xl shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-right`}>
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
                  <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    127
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    عدد الطلبات اليوم
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
                  <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ٨٥٪
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    معدل رضا العملاء
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl">
                  <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ١٢٫٣ك
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
