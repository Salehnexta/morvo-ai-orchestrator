
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const ResetPassword = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const content = {
    ar: {
      title: "إعادة تعيين كلمة المرور",
      subtitle: "أدخل كلمة المرور الجديدة الخاصة بك",
      password: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      reset: "إعادة تعيين كلمة المرور",
      success: "تم تغيير كلمة المرور بنجاح!",
      successMessage: "تم تحديث كلمة المرور الخاصة بك. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
      goToLogin: "الذهاب لتسجيل الدخول"
    },
    en: {
      title: "Reset Password",
      subtitle: "Enter your new password",
      password: "New Password",
      confirmPassword: "Confirm Password",
      reset: "Reset Password",
      success: "Password Changed Successfully!",
      successMessage: "Your password has been updated. You can now sign in with your new password.",
      goToLogin: "Go to Login"
    }
  };

  const t = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    console.log("Password reset:", formData.password);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.success}
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center`}>
                {t.successMessage}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Link to="/auth/login">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  {t.goToLogin}
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
                <Label htmlFor="password" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right pr-10' : 'text-left pl-10'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.confirmPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right pr-10' : 'text-left pl-10'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {t.reset}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
