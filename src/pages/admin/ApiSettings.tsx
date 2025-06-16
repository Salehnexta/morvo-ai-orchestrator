
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Key, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Eye,
  EyeOff,
  TestTube,
  Save,
  AlertCircle
} from "lucide-react";

interface ApiConfig {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  isActive: boolean;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  endpoint: string;
  syncInterval: number; // في الدقائق
}

export default function ApiSettings() {
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [isTesting, setIsTesting] = useState<{[key: string]: boolean}>({});
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([
    {
      id: 'moyasar',
      name: 'Moyasar Payment',
      description: 'نظام الدفع الإلكتروني',
      apiKey: '',
      isActive: false,
      lastSync: '2024-01-15T10:30:00Z',
      status: 'disconnected',
      endpoint: 'https://api.moyasar.com/v1',
      syncInterval: 60
    },
    {
      id: 'brand24',
      name: 'Brand24',
      description: 'مراقبة العلامة التجارية',
      apiKey: '',
      isActive: false,
      lastSync: '2024-01-15T09:45:00Z',
      status: 'disconnected',
      endpoint: 'https://api.brand24.com/v2',
      syncInterval: 30
    },
    {
      id: 'semrush',
      name: 'SEMrush',
      description: 'تحليلات SEO والكلمات المفتاحية',
      apiKey: '',
      isActive: false,
      lastSync: '2024-01-15T08:20:00Z',
      status: 'disconnected',
      endpoint: 'https://api.semrush.com',
      syncInterval: 120
    },
    {
      id: 'facebook',
      name: 'Facebook/Meta',
      description: 'بيانات وسائل التواصل الاجتماعي',
      apiKey: '',
      isActive: false,
      lastSync: '2024-01-15T11:15:00Z',
      status: 'disconnected',
      endpoint: 'https://graph.facebook.com/v18.0',
      syncInterval: 15
    },
    {
      id: 'google',
      name: 'Google Analytics',
      description: 'تحليلات موقع الويب',
      apiKey: '',
      isActive: false,
      lastSync: '2024-01-15T07:30:00Z',
      status: 'disconnected',
      endpoint: 'https://analyticsreporting.googleapis.com/v4',
      syncInterval: 60
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'إحصائيات البريد الإلكتروني',
      apiKey: '',
      isActive: false,
      lastSync: '2024-01-15T06:45:00Z',
      status: 'disconnected',
      endpoint: 'https://us1.api.mailchimp.com/3.0',
      syncInterval: 30
    }
  ]);

  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();

  const content = {
    ar: {
      title: "إعدادات APIs",
      description: "إدارة تكامل APIs الخارجية",
      apiConfigs: "تكوين APIs",
      webhooks: "Webhooks",
      dataSources: "مصادر البيانات",
      apiName: "اسم API",
      status: "الحالة",
      lastSync: "آخر مزامنة",
      actions: "الإجراءات",
      connected: "متصل",
      disconnected: "غير متصل",
      error: "خطأ",
      testing: "جاري الاختبار",
      apiKey: "مفتاح API",
      endpoint: "نقطة النهاية",
      syncInterval: "فترة المزامنة (دقائق)",
      isActive: "نشط",
      testConnection: "اختبار الاتصال",
      saveConfig: "حفظ التكوين",
      showKey: "إظهار المفتاح",
      hideKey: "إخفاء المفتاح",
      success: "نجح",
      failed: "فشل",
      saved: "تم الحفظ",
      configSaved: "تم حفظ التكوين بنجاح",
      testSuccessful: "اختبار الاتصال نجح",
      testFailed: "فشل اختبار الاتصال",
      enterApiKey: "أدخل مفتاح API",
      webhookUrl: "رابط Webhook",
      eventTypes: "أنواع الأحداث",
      dataSourceName: "اسم مصدر البيانات",
      refreshRate: "معدل التحديث",
      minutes: "دقائق"
    },
    en: {
      title: "API Settings",
      description: "Manage external API integrations",
      apiConfigs: "API Configurations",
      webhooks: "Webhooks",
      dataSources: "Data Sources",
      apiName: "API Name",
      status: "Status",
      lastSync: "Last Sync",
      actions: "Actions",
      connected: "Connected",
      disconnected: "Disconnected",
      error: "Error",
      testing: "Testing",
      apiKey: "API Key",
      endpoint: "Endpoint",
      syncInterval: "Sync Interval (minutes)",
      isActive: "Active",
      testConnection: "Test Connection",
      saveConfig: "Save Config",
      showKey: "Show Key",
      hideKey: "Hide Key",
      success: "Success",
      failed: "Failed",
      saved: "Saved",
      configSaved: "Configuration saved successfully",
      testSuccessful: "Connection test successful",
      testFailed: "Connection test failed",
      enterApiKey: "Enter API Key",
      webhookUrl: "Webhook URL",
      eventTypes: "Event Types",
      dataSourceName: "Data Source Name",
      refreshRate: "Refresh Rate",
      minutes: "minutes"
    }
  };

  const t = content[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'disconnected': return 'secondary';
      case 'error': return 'destructive';
      case 'testing': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'testing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const toggleShowKey = (apiId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [apiId]: !prev[apiId]
    }));
  };

  const updateApiConfig = (apiId: string, updates: Partial<ApiConfig>) => {
    setApiConfigs(prev => 
      prev.map(config => 
        config.id === apiId ? { ...config, ...updates } : config
      )
    );
  };

  const testConnection = async (apiId: string) => {
    const config = apiConfigs.find(c => c.id === apiId);
    if (!config || !config.apiKey) {
      toast({
        title: t.failed,
        description: t.enterApiKey,
        variant: "destructive",
      });
      return;
    }

    setIsTesting(prev => ({ ...prev, [apiId]: true }));
    updateApiConfig(apiId, { status: 'testing' });

    // محاكاة اختبار الاتصال
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% نسبة نجاح
      updateApiConfig(apiId, { 
        status: success ? 'connected' : 'error',
        lastSync: success ? new Date().toISOString() : config.lastSync
      });
      
      setIsTesting(prev => ({ ...prev, [apiId]: false }));
      
      toast({
        title: success ? t.success : t.failed,
        description: success ? t.testSuccessful : t.testFailed,
        variant: success ? "default" : "destructive",
      });
    }, 2000);
  };

  const saveConfig = (apiId: string) => {
    toast({
      title: t.saved,
      description: t.configSaved,
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}س`;
    return `${minutes}د`;
  };

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>

        <Tabs defaultValue="apis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apis">{t.apiConfigs}</TabsTrigger>
            <TabsTrigger value="webhooks">{t.webhooks}</TabsTrigger>
            <TabsTrigger value="sources">{t.dataSources}</TabsTrigger>
          </TabsList>

          {/* API Configurations Tab */}
          <TabsContent value="apis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {apiConfigs.map((config) => (
                <Card key={config.id} className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{config.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(config.status)}
                        <Badge variant={getStatusColor(config.status)}>
                          {t[config.status as keyof typeof t]}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* API Key */}
                    <div className="space-y-2">
                      <Label htmlFor={`${config.id}-key`}>{t.apiKey}</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`${config.id}-key`}
                          type={showKeys[config.id] ? "text" : "password"}
                          value={config.apiKey}
                          onChange={(e) => updateApiConfig(config.id, { apiKey: e.target.value })}
                          placeholder={t.enterApiKey}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleShowKey(config.id)}
                        >
                          {showKeys[config.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Endpoint */}
                    <div className="space-y-2">
                      <Label>{t.endpoint}</Label>
                      <Input 
                        value={config.endpoint} 
                        onChange={(e) => updateApiConfig(config.id, { endpoint: e.target.value })}
                      />
                    </div>

                    {/* Sync Interval */}
                    <div className="space-y-2">
                      <Label>{t.syncInterval}</Label>
                      <Input 
                        type="number"
                        value={config.syncInterval}
                        onChange={(e) => updateApiConfig(config.id, { syncInterval: parseInt(e.target.value) })}
                      />
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between">
                      <Label>{t.isActive}</Label>
                      <Switch
                        checked={config.isActive}
                        onCheckedChange={(checked) => updateApiConfig(config.id, { isActive: checked })}
                      />
                    </div>

                    {/* Last Sync */}
                    <div className="text-sm text-muted-foreground">
                      {t.lastSync}: {formatTimeAgo(config.lastSync)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection(config.id)}
                        disabled={isTesting[config.id] || !config.apiKey}
                      >
                        <TestTube className="w-4 h-4 mr-2" />
                        {t.testConnection}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveConfig(config.id)}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {t.saveConfig}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>{t.webhooks}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Moyasar Payment Webhook</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.webhookUrl}: https://teniefzxdikestahdnur.supabase.co/functions/v1/moyasar-webhook
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary">payment.success</Badge>
                      <Badge variant="secondary" className="ml-2">payment.failed</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Brand24 Data Sync</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.webhookUrl}: https://teniefzxdikestahdnur.supabase.co/functions/v1/brand24-sync
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary">mention.new</Badge>
                      <Badge variant="secondary" className="ml-2">sentiment.change</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="sources">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>{t.dataSources}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-sm text-muted-foreground">بيانات الموقع الإلكتروني</p>
                      <div className="mt-2 text-sm">
                        <div>{t.refreshRate}: 60 {t.minutes}</div>
                        <Badge variant="default" className="mt-1">نشط</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Facebook Insights</h4>
                      <p className="text-sm text-muted-foreground">بيانات وسائل التواصل</p>
                      <div className="mt-2 text-sm">
                        <div>{t.refreshRate}: 15 {t.minutes}</div>
                        <Badge variant="default" className="mt-1">نشط</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Email Analytics</h4>
                      <p className="text-sm text-muted-foreground">إحصائيات البريد الإلكتروني</p>
                      <div className="mt-2 text-sm">
                        <div>{t.refreshRate}: 30 {t.minutes}</div>
                        <Badge variant="secondary" className="mt-1">متوقف</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
