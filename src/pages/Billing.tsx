
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Calendar, DollarSign, CheckCircle } from "lucide-react";

export default function Billing() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الفواتير والاشتراك",
      subtitle: "إدارة خطة الاشتراك ومعلومات الدفع",
      currentPlan: "الخطة الحالية",
      planName: "الخطة المتقدمة",
      planPrice: "$29.99/شهر",
      planDescription: "جميع المميزات المتقدمة مع دعم فني 24/7",
      changePlan: "تغيير الخطة",
      cancelSubscription: "إلغاء الاشتراك",
      paymentMethod: "طريقة الدفع",
      addPaymentMethod: "إضافة طريقة دفع",
      updatePayment: "تحديث طريقة الدفع",
      billingHistory: "تاريخ الفواتير",
      download: "تنزيل",
      invoice: "فاتورة",
      paid: "مدفوع",
      usage: "الاستخدام",
      renewalDate: "تاريخ التجديد",
      features: "المميزات المشمولة"
    },
    en: {
      title: "Billing & Subscription",
      subtitle: "Manage your subscription plan and payment information",
      currentPlan: "Current Plan",
      planName: "Pro Plan",
      planPrice: "$29.99/month",
      planDescription: "All advanced features with 24/7 premium support",
      changePlan: "Change Plan",
      cancelSubscription: "Cancel Subscription",
      paymentMethod: "Payment Method",
      addPaymentMethod: "Add Payment Method",
      updatePayment: "Update Payment Method",
      billingHistory: "Billing History",
      download: "Download",
      invoice: "Invoice",
      paid: "Paid",
      usage: "Usage",
      renewalDate: "Renewal Date",
      features: "Included Features"
    }
  };

  const t = content[language];

  const billingHistory = [
    { date: "2024-06-01", amount: "$29.99", status: "Paid", invoice: "INV-001" },
    { date: "2024-05-01", amount: "$29.99", status: "Paid", invoice: "INV-002" },
    { date: "2024-04-01", amount: "$29.99", status: "Paid", invoice: "INV-003" },
  ];

  const features = [
    "Unlimited AI conversations",
    "Advanced analytics",
    "Priority support",
    "Custom integrations",
    "Team collaboration",
    "API access"
  ];

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Plan */}
            <div className="lg:col-span-2 space-y-6">
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {t.currentPlan}
                      </CardTitle>
                      <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {t.planDescription}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <DollarSign className="w-8 h-8 text-blue-600" />
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {t.planName}
                        </h3>
                        <p className={`text-2xl font-bold text-blue-600`}>
                          {t.planPrice}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Calendar className="w-4 h-4" />
                      {t.renewalDate}: July 15, 2024
                    </div>

                    <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                      <CreditCard className="w-8 h-8 text-blue-600" />
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          •••• •••• •••• 4242
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Expires 12/26
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
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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

            {/* Plan Features */}
            <div>
              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.features}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
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
