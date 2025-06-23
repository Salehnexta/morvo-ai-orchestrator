
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthError {
  code: string;
  message: string;
  userMessage: string;
  canRetry: boolean;
}

export const useEnhancedAuth = () => {
  const { signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const getAuthError = (error: any): AuthError => {
    const errorMessage = error?.message || 'Unknown error';
    
    // Enhanced error categorization
    if (errorMessage.includes('Invalid login credentials')) {
      return {
        code: 'INVALID_CREDENTIALS',
        message: errorMessage,
        userMessage: 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.',
        canRetry: true
      };
    }

    if (errorMessage.includes('Email not confirmed')) {
      return {
        code: 'EMAIL_NOT_CONFIRMED',
        message: errorMessage,
        userMessage: 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.',
        canRetry: false
      };
    }

    if (errorMessage.includes('Too many requests')) {
      return {
        code: 'RATE_LIMITED',
        message: errorMessage,
        userMessage: 'محاولات كثيرة جداً. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.',
        canRetry: true
      };
    }

    if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: errorMessage,
        userMessage: 'مشكلة في الاتصال. يرجى التحقق من اتصال الإنترنت.',
        canRetry: true
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: errorMessage,
      userMessage: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      canRetry: true
    };
  };

  const handleSignIn = useCallback(async (
    email: string, 
    password: string,
    options?: { autoRetry?: boolean }
  ) => {
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        const authError = getAuthError(error);
        
        console.error('🔐 Enhanced auth error:', authError);
        
        // Show user-friendly error message
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: authError.userMessage,
          variant: 'destructive',
          action: authError.canRetry && retryCount < 3 ? (
            <button 
              onClick={() => {
                setRetryCount(prev => prev + 1);
                setTimeout(() => handleSignIn(email, password), 1000);
              }}
              className="px-3 py-1 bg-white text-red-600 rounded text-sm hover:bg-gray-50"
            >
              إعادة المحاولة
            </button>
          ) : undefined
        });

        return { success: false, error: authError };
      }

      // Success
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بعودتك إلى مورفو',
        variant: 'default'
      });

      setRetryCount(0);
      navigate('/dashboard');
      return { success: true };

    } catch (error) {
      const authError = getAuthError(error);
      
      toast({
        title: 'خطأ غير متوقع',
        description: authError.userMessage,
        variant: 'destructive'
      });

      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [signIn, toast, navigate, retryCount]);

  const handleSignUp = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { error } = await signUp(email, password);

      if (error) {
        const authError = getAuthError(error);
        
        toast({
          title: 'خطأ في إنشاء الحساب',
          description: authError.userMessage,
          variant: 'destructive'
        });

        return { success: false, error: authError };
      }

      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب',
        variant: 'default'
      });

      return { success: true };

    } catch (error) {
      const authError = getAuthError(error);
      
      toast({
        title: 'خطأ غير متوقع',
        description: authError.userMessage,
        variant: 'destructive'
      });

      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [signUp, toast]);

  const handleSignOut = useCallback(async () => {
    setIsLoading(true);

    try {
      const { error } = await signOut();

      if (error) {
        const authError = getAuthError(error);
        
        toast({
          title: 'خطأ في تسجيل الخروج',
          description: authError.userMessage,
          variant: 'destructive'
        });

        return { success: false, error: authError };
      }

      toast({
        title: 'تم تسجيل الخروج بنجاح',
        description: 'إلى اللقاء!',
        variant: 'default'
      });

      navigate('/');
      return { success: true };

    } catch (error) {
      const authError = getAuthError(error);
      
      toast({
        title: 'خطأ غير متوقع',
        description: authError.userMessage,
        variant: 'destructive'
      });

      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [signOut, toast, navigate]);

  return {
    handleSignIn,
    handleSignUp,
    handleSignOut,
    isLoading,
    retryCount
  };
};
