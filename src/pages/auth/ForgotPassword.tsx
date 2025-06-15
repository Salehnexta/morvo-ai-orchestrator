
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const content = {
    ar: {
      title: "نسيت كلمة المرور؟",
      subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور",
      email: "البريد الإلكتروني",
      send: "إرسال رابط الاستعادة",
      backToLogin: "العودة لتسجيل الدخول",
      checkEmail: "تحقق من بريدك الإلكتروني",
      emailSent: "تم إرسال رابط إعادة تعيين كلمة المرور إلى",
      noEmail: "لم تستلم الرسالة؟",
      resend: "إعادة الإرسال"
    },
    en: {
      title: "Forgot Password?",
      subtitle: "Enter your email address and we'll send you a link to reset your password",
      email: "Email",
      send: "Send Reset Link",
      backToLogin: "Back to Login",
      checkEmail: "Check Your Email",
      emailSent: "We've sent a password reset link to",
      noEmail: "Didn't receive the email?",
      resend: "Resend"
    }
  };

  const t = content[language];
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset request for:", email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-md">
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`mx-auto mb-4 w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center ${
                isRTL ? 'mr-auto' : 'ml-auto'
              }`}>
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.checkEmail}
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center`}>
                {t.emailSent}
                <br />
                <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.noEmail}{" "}
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t.resend}
                </button>
              </div>
              
              <Link to="/auth/login">
                <Button variant="outline" className="w-full">
                  {t.backToLogin}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <Link 
          to="/auth/login" 
          className={`inline-flex items-center gap-2 mb-8 text-sm text-gray-600 hover:text-gray-900 transition-colors ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <BackIcon className="w-4 h-4" />
          {t.backToLogin}
        </Link>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ${
              isRTL ? 'mr-auto' : 'ml-auto'
            }`}>
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {t.subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {t.send}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
