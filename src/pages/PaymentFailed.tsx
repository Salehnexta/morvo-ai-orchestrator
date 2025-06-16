
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentFailed() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [paymentId] = useState(searchParams.get('payment_id'));

  const content = {
    ar: {
      title: "فشل في عملية الدفع",
      subtitle: "نأسف، لم نتمكن من إتمام عملية الدفع",
      paymentId: "رقم المعاملة",
      reasons: "الأسباب المحتملة",
      insufficientFunds: "رصيد غير كافي في البطاقة",
      invalidCard: "بيانات البطاقة غير صحيحة",
      networkError: "خطأ في الشبكة أو الاتصال",
      bankDecline: "رفض من البنك المصدر للبطاقة",
      nextSteps: "ماذا يمكنك فعله؟",
      retryPayment: "المحاولة مرة أخرى",
      contactSupport: "التواصل مع الدعم الفني",
      chooseDifferentPlan: "اختيار خطة مختلفة",
      tryAgain: "المحاولة مرة أخرى",
      backToPricing: "العودة إلى الخطط",
      contactUs: "تواصل معنا"
    },
    en: {
      title: "Payment Failed",
      subtitle: "Sorry, we couldn't process your payment",
      paymentId: "Transaction ID",
      reasons: "Possible Reasons",
      insufficientFunds: "Insufficient funds on card",
      invalidCard: "Invalid card information",
      networkError: "Network or connection error",
      bankDecline: "Declined by issuing bank",
      nextSteps: "What can you do?",
      retryPayment: "Try payment again",
      contactSupport: "Contact technical support",
      chooseDifferentPlan: "Choose a different plan",
      tryAgain: "Try Again",
      backToPricing: "Back to Pricing",
      contactUs: "Contact Us"
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
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
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
                  <p className={`font-mono text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                    {paymentId}
                  </p>
                </div>
              )}

              {/* Possible Reasons */}
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {t.reasons}
                </h3>
                
                <ul className="space-y-2">
                  <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <XCircle className="w-4 h-4 text-red-500 mx-3" />
                    {t.insufficientFunds}
                  </li>
                  <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <XCircle className="w-4 h-4 text-red-500 mx-3" />
                    {t.invalidCard}
                  </li>
                  <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <XCircle className="w-4 h-4 text-red-500 mx-3" />
                    {t.networkError}
                  </li>
                  <li className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <XCircle className="w-4 h-4 text-red-500 mx-3" />
                    {t.bankDecline}
                  </li>
                </ul>
              </div>

              {/* Next Steps */}
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {t.nextSteps}
                </h3>
                
                <ul className="space-y-2">
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    • {t.retryPayment}
                  </li>
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    • {t.contactSupport}
                  </li>
                  <li className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    • {t.chooseDifferentPlan}
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Link to="/pricing">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t.tryAgain}
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <Link to="/pricing">
                    {isRTL ? null : <ArrowLeft className="w-4 h-4 mr-2" />}
                    {t.backToPricing}
                    {isRTL ? <ArrowLeft className="w-4 h-4 ml-2 rotate-180" /> : null}
                  </Link>
                </Button>
              </div>

              {/* Support Contact */}
              <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                  هل تحتاج مساعدة؟
                </p>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/support">
                    {t.contactUs}
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
