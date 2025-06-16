
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentService, PaymentData } from "@/services/paymentService";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Lock, CheckCircle } from "lucide-react";

export default function Checkout() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const content = {
    ar: {
      title: "إتمام عملية الدفع",
      subtitle: "اختر خطة الاشتراك المناسبة لك",
      customerInfo: "معلومات العميل",
      planDetails: "تفاصيل الخطة",
      paymentMethod: "طريقة الدفع",
      monthly: "شهري",
      yearly: "سنوي",
      saveDiscount: "وفر 17%",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      company: "اسم الشركة",
      phone: "رقم الهاتف",
      payNow: "ادفع الآن",
      processing: "جاري المعالجة...",
      total: "المجموع",
      currency: "ريال سعودي",
      secure: "عملية دفع آمنة ومشفرة",
      mockNotice: "هذا نظام دفع تجريبي - لن يتم خصم أي مبلغ حقيقي"
    },
    en: {
      title: "Complete Payment",
      subtitle: "Choose the right subscription plan for you",
      customerInfo: "Customer Information",
      planDetails: "Plan Details",
      paymentMethod: "Payment Method",
      monthly: "Monthly",
      yearly: "Yearly",
      saveDiscount: "Save 17%",
      name: "Full Name",
      email: "Email Address",
      company: "Company Name",
      phone: "Phone Number",
      payNow: "Pay Now",
      processing: "Processing...",
      total: "Total",
      currency: "SAR",
      secure: "Secure and encrypted payment",
      mockNotice: "This is a demo payment system - no real charges will be made"
    }
  };

  const t = content[language];

  useEffect(() => {
    const planId = searchParams.get('plan');
    const cycle = searchParams.get('cycle') as 'monthly' | 'yearly' || 'monthly';
    
    setBillingCycle(cycle);
    
    // الحصول على تفاصيل الخطة
    const plans = PaymentService.getMockPlans();
    const plan = plans.find(p => p.id === planId);
    
    if (plan) {
      setSelectedPlan(plan);
    } else {
      // إذا لم توجد خطة، اختر الأولى
      setSelectedPlan(plans[0]);
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    return billingCycle === 'yearly' ? selectedPlan.price_yearly : selectedPlan.price_monthly;
  };

  const handlePayment = async () => {
    if (!selectedPlan || !customerData.name || !customerData.email) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const paymentData: PaymentData = {
        amount: calculateTotal(),
        currency: 'SAR',
        description: `اشتراك ${selectedPlan.plan_name} - ${billingCycle === 'yearly' ? 'سنوي' : 'شهري'}`,
        customer_name: customerData.name,
        customer_email: customerData.email,
        plan_id: selectedPlan.id,
        billing_cycle: billingCycle
      };

      const result = await PaymentService.processPayment(paymentData);

      if (result.status === 'paid') {
        toast({
          title: "تم الدفع بنجاح!",
          description: "تم تفعيل اشتراكك بنجاح",
          duration: 5000
        });
        
        navigate(`/payment/success?payment_id=${result.id}`);
      } else {
        toast({
          title: "فشل في عملية الدفع",
          description: "حدث خطأ أثناء معالجة عملية الدفع",
          variant: "destructive"
        });
        
        navigate(`/payment/failed?payment_id=${result.id}`);
      }
    } catch (error) {
      console.error('خطأ في الدفع:', error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-8`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              {t.title}
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.subtitle}
            </p>
          </div>

          {/* Mock Notice */}
          <div className={`mb-6 p-4 rounded-lg border-2 border-yellow-300 ${theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
            <p className={`text-center font-medium ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
              {t.mockNotice}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.customerInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.name} *</Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t.email} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company">{t.company}</Label>
                  <Input
                    id="company"
                    value={customerData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Plan Details & Payment */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.planDetails}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Info */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPlan.plan_name}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    {selectedPlan.description}
                  </p>

                  {/* Billing Cycle Selector */}
                  <div className="mb-4">
                    <Label>{t.paymentMethod}</Label>
                    <Select value={billingCycle} onValueChange={(value: 'monthly' | 'yearly') => setBillingCycle(value)}>
                      <SelectTrigger className={`${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">
                          {t.monthly} - {selectedPlan.price_monthly} {t.currency}
                        </SelectItem>
                        <SelectItem value="yearly">
                          {t.yearly} - {selectedPlan.price_yearly} {t.currency} ({t.saveDiscount})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Total */}
                <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${theme === 'dark' ? 'bg-gray-700 border-blue-600' : 'bg-blue-50 border-blue-200'}`}>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {t.total}:
                  </span>
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    {calculateTotal()} {t.currency}
                  </span>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isLoading || !customerData.name || !customerData.email}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t.processing}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      {t.payNow}
                    </div>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>{t.secure}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
