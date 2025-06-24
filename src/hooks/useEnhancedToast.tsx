
import { useToast as useOriginalToast } from '@/hooks/use-toast';
import { useCallback } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, RefreshCw } from 'lucide-react';

interface EnhancedToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  canRetry?: boolean;
  onRetry?: () => void;
  persistent?: boolean;
}

export const useEnhancedToast = () => {
  const { toast: originalToast } = useOriginalToast();

  const toast = useCallback((options: EnhancedToastOptions) => {
    const { 
      title, 
      description, 
      type = 'info', 
      duration = 5000,
      canRetry = false,
      onRetry,
      persistent = false
    } = options;

    const getIcon = () => {
      switch (type) {
        case 'success':
          return '✅';
        case 'error':
          return '❌';
        case 'warning':
          return '⚠️';
        default:
          return 'ℹ️';
      }
    };

    const getVariant = () => {
      switch (type) {
        case 'error':
          return 'destructive' as const;
        default:
          return 'default' as const;
      }
    };

    originalToast({
      title: `${getIcon()} ${title}`,
      description,
      variant: getVariant(),
      duration: persistent ? Infinity : duration,
      action: canRetry && onRetry ? (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded text-sm hover:bg-gray-50 border"
        >
          <RefreshCw className="w-3 h-3" />
          إعادة المحاولة
        </button>
      ) : undefined
    });
  }, [originalToast]);

  const showSuccess = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'success' });
  }, [toast]);

  const showError = useCallback((title: string, description?: string, canRetry?: boolean, onRetry?: () => void) => {
    toast({ 
      title, 
      description, 
      type: 'error', 
      canRetry, 
      onRetry,
      duration: 8000 
    });
  }, [toast]);

  const showWarning = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'warning', duration: 6000 });
  }, [toast]);

  const showInfo = useCallback((title: string, description?: string) => {
    toast({ title, description, type: 'info' });
  }, [toast]);

  return {
    toast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
