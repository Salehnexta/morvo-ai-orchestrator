
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Activity, 
  Bot, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react";
import { mockAgents, mockA2AMessages, mockSystemAlerts, AgentStatus, A2AMessage } from "@/services/mockAgentData";

export const AgentMonitoring = () => {
  const [agents, setAgents] = useState<AgentStatus[]>(mockAgents);
  const [messages, setMessages] = useState<A2AMessage[]>(mockA2AMessages);
  const [alerts, setAlerts] = useState(mockSystemAlerts);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      title: "مراقبة الوكلاء",
      agentsOverview: "نظرة عامة على الوكلاء",
      a2aMessages: "رسائل A2A",
      systemAlerts: "تنبيهات النظام",
      agentName: "اسم الوكيل",
      status: "الحالة",
      lastActivity: "آخر نشاط",
      performance: "الأداء",
      tasks: "المهام",
      refresh: "تحديث",
      active: "نشط",
      busy: "مشغول",
      idle: "خامل",
      error: "خطأ",
      offline: "غير متصل",
      successRate: "معدل النجاح",
      avgResponseTime: "متوسط وقت الاستجابة",
      tasksCompleted: "المهام المكتملة",
      todayTasks: "مهام اليوم",
      sender: "المرسل",
      recipient: "المستقبل",
      taskType: "نوع المهمة",
      messageStatus: "حالة الرسالة",
      priority: "الأولوية",
      timestamp: "الوقت",
      alertType: "نوع التنبيه",
      message: "الرسالة",
      severity: "الخطورة",
      resolved: "محلول",
      yes: "نعم",
      no: "لا",
      sent: "مرسل",
      received: "مستقبل",
      processing: "قيد المعالجة",
      completed: "مكتمل",
      failed: "فاشل",
      high: "عالي",
      medium: "متوسط",
      low: "منخفض",
      urgent: "عاجل",
      warning: "تحذير",
      success: "نجاح",
      ms: "مللي ثانية",
      lastUpdated: "آخر تحديث"
    },
    en: {
      title: "Agent Monitoring",
      agentsOverview: "Agents Overview",
      a2aMessages: "A2A Messages",
      systemAlerts: "System Alerts",
      agentName: "Agent Name",
      status: "Status",
      lastActivity: "Last Activity",
      performance: "Performance",
      tasks: "Tasks",
      refresh: "Refresh",
      active: "Active",
      busy: "Busy",
      idle: "Idle",
      error: "Error",
      offline: "Offline",
      successRate: "Success Rate",
      avgResponseTime: "Avg Response Time",
      tasksCompleted: "Tasks Completed",
      todayTasks: "Today's Tasks",
      sender: "Sender",
      recipient: "Recipient",
      taskType: "Task Type",
      messageStatus: "Message Status",
      priority: "Priority",
      timestamp: "Timestamp",
      alertType: "Alert Type",
      message: "Message",
      severity: "Severity",
      resolved: "Resolved",
      yes: "Yes",
      no: "No",
      sent: "Sent",
      received: "Received",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      high: "High",
      medium: "Medium",
      low: "Low",
      urgent: "Urgent",
      warning: "Warning",
      success: "Success",
      ms: "ms",
      lastUpdated: "Last Updated"
    }
  };

  const t = content[language];

  useEffect(() => {
    // محاكاة التحديث التلقائي كل 30 ثانية
    const interval = setInterval(() => {
      // تحديث وهمي لحالة الوكلاء
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          lastActivity: Math.random() > 0.7 ? new Date().toISOString() : agent.lastActivity,
          status: Math.random() > 0.9 ? 
            ['active', 'busy', 'idle'][Math.floor(Math.random() * 3)] as any : 
            agent.status
        }))
      );
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'idle': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-800';
      default: return 'bg-gray-500';
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      case 'sent': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}س`;
    return `${minutes}د`;
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // محاكاة تحديث البيانات
    setAgents([...mockAgents]);
    setMessages([...mockA2AMessages]);
    setAlerts([...mockSystemAlerts]);
  };

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-sm text-muted-foreground">
            {t.lastUpdated}: {lastUpdate.toLocaleTimeString('ar-SA')}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t.refresh}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الوكلاء النشطين</CardTitle>
            <Bot className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              من أصل {agents.length} وكيل
            </p>
          </CardContent>
        </Card>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رسائل A2A اليوم</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {messages.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {messages.filter(m => m.status === 'completed').length} مكتملة
            </p>
          </CardContent>
        </Card>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الأداء</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {Math.round(agents.reduce((acc, a) => acc + a.performance.successRate, 0) / agents.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              معدل النجاح الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التنبيهات النشطة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {alerts.filter(a => !a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">
              تتطلب إجراء
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">{t.agentsOverview}</TabsTrigger>
          <TabsTrigger value="messages">{t.a2aMessages}</TabsTrigger>
          <TabsTrigger value="alerts">{t.systemAlerts}</TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                      <Badge variant="outline">{t[agent.status as keyof typeof t] || agent.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">{t.successRate}:</span>
                      <div className="text-green-600 font-bold">{agent.performance.successRate}%</div>
                    </div>
                    <div>
                      <span className="font-medium">{t.avgResponseTime}:</span>
                      <div className="text-blue-600 font-bold">{agent.performance.avgResponseTime}{t.ms}</div>
                    </div>
                    <div>
                      <span className="font-medium">{t.todayTasks}:</span>
                      <div className="text-purple-600 font-bold">{agent.metrics.todayTasks}</div>
                    </div>
                    <div>
                      <span className="font-medium">{t.lastActivity}:</span>
                      <div className="text-gray-600 font-bold">{formatTimeAgo(agent.lastActivity)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">القدرات:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle>{t.a2aMessages}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.sender}</TableHead>
                    <TableHead>{t.recipient}</TableHead>
                    <TableHead>{t.taskType}</TableHead>
                    <TableHead>{t.messageStatus}</TableHead>
                    <TableHead>{t.priority}</TableHead>
                    <TableHead>{t.timestamp}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">
                        {agents.find(a => a.id === message.senderAgentId)?.name || message.senderAgentId}
                      </TableCell>
                      <TableCell>
                        {agents.find(a => a.id === message.recipientAgentId)?.name || message.recipientAgentId}
                      </TableCell>
                      <TableCell>{message.taskType}</TableCell>
                      <TableCell>
                        <Badge variant={getMessageStatusColor(message.status)}>
                          {t[message.status as keyof typeof t] || message.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(message.priority)}>
                          {t[message.priority as keyof typeof t] || message.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatTimeAgo(message.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle>{t.systemAlerts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${
                    alert.type === 'error' ? 'border-red-200 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  } ${theme === 'dark' ? 'bg-opacity-10' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
                        {alert.type === 'warning' && <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />}
                        {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimeAgo(alert.timestamp)} • {t[alert.severity as keyof typeof t]} • 
                            {alert.resolved ? ` ${t.resolved}` : ` غير ${t.resolved}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={alert.resolved ? 'secondary' : 'destructive'}>
                        {alert.resolved ? t.resolved : 'نشط'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
