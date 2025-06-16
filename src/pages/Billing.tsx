
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Calendar, DollarSign, CheckCircle, Star, Zap, Shield } from "lucide-react";

export default function Billing() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الفواتير والاشتراك",
      subtitle: "إدارة خطة الاشتراك ومعلومات الدفع",
      currentPlan: "الخطة الحالية",
      planName: "الخطة المتقدمة",
      planPrice: "299 ريال/شهر",
      planDescription: "جميع المميزات المتقدمة مع دعم فني 24/7",
      changePlan: "تغيير الخطة",
      cancelSubscription: "إلغاء الاشتراك",
      upgradeplan: "ترقية الخطة",
      paymentMethod: "طريقة الدفع",
      addPaymentMethod: "إضافة طريقة دفع",
      updatePayment: "تحديث طريقة الدفع",
      billingHistory: "تاريخ الفواتير",
      download: "تنزيل",
      invoice: "فاتورة",
      paid: "مدفوع",
      usage: "الاستخدام",
      renewalDate: "تاريخ التجديد",
      features: "المميزات المشمولة",
      active: "نشط",
      planBenefits: "مزايا الخطة",
      unlimitedAccess: "وصول غير محدود لجميع الوكلاء",
      prioritySupport: "دعم فني أولوية عالية",
      advancedAnalytics: "تحليلات متقدمة ومفصلة",
      customIntegrations: "تكاملات مخصصة",
      dataExport: "تصدير البيانات",
      nextBilling: "الفاتورة القادمة",
      autoRenewal: "التجديد التلقائي",
      enabled: "مفعل",
      manageBilling: "إدارة الفواتير"
    },
    en: {
      title: "Billing & Subscription",
      subtitle: "Manage your subscription plan and payment information",
      currentPlan: "Current Plan",
      planName: "Pro Plan",
      planPrice: "299 SAR/month",
      planDescription: "All advanced features with 24/7 premium support",
      changePlan: "Change Plan",
      cancelSubscription: "Cancel Subscription",
      upgradeplan: "Upgrade Plan",
      paymentMethod: "Payment Method",
      addPaymentMethod: "Add Payment Method",
      updatePayment: "Update Payment Method",
      billingHistory: "Billing History",
      download: "Download",
      invoice: "Invoice",
      paid: "Paid",
      usage: "Usage",
      renewalDate: "Renewal Date",
      features: "Included Features",
      active: "Active",
      planBenefits: "Plan Benefits",
      unlimitedAccess: "Unlimited access to all agents",
      prioritySupport: "High priority technical support",
      advancedAnalytics: "Advanced detailed analytics", 
      customIntegrations: "Custom integrations",
      dataExport: "Data export capabilities",
      nextBilling: "Next Billing",
      autoRenewal: "Auto Renewal",
      enabled: "Enabled",
      manageBilling: "Manage Billing"
    }
  };

  const t = content[language];

  const billingHistory = [
    { date: "2024-06-01", amount: "299 ريال", status: "Paid", invoice: "INV-001" },
    { date: "2024-05-01", amount: "299 ريال", status: "Paid", invoice: "INV-002" },
    { date: "2024-04-01", amount: "299 ريال", status: "Paid", invoice: "INV-003" },
  ];

  const features = [
    { icon: '🤖', title: t.unlimitedAccess },
    { icon: '⚡', title: t.prioritySupport },
    { icon: '📊', title: t.advancedAnalytics },
    { icon: '🔗', title: t.customIntegrations },
    { icon: '📁', title: t.dataExport },
    { icon: '🔒', title: 'حماية متقدمة للبيانات' }
  ];

  const planBenefits = [
    { icon: Zap, title: 'وصول فوري', description: 'استجابة الوكلاء خلال ثوانٍ' },
    { icon: Shield, title: 'أمان متقدم', description: 'تشفير عالي المستوى' },
    { icon: Star, title: 'مميزات حصرية', description: 'أحدث الأدوات والتحديثات' }
  ];

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Plan - Spanning 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Plan Overview */}
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-2 border-blue-200 shadow-xl`}>
                <CardHeader>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
                        <Star className="w-8 h-8 text-yellow-500" />
                        {t.currentPlan}
                      </CardTitle>
                      <CardDescription className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                        {t.planDescription}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg font-bold">
                      {t.active}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-10 h-10 text-white" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {t.planName}
                        </h3>
                        <p className={`text-3xl font-bold text-blue-600`}>
                          {t.planPrice}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Calendar className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-medium">{t.renewalDate}:</span>
                          <div className="text-green-600 font-bold">15 يوليو 2024</div>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Zap className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="font-medium">{t.autoRenewal}:</span>
                          <div className="text-blue-600 font-bold">{t.enabled}</div>
                        </div>
                      </div>
                    </div>

                    <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        {t.upgradeplan}
                      </Button>
                      <Button variant="outline">
                        {t.changePlan}
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                        {t.cancelSubscription}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Benefits */}
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.planBenefits}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {planBenefits.map((benefit, index) => (
                      <div key={index} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                        <benefit.icon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                          {benefit.title}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {benefit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.paymentMethod}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          •••• •••• •••• 4242
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          ينتهي في 12/26 • Visa
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {t.updatePayment}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.billingHistory}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingHistory.map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {t.invoice} #{item.invoice}
                            </p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.date}
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Badge className="bg-green-100 text-green-800">
                            {t.paid}
                          </Badge>
                          <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {item.amount}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Features Sidebar */}
            <div>
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} sticky top-8`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.features}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-2xl">{feature.icon}</span>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      {t.manageBilling}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
