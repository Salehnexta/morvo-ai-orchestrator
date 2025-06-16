
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw, MessageCircle, CreditCard, Shield } from "lucide-react";

export default function PaymentFailed() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [paymentId] = useState(searchParams.get('payment_id'));

  const content = {
    ar: {
      title: "عذراً، لم تتم عملية الدفع",
      subtitle: "لا تقلق - يمكننا حل هذا الأمر معاً",
      paymentId: "رقم المعاملة",
      reasons: "الأسباب المحتملة",
      insufficientFunds: "رصيد غير كافي في البطاقة",
      invalidCard: "بيانات البطاقة غير صحيحة أو منتهية الصلاحية",
      networkError: "مشكلة مؤقتة في الشبكة أو الاتصال",
      bankDecline: "رفض من البنك المصدر للبطاقة",
      securityBlock: "حجب أمني مؤقت من البنك",
      nextSteps: "الحلول المتاحة",
      retryPayment: "جرب طريقة دفع أخرى أو بطاقة مختلفة",
      contactSupport: "تواصل مع فريق الدعم الفني للمساعدة",
      chooseDifferentPlan: "اختر خطة مختلفة تناسب ميزانيتك",
      tryAgain: "حاول مرة أخرى",
      backToPricing: "العودة إلى الخطط",
      contactUs: "تواصل معنا",
      helpMessage: "فريقنا جاهز لمساعدتك في إتمام الاشتراك",
      commonIssues: "مشاكل شائعة وحلولها",
      checkCard: "تأكد من صحة بيانات البطاقة والرصيد المتاح",
      tryDifferentCard: "جرب بطاقة ائتمان أو خصم مختلفة",
      contactBank: "تواصل مع البنك لرفع أي حجب أمني"
    },
    en: {
      title: "Payment was not completed",
      subtitle: "Don't worry - we can resolve this together",
      paymentId: "Transaction ID",
      reasons: "Possible Reasons",
      insufficientFunds: "Insufficient funds on card",
      invalidCard: "Invalid or expired card information",
      networkError: "Temporary network or connection issue",
      bankDecline: "Declined by issuing bank",
      securityBlock: "Temporary security block from bank",
      nextSteps: "Available Solutions",
      retryPayment: "Try a different payment method or card",
      contactSupport: "Contact our technical support team for help",
      chooseDifferentPlan: "Choose a different plan that fits your budget",
      tryAgain: "Try Again",
      backToPricing: "Back to Pricing",
      contactUs: "Contact Us",
      helpMessage: "Our team is ready to help you complete your subscription",
      commonIssues: "Common Issues & Solutions",
      checkCard: "Verify card details and available balance",
      tryDifferentCard: "Try a different credit or debit card",
      contactBank: "Contact your bank to remove any security blocks"
    }
  };

  const t = content[language];

  const commonIssues = [
    {
      icon: CreditCard,
      title: language === 'ar' ? 'مشكلة في البطاقة' : 'Card Issue',
      description: t.checkCard,
      color: 'red'
    },
    {
      icon: RefreshCw,
      title: language === 'ar' ? 'جرب بطاقة أخرى' : 'Try Different Card',
      description: t.tryDifferentCard,
      color: 'blue'
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'حجب أمني' : 'Security Block',
      description: t.contactBank,
      color: 'yellow'
    }
  ];

  const solutions = [
    {
      icon: RefreshCw,
      title: language === 'ar' ? 'المحاولة مرة أخرى' : 'Try Again',
      description: t.retryPayment,
      action: 'retry'
    },
    {
      icon: MessageCircle,
      title: language === 'ar' ? 'تواصل مع الدعم' : 'Contact Support',
      description: t.contactSupport,
      action: 'support'
    }
  ];

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-16`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4">
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} text-center shadow-xl border-0`}>
            <CardHeader className="pb-6">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-16 h-16 text-red-600" />
                </div>
              </div>
              
              <CardTitle className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                {t.title}
              </CardTitle>
              
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                {t.subtitle}
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Payment ID */}
              {paymentId && (
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t.paymentId}
                  </p>
                  <p className={`font-mono text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} font-bold`}>
                    {paymentId}
                  </p>
                </div>
              )}

              {/* Help Message */}
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
                  {t.helpMessage}
                </p>
              </div>

              {/* Common Issues */}
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>
                  {t.commonIssues}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {commonIssues.map((issue, index) => (
                    <div key={index} className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <issue.icon className={`w-12 h-12 mx-auto mb-4 ${
                        issue.color === 'red' ? 'text-red-500' :
                        issue.color === 'blue' ? 'text-blue-500' : 'text-yellow-500'
                      }`} />
                      <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
                        {issue.title}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                        {issue.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Possible Reasons */}
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {t.reasons}
                </h3>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-red-50'} border border-red-200`}>
                  {[
                    t.insufficientFunds,
                    t.invalidCard,
                    t.networkError,
                    t.bankDecline,
                    t.securityBlock
                  ].map((reason, index) => (
                    <div key={index} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <XCircle className="w-4 h-4 text-red-500 mx-3 flex-shrink-0" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solutions */}
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {t.nextSteps}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {solutions.map((solution, index) => (
                    <div key={index} className={`p-6 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'} hover:shadow-lg transition-all`}>
                      <solution.icon className="w-10 h-10 text-green-600 mx-auto mb-4" />
                      <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
                        {solution.title}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                        {solution.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                  size="lg"
                >
                  <Link to="/pricing">
                    <RefreshCw className="w-5 h-5 mr-3" />
                    {t.tryAgain}
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 py-4 text-lg"
                  size="lg"
                >
                  <Link to="/support">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    {t.contactUs}
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="ghost"
                  className="flex-1 py-4 text-lg"
                  size="lg"
                >
                  <Link to="/pricing">
                    {isRTL ? null : <ArrowLeft className="w-4 h-4 mr-2" />}
                    {t.backToPricing}
                    {isRTL ? <ArrowLeft className="w-4 h-4 ml-2 rotate-180" /> : null}
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
