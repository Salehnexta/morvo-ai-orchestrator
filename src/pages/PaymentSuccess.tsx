
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [paymentId] = useState(searchParams.get('payment_id'));

  const content = {
    ar: {
      title: "تم الدفع بنجاح!",
      subtitle: "شكراً لك على اشتراكك في منصة مورفو",
      paymentId: "رقم المعاملة",
      subscriptionActive: "تم تفعيل اشتراكك بنجاح",
      nextSteps: "الخطوات التالية",
      accessDashboard: "الوصول إلى لوحة التحكم",
      startChat: "بدء المحادثة مع الوكلاء",
      supportContact: "التواصل مع الدعم الفني",
      goToDashboard: "الذهاب إلى لوحة التحكم",
      backToHome: "العودة إلى الصفحة الرئيسية"
    },
    en: {
      title: "Payment Successful!",
      subtitle: "Thank you for subscribing to Morvo Platform",
      paymentId: "Transaction ID",
      subscriptionActive: "Your subscription has been activated successfully",
      nextSteps: "Next Steps",
      accessDashboard: "Access your dashboard",
      startChat: "Start chatting with agents",
      supportContact: "Contact technical support",
      goToDashboard: "Go to Dashboard",
      backToHome: "Back to Home"
    }
  };

  const t = content[language];

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-16`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto px-4">
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} text-center`}>
            <CardHeader className="pb-6">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              
              <CardTitle className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                {t.title}
              </CardTitle>
              
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.subtitle}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Payment ID */}
              {paymentId && (
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t.paymentId}
                  </p>
                  <p className={`font-mono text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {paymentId}
                  </p>
                </div>
              )}

              {/* Success Message */}
              <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                  {t.subscriptionActive}
                </p>
              </div>

              {/* Next Steps */}
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {t.nextSteps}
                </h3>
                
                <ul className="space-y-3">
                  <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <CheckCircle className="w-5 h-5 text-green-600 mx-3" />
                    {t.accessDashboard}
                  </li>
                  <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <CheckCircle className="w-5 h-5 text-green-600 mx-3" />
                    {t.startChat}
                  </li>
                  <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <CheckCircle className="w-5 h-5 text-green-600 mx-3" />
                    {t.supportContact}
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Link to="/dashboard">
                    {t.goToDashboard}
                    {isRTL ? null : <ArrowRight className="w-4 h-4 ml-2" />}
                    {isRTL ? <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> : null}
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <Link to="/">
                    {t.backToHome}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
