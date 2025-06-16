
import React from 'react';
import { useTokens } from '@/hooks/useTokens';
import { Coins, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const TokenBalance = () => {
  const { tokenData, getRemainingTokens, getTokenPercentage, isLowTokens, loading } = useTokens();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  if (loading || !tokenData) {
    return (
      <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 animate-pulse" />
            <span className="text-sm">جاري التحميل...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const remaining = getRemainingTokens();
  const percentage = getTokenPercentage();
  const isLow = isLowTokens();

  const getStatusColor = () => {
    if (percentage > 50) return theme === 'dark' ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-100';
    if (percentage > 20) return theme === 'dark' ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-100';
    return theme === 'dark' ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-100';
  };

  const getProgressColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
      <CardHeader className="pb-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Coins className="w-5 h-5 text-blue-600" />
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              رصيد الطلبات
            </span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {tokenData.plan.plan_name}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {remaining.toLocaleString()}
          </span>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            / {tokenData.client.quota_limit.toLocaleString()}
          </span>
        </div>

        <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        </div>

        {isLow && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
          } ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>
                تحذير: رصيد منخفض
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`}>
                يقترب رصيدك من النهاية. فكر في ترقية باقتك.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => window.location.href = '/pricing'}
              className="bg-red-600 hover:bg-red-700 text-white text-xs"
            >
              ترقية
            </Button>
          </div>
        )}

        {tokenData.plan.plan_name === 'Free' && !isLow && (
          <Button
            onClick={() => window.location.href = '/pricing'}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Zap className="w-4 h-4 ml-2" />
            ترقية للحصول على المزيد من الطلبات
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
