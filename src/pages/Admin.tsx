import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedAdmin } from "@/components/ProtectedAdmin";
import { AgentMonitoring } from "@/components/admin/AgentMonitoring";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Database, Activity, MessageSquare, Shield, UserCheck, Settings, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AdminStats {
  totalUsers: number;
  totalConversations: number;
  activeAgents: number;
  totalSubscriptions: number;
}

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  roles: string[];
}

export default function Admin() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalConversations: 0,
    activeAgents: 8,
    totalSubscriptions: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const content = {
    ar: {
      title: "لوحة تحكم الأدمن",
      overview: "نظرة عامة على النظام",
      userManagement: "إدارة المستخدمين",
      totalUsers: "إجمالي المستخدمين",
      totalConversations: "إجمالي المحادثات",
      activeAgents: "الوكلاء النشطين",
      totalSubscriptions: "إجمالي الاشتراكات",
      email: "البريد الإلكتروني",
      joinDate: "تاريخ التسجيل",
      lastLogin: "آخر تسجيل دخول",
      roles: "الأدوار",
      actions: "الإجراءات",
      makeAdmin: "جعل أدمن",
      removeAdmin: "إزالة الأدمن",
      viewProfile: "عرض الملف الشخصي",
      loading: "جاري التحميل...",
      noUsers: "لا يوجد مستخدمين",
      success: "تم بنجاح",
      error: "خطأ",
      roleUpdated: "تم تحديث الدور بنجاح",
      roleUpdateFailed: "فشل في تحديث الدور"
    },
    en: {
      title: "Admin Dashboard",
      overview: "System Overview",
      userManagement: "User Management",
      totalUsers: "Total Users",
      totalConversations: "Total Conversations",
      activeAgents: "Active Agents",
      totalSubscriptions: "Total Subscriptions",
      email: "Email",
      joinDate: "Join Date",
      lastLogin: "Last Login",
      roles: "Roles",
      actions: "Actions",
      makeAdmin: "Make Admin",
      removeAdmin: "Remove Admin",
      viewProfile: "View Profile",
      loading: "Loading...",
      noUsers: "No users found",
      success: "Success",
      error: "Error",
      roleUpdated: "Role updated successfully",
      roleUpdateFailed: "Failed to update role"
    }
  };

  const t = content[language];

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);

      // Load stats
      const [usersResponse, conversationsResponse, subscriptionsResponse] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact' }),
        supabase.from('conversations').select('id', { count: 'exact' }),
        supabase.from('user_subscriptions').select('id', { count: 'exact' })
      ]);

      setStats({
        totalUsers: usersResponse.count || 0,
        totalConversations: conversationsResponse.count || 0,
        activeAgents: 8,
        totalSubscriptions: subscriptionsResponse.count || 0
      });

      // Load users with roles
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error loading users:', authError);
        return;
      }

      // Get user roles
      const userIds = authUsers.users.map(user => user.id);
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (rolesError) {
        console.error('Error loading user roles:', rolesError);
      }

      const usersWithRoles = authUsers.users.map(user => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at || '',
        roles: userRoles?.filter(role => role.user_id === user.id).map(role => role.role) || []
      }));

      setUsers(usersWithRoles);

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: t.error,
        description: "فشل في تحميل بيانات الأدمن",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });

        if (error) throw error;
      }

      toast({
        title: t.success,
        description: t.roleUpdated,
      });

      // Reload data
      loadAdminData();

    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: t.error,
        description: t.roleUpdateFailed,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <ProtectedAdmin>
      <div className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t.title}
              </h1>
              <p className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                إدارة شاملة لنظام مورفو
              </p>
            </div>
            <Button
              onClick={() => navigate('/admin/api-settings')}
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              إعدادات APIs
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalConversations}</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalConversations}</div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.activeAgents}</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeAgents}</div>
                <Badge variant="secondary" className="mt-2">جميع الوكلاء متصلون</Badge>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalSubscriptions}</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="agents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="agents">
                <Bot className="w-4 h-4 mr-2" />
                مراقبة الوكلاء
              </TabsTrigger>
              <TabsTrigger value="users">
                <Shield className="w-4 h-4 mr-2" />
                {t.userManagement}
              </TabsTrigger>
            </TabsList>

            {/* Agent Monitoring Tab */}
            <TabsContent value="agents">
              <AgentMonitoring />
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users">
              <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t.userManagement}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p>{t.loading}</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <p>{t.noUsers}</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.email}</TableHead>
                          <TableHead>{t.joinDate}</TableHead>
                          <TableHead>{t.lastLogin}</TableHead>
                          <TableHead>{t.roles}</TableHead>
                          <TableHead>{t.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>{formatDate(user.created_at)}</TableCell>
                            <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {user.roles.map((role) => (
                                  <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
                                    {role}
                                  </Badge>
                                ))}
                                {user.roles.length === 0 && (
                                  <Badge variant="outline">user</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={user.roles.includes('admin') ? 'destructive' : 'default'}
                                  onClick={() => toggleAdminRole(user.id, user.roles.includes('admin'))}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  {user.roles.includes('admin') ? t.removeAdmin : t.makeAdmin}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedAdmin>
  );
}
