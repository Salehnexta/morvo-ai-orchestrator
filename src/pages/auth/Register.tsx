import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, ArrowRight } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const { signUp, user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const content = {
    ar: {
      title: "إنشاء حساب جديد",
      subtitle: "ابدأ رحلتك مع مورفو الذكي",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      register: "إنشاء الحساب",
      registering: "جاري إنشاء الحساب...",
      haveAccount: "لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
      continueWith: "أو المتابعة مع",
      google: "جوجل",
      github: "جيت هاب",
      backToHome: "العودة للرئيسية",
      errors: {
        fillAll: "يرجى ملء جميع الحقول",
        passwordMismatch: "كلمات المرور غير متطابقة",
        passwordLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        invalidEmail: "البريد الإلكتروني غير صحيح",
        registrationFailed: "فشل في إنشاء الحساب",
        emailExists: "البريد الإلكتروني مستخدم بالفعل"
      },
      success: {
        accountCreated: "تم إنشاء الحساب بنجاح!",
        redirecting: "جاري التوجيه إلى لوحة التحكم..."
      }
    },
    en: {
      title: "Create New Account",
      subtitle: "Start your journey with Morvo AI",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      register: "Create Account",
      registering: "Creating account...",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      continueWith: "Or continue with",
      google: "Google",
      github: "GitHub",
      backToHome: "Back to Home",
      errors: {
        fillAll: "Please fill in all fields",
        passwordMismatch: "Passwords do not match",
        passwordLength: "Password must be at least 6 characters",
        invalidEmail: "Invalid email address",
        registrationFailed: "Registration failed",
        emailExists: "Email already exists"
      },
      success: {
        accountCreated: "Account created successfully!",
        redirecting: "Redirecting to dashboard..."
      }
    }
  };

  const t = content[language];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!fullName.trim()) newErrors.fullName = t.errors.fillAll;
    if (!email.trim()) newErrors.email = t.errors.fillAll;
    if (!password) newErrors.password = t.errors.fillAll;
    if (!confirmPassword) newErrors.confirmPassword = t.errors.fillAll;

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t.errors.invalidEmail;
    }

    if (password && password.length < 6) {
      newErrors.password = t.errors.passwordLength;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = t.errors.passwordMismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await signUp(email.trim(), password);

      if (error) {
        console.error('Registration error:', error);
        if (error.message.includes('already registered')) {
          setErrors({ email: t.errors.emailExists });
        } else {
          toast({
            title: t.errors.registrationFailed,
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: t.success.accountCreated,
        description: t.success.redirecting,
      });

      // The AuthContext will handle the session state change
      // and SimpleAuthWrapper will create the client record
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: t.errors.registrationFailed,
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    // Social login functionality temporarily disabled
    // Will be implemented in future update
    toast({
      title: "Coming Soon",
      description: "Social login will be available in a future update",
      variant: "default",
    });
  };

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className={`${isRTL ? 'self-end' : 'self-start'} flex items-center gap-2`}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t.backToHome}
        </Button>

        <Card className={`${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.title}
            </CardTitle>
            <CardDescription className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className={`${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {t.fullName}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`pl-10 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder={t.fullName}
                    disabled={isLoading}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className={`${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {t.email}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } ${errors.email ? 'border-red-500' : ''}`}
                    placeholder={t.email}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className={`${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {t.password}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } ${errors.password ? 'border-red-500' : ''}`}
                    placeholder={t.password}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={`${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {t.confirmPassword}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder={t.confirmPassword}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? t.registering : t.register}
              </Button>
            </form>

            <div className="space-y-4">
              <Separator />
              
              <p className={`text-center text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.continueWith}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  className={`${
                    theme === 'dark' 
                      ? 'border-gray-600 text-gray-200 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t.google}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('github')}
                  className={`${
                    theme === 'dark' 
                      ? 'border-gray-600 text-gray-200 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t.github}
                </Button>
              </div>

              <p className={`text-center text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.haveAccount}{' '}
                <Link 
                  to="/auth/login" 
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {t.signIn}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
