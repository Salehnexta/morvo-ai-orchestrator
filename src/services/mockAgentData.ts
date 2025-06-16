
// خدمة البيانات الوهمية للوكلاء
export interface AgentStatus {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'busy' | 'error' | 'offline';
  description: string;
  capabilities: string[];
  lastActivity: string;
  performance: {
    successRate: number;
    avgResponseTime: number;
    tasksCompleted: number;
    errorsCount: number;
  };
  metrics: {
    todayTasks: number;
    weeklyTasks: number;
    monthlyTasks: number;
  };
}

export interface A2AMessage {
  id: string;
  senderAgentId: string;
  recipientAgentId: string;
  taskType: string;
  content: string;
  status: 'sent' | 'received' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  retryCount: number;
  response?: any;
}

export const mockAgents: AgentStatus[] = [
  {
    id: 'client_experience_agent',
    name: 'وكيل تجربة العملاء',
    type: 'master',
    status: 'active',
    description: 'الوكيل الرئيسي لإدارة تجربة العملاء وتنسيق المهام',
    capabilities: ['customer_interaction', 'task_coordination', 'decision_making', 'reporting'],
    lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    performance: {
      successRate: 98.5,
      avgResponseTime: 1200,
      tasksCompleted: 1847,
      errorsCount: 12
    },
    metrics: {
      todayTasks: 23,
      weeklyTasks: 156,
      monthlyTasks: 672
    }
  },
  {
    id: 'social_media_agent',
    name: 'وكيل وسائل التواصل الاجتماعي',
    type: 'specialist',
    status: 'busy',
    description: 'إدارة وتحليل وسائل التواصل الاجتماعي',
    capabilities: ['content_analysis', 'engagement_tracking', 'sentiment_analysis', 'post_scheduling'],
    lastActivity: new Date(Date.now() - 30 * 1000).toISOString(),
    performance: {
      successRate: 96.2,
      avgResponseTime: 800,
      tasksCompleted: 2341,
      errorsCount: 8
    },
    metrics: {
      todayTasks: 45,
      weeklyTasks: 289,
      monthlyTasks: 1205
    }
  },
  {
    id: 'seo_agent',
    name: 'وكيل تحسين محركات البحث',
    type: 'specialist',
    status: 'active',
    description: 'تحليل وتحسين محركات البحث والكلمات المفتاحية',
    capabilities: ['keyword_analysis', 'ranking_tracking', 'content_optimization', 'technical_seo'],
    lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    performance: {
      successRate: 94.7,
      avgResponseTime: 1500,
      tasksCompleted: 987,
      errorsCount: 15
    },
    metrics: {
      todayTasks: 18,
      weeklyTasks: 124,
      monthlyTasks: 534
    }
  },
  {
    id: 'brand_monitoring_agent',
    name: 'وكيل مراقبة العلامة التجارية',
    type: 'specialist',
    status: 'active',
    description: 'مراقبة وتحليل ذكر العلامة التجارية والسمعة',
    capabilities: ['mention_tracking', 'sentiment_monitoring', 'crisis_detection', 'reputation_analysis'],
    lastActivity: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    performance: {
      successRate: 97.8,
      avgResponseTime: 900,
      tasksCompleted: 1456,
      errorsCount: 5
    },
    metrics: {
      todayTasks: 31,
      weeklyTasks: 198,
      monthlyTasks: 856
    }
  },
  {
    id: 'analytics_agent',
    name: 'وكيل التحليلات',
    type: 'specialist',
    status: 'idle',
    description: 'تحليل البيانات وإنشاء التقارير والرؤى',
    capabilities: ['data_analysis', 'report_generation', 'trend_identification', 'predictive_analytics'],
    lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    performance: {
      successRate: 99.1,
      avgResponseTime: 2100,
      tasksCompleted: 743,
      errorsCount: 3
    },
    metrics: {
      todayTasks: 12,
      weeklyTasks: 87,
      monthlyTasks: 378
    }
  },
  {
    id: 'paid_ads_agent',
    name: 'وكيل الإعلانات المدفوعة',
    type: 'specialist',
    status: 'busy',
    description: 'إدارة وتحسين الحملات الإعلانية المدفوعة',
    capabilities: ['campaign_management', 'bid_optimization', 'audience_targeting', 'performance_tracking'],
    lastActivity: new Date(Date.now() - 45 * 1000).toISOString(),
    performance: {
      successRate: 95.4,
      avgResponseTime: 1800,
      tasksCompleted: 1234,
      errorsCount: 18
    },
    metrics: {
      todayTasks: 28,
      weeklyTasks: 167,
      monthlyTasks: 723
    }
  },
  {
    id: 'email_marketing_agent',
    name: 'وكيل التسويق عبر البريد الإلكتروني',
    type: 'specialist',
    status: 'active',
    description: 'إدارة حملات البريد الإلكتروني وتحليل الأداء',
    capabilities: ['email_campaigns', 'list_management', 'automation', 'deliverability_optimization'],
    lastActivity: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    performance: {
      successRate: 96.8,
      avgResponseTime: 1100,
      tasksCompleted: 892,
      errorsCount: 7
    },
    metrics: {
      todayTasks: 19,
      weeklyTasks: 134,
      monthlyTasks: 567
    }
  },
  {
    id: 'content_management_agent',
    name: 'وكيل إدارة المحتوى',
    type: 'specialist',
    status: 'error',
    description: 'إنشاء وإدارة وتحسين المحتوى التسويقي',
    capabilities: ['content_creation', 'content_optimization', 'content_scheduling', 'content_analysis'],
    lastActivity: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    performance: {
      successRate: 93.2,
      avgResponseTime: 2500,
      tasksCompleted: 1567,
      errorsCount: 23
    },
    metrics: {
      todayTasks: 34,
      weeklyTasks: 245,
      monthlyTasks: 1034
    }
  },
  {
    id: 'competitor_analysis_agent',
    name: 'وكيل تحليل المنافسين',
    type: 'specialist',
    status: 'active',
    description: 'مراقبة وتحليل أنشطة المنافسين والسوق',
    capabilities: ['competitor_tracking', 'market_analysis', 'pricing_analysis', 'strategy_insights'],
    lastActivity: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    performance: {
      successRate: 97.1,
      avgResponseTime: 1900,
      tasksCompleted: 645,
      errorsCount: 9
    },
    metrics: {
      todayTasks: 15,
      weeklyTasks: 98,
      monthlyTasks: 423
    }
  }
];

export const mockA2AMessages: A2AMessage[] = [
  {
    id: 'msg_001',
    senderAgentId: 'client_experience_agent',
    recipientAgentId: 'analytics_agent',
    taskType: 'data_request',
    content: 'طلب تقرير أداء الحملات التسويقية للأسبوع الماضي',
    status: 'completed',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    priority: 'high',
    retryCount: 0,
    response: {
      success: true,
      data: 'تم إنشاء التقرير بنجاح'
    }
  },
  {
    id: 'msg_002',
    senderAgentId: 'social_media_agent',
    recipientAgentId: 'content_management_agent',
    taskType: 'content_collaboration',
    content: 'طلب محتوى جديد لحملة وسائل التواصل الاجتماعي',
    status: 'processing',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    priority: 'medium',
    retryCount: 0
  },
  {
    id: 'msg_003',
    senderAgentId: 'brand_monitoring_agent',
    recipientAgentId: 'client_experience_agent',
    taskType: 'alert',
    content: 'تنبيه: انخفاض في معدل المشاعر الإيجابية للعلامة التجارية',
    status: 'sent',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    priority: 'urgent',
    retryCount: 0
  },
  {
    id: 'msg_004',
    senderAgentId: 'paid_ads_agent',
    recipientAgentId: 'analytics_agent',
    taskType: 'performance_sync',
    content: 'مزامنة بيانات أداء الإعلانات المدفوعة',
    status: 'completed',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    priority: 'medium',
    retryCount: 1,
    response: {
      success: true,
      data: 'تم تحديث البيانات'
    }
  },
  {
    id: 'msg_005',
    senderAgentId: 'competitor_analysis_agent',
    recipientAgentId: 'seo_agent',
    taskType: 'insight_sharing',
    content: 'مشاركة رؤى حول استراتيجيات SEO للمنافسين',
    status: 'failed',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    priority: 'low',
    retryCount: 3
  }
];

export const mockSystemAlerts = [
  {
    id: 'alert_001',
    type: 'error',
    title: 'خطأ في وكيل إدارة المحتوى',
    message: 'فشل في الاتصال بـ API إنشاء المحتوى',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    severity: 'high',
    resolved: false
  },
  {
    id: 'alert_002',
    type: 'warning',
    title: 'بطء في استجابة وكيل التحليلات',
    message: 'متوسط وقت الاستجابة أعلى من المعدل الطبيعي',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: 'medium',
    resolved: false
  },
  {
    id: 'alert_003',
    type: 'success',
    title: 'تم حل مشكلة الاتصال',
    message: 'تم استعادة الاتصال مع وكيل البريد الإلكتروني',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    severity: 'low',
    resolved: true
  }
];
