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
    <div className="h-screen overflow-y-auto p-6">
      {/* Header */}
      <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {content.title}
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
          {content.welcome}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(data?.stats || defaultStats).map((stat: any, index: number) => (
          <Card key={index} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/90'} backdrop-blur-sm`}>
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
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/90'} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {content.recentActivity}
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
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/90'} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {content.quickActions}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {content.viewReports}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  {content.manageUsers}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  {content.addProduct}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  {content.settings}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
