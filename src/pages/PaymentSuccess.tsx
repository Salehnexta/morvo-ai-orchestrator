
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Star, Gift, Zap } from "lucide-react";

export default function PaymentSuccess() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [paymentId] = useState(searchParams.get('payment_id'));

  const content = {
    ar: {
      title: "🎉 تهانينا! تم تفعيل اشتراكك بنجاح",
      subtitle: "مرحباً بك في عائلة مورفو - رحلتك نحو النجاح تبدأ الآن",
      paymentId: "رقم المعاملة",
      subscriptionActive: "تم تفعيل اشتراكك وإرسال تأكيد إلى بريدك الإلكتروني",
      nextSteps: "ماذا بعد؟",
      accessDashboard: "ابدأ المحادثة مع وكلاء الذكاء الاصطناعي",
      startChat: "استكشف جميع الأدوات والمميزات المتاحة",
      supportContact: "احصل على دعم فني مخصص على مدار الساعة",
      goToDashboard: "ابدأ الاستخدام الآن",
      backToHome: "العودة إلى الصفحة الرئيسية",
      bonusFeatures: "مميزات إضافية",
      prioritySupport: "دعم فني أولوية عالية",
      exclusiveUpdates: "تحديثات وميزات حصرية",
      advancedAnalytics: "تحليلات متقدمة ومفصلة",
      welcomeGift: "🎁 هدية ترحيبية خاصة",
      giftDescription: "استشارة مجانية لمدة 30 دقيقة مع خبير التسويق الرقمي"
    },
    en: {
      title: "🎉 Congratulations! Your subscription is now active",
      subtitle: "Welcome to the Morvo family - your journey to success starts now",
      paymentId: "Transaction ID",
      subscriptionActive: "Your subscription has been activated and confirmation sent to your email",
      nextSteps: "What's Next?",
      accessDashboard: "Start chatting with AI agents",
      startChat: "Explore all available tools and features",
      supportContact: "Get dedicated 24/7 premium support",
      goToDashboard: "Start Using Now",
      backToHome: "Back to Home",
      bonusFeatures: "Bonus Features",
      prioritySupport: "High priority technical support",
      exclusiveUpdates: "Exclusive updates and features",
      advancedAnalytics: "Advanced detailed analytics",
      welcomeGift: "🎁 Special Welcome Gift",
      giftDescription: "Free 30-minute consultation with digital marketing expert"
    }
  };

  const t = content[language];

  useEffect(() => {
    // تشغيل الاحتفال
    const confetti = () => {
      // يمكن إضافة مكتبة confetti هنا للاحتفال
      console.log("🎉 Celebration effect!");
    };
    
    const timer = setTimeout(confetti, 500);
    return () => clearTimeout(timer);
  }, []);

  const nextSteps = [
    {
      icon: Zap,
      title: language === 'ar' ? 'ابدأ المحادثة' : 'Start Chatting',
      description: t.accessDashboard,
      color: 'blue'
    },
    {
      icon: Star,
      title: language === 'ar' ? 'استكشف المميزات' : 'Explore Features', 
      description: t.startChat,
      color: 'purple'
    },
    {
      icon: Gift,
      title: language === 'ar' ? 'احصل على الدعم' : 'Get Support',
      description: t.supportContact,
      color: 'green'
    }
  ];

  const bonusFeatures = [
    { icon: '⚡', title: t.prioritySupport },
    { icon: '🔥', title: t.exclusiveUpdates },
    { icon: '📊', title: t.advancedAnalytics }
  ];

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} py-16`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Main Success Card */}
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} text-center shadow-2xl border-0 overflow-hidden relative`}>
            {/* Celebration Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
            
            <CardHeader className="pb-6 relative">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                    ⭐
                  </div>
                </div>
              </div>
              
              <CardTitle className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 leading-tight`}>
                {t.title}
              </CardTitle>
              
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                {t.subtitle}
              </p>
            </CardHeader>

            <CardContent className="space-y-8 relative">
              {/* Payment ID */}
              {paymentId && (
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {t.paymentId}
                  </p>
                  <p className={`font-mono text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-bold`}>
                    {paymentId}
                  </p>
                </div>
              )}

              {/* Success Message */}
              <div className={`p-8 rounded-xl ${theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16"></div>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                  {t.subscriptionActive}
                </p>
              </div>

              {/* Welcome Gift */}
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'} mb-3`}>
                  {t.welcomeGift}
                </h3>
                <p className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  {t.giftDescription}
                </p>
              </div>

              {/* Next Steps */}
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>
                  {t.nextSteps}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {nextSteps.map((step, index) => (
                    <div key={index} className={`p-6 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                      <step.icon className={`w-12 h-12 mx-auto mb-4 ${
                        step.color === 'blue' ? 'text-blue-500' :
                        step.color === 'purple' ? 'text-purple-500' : 'text-green-500'
                      }`} />
                      <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
                        {step.title}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonus Features */}
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-purple-50'} border-2 border-purple-200`}>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 text-center`}>
                  {t.bonusFeatures}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bonusFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature.title}
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
                  <Link to="/dashboard">
                    <Zap className="w-5 h-5 mr-3" />
                    {t.goToDashboard}
                    {isRTL ? null : <ArrowRight className="w-5 h-5 ml-3" />}
                    {isRTL ? <ArrowRight className="w-5 h-5 mr-3 rotate-180" /> : null}
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 py-4 text-lg"
                  size="lg"
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
