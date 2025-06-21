
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useEnhancedOnboarding } from '@/hooks/useEnhancedOnboarding';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export const BusinessIntelligence = () => {
  const { analyzeWebsite } = useEnhancedOnboarding();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!websiteUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeWebsite(websiteUrl);
      if (result) {
        setAnalysis(result);
      } else {
        setError('فشل في تحليل الموقع');
      }
    } catch (error) {
      setError('حدث خطأ أثناء التحليل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            تحليل الموقع الإلكتروني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website">رابط الموقع الإلكتروني</Label>
            <div className="flex gap-2">
              <Input
                id="website"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1"
                dir="ltr"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={loading || !websiteUrl.trim()}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'تحليل'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Business Overview */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                نظرة عامة على النشاط التجاري
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">نوع النشاط</Label>
                <p className="text-lg">{analysis.analysis.business_overview.business_type}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">المنتجات الرئيسية</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.analysis.business_overview.main_products.map((product: string, index: number) => (
                    <Badge key={index} variant="secondary">{product}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">الجمهور المستهدف</Label>
                <p>{analysis.analysis.business_overview.target_audience}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">القيمة المميزة</Label>
                <p>{analysis.analysis.business_overview.unique_value}</p>
              </div>
            </CardContent>
          </Card>

          {/* Digital Presence */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                الحضور الرقمي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.analysis.digital_presence.website_health.seo_score}
                  </div>
                  <div className="text-sm text-gray-600">نقاط السيو</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analysis.analysis.digital_presence.website_health.speed_score}s
                  </div>
                  <div className="text-sm text-gray-600">سرعة التحميل</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {analysis.analysis.digital_presence.website_health.mobile_friendly ? (
                      <CheckCircle className="w-6 h-6 mx-auto" />
                    ) : (
                      <AlertCircle className="w-6 h-6 mx-auto" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">متوافق مع الجوال</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {analysis.analysis.digital_presence.website_health.ssl_secure ? (
                      <CheckCircle className="w-6 h-6 mx-auto" />
                    ) : (
                      <AlertCircle className="w-6 h-6 mx-auto" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">الحماية</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                الفرص والتوصيات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-green-600">انتصارات سريعة</Label>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {analysis.analysis.opportunities.quick_wins.map((item: string, index: number) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-blue-600">استراتيجية طويلة المدى</Label>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {analysis.analysis.opportunities.strategic.map((item: string, index: number) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* ROI Predictions */}
          {analysis.analysis.roi_prediction && (
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  توقعات العائد على الاستثمار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(analysis.analysis.roi_prediction).map(([period, data]: [string, any]) => (
                    <div key={period} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <h4 className="font-semibold mb-3">
                        {period === '3_month' ? '3 أشهر' : '6 أشهر'}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>زيادة الزيارات:</span>
                          <span className="font-medium text-green-600">{data.traffic_increase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>زيادة المبيعات:</span>
                          <span className="font-medium text-blue-600">{data.sales_increase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>تأثير الإيرادات:</span>
                          <span className="font-medium text-purple-600">{data.revenue_impact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
