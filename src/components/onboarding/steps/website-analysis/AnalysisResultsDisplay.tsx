
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Globe, TrendingUp } from 'lucide-react';

interface AnalysisResultsDisplayProps {
  results: any;
  websiteUrl: string;
  language: 'ar' | 'en';
}

export const AnalysisResultsDisplay: React.FC<AnalysisResultsDisplayProps> = ({
  results,
  websiteUrl,
  language
}) => {
  const content = {
    ar: {
      businessOverview: 'نظرة عامة على النشاط',
      digitalPresence: 'الحضور الرقمي',
      opportunities: 'الفرص والتوصيات',
      businessType: 'نوع النشاط',
      products: 'المنتجات والخدمات',
      targetAudience: 'الجمهور المستهدف',
      uniqueValue: 'القيمة المميزة',
      seoScore: 'نقاط السيو',
      speedScore: 'سرعة التحميل',
      mobileFriendly: 'متوافق مع الجوال',
      sslSecure: 'الحماية',
      quickWins: 'انتصارات سريعة',
      strategic: 'استراتيجية طويلة المدى',
      seconds: 'ثانية'
    },
    en: {
      businessOverview: 'Business Overview',
      digitalPresence: 'Digital Presence',
      opportunities: 'Opportunities & Recommendations',
      businessType: 'Business Type',
      products: 'Products & Services',
      targetAudience: 'Target Audience',
      uniqueValue: 'Unique Value',
      seoScore: 'SEO Score',
      speedScore: 'Loading Speed',
      mobileFriendly: 'Mobile Friendly',
      sslSecure: 'SSL Secure',
      quickWins: 'Quick Wins',
      strategic: 'Strategic',
      seconds: 'seconds'
    }
  };

  const t = content[language];

  if (!results) return null;

  return (
    <div className="space-y-6">
      {/* Website URL */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            {websiteUrl}
          </div>
        </CardContent>
      </Card>

      {/* Business Overview */}
      {results.business_overview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t.businessOverview}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">{t.businessType}</label>
              <p className="text-lg">{results.business_overview.business_type}</p>
            </div>
            
            {results.business_overview.main_products && (
              <div>
                <label className="text-sm font-medium text-gray-600">{t.products}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {results.business_overview.main_products.map((product: string, index: number) => (
                    <Badge key={index} variant="secondary">{product}</Badge>
                  ))}
                </div>
              </div>
            )}

            {results.business_overview.target_audience && (
              <div>
                <label className="text-sm font-medium text-gray-600">{t.targetAudience}</label>
                <p>{results.business_overview.target_audience}</p>
              </div>
            )}

            {results.business_overview.unique_value && (
              <div>
                <label className="text-sm font-medium text-gray-600">{t.uniqueValue}</label>
                <p>{results.business_overview.unique_value}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Digital Presence */}
      {results.digital_presence && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t.digitalPresence}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.digital_presence.website_health?.seo_score && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.digital_presence.website_health.seo_score}
                  </div>
                  <div className="text-sm text-gray-600">{t.seoScore}</div>
                  <Progress 
                    value={results.digital_presence.website_health.seo_score} 
                    className="mt-2 h-2"
                  />
                </div>
              )}
              
              {results.digital_presence.website_health?.speed_score && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results.digital_presence.website_health.speed_score}{t.seconds}
                  </div>
                  <div className="text-sm text-gray-600">{t.speedScore}</div>
                </div>
              )}
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {results.digital_presence.website_health?.mobile_friendly ? (
                    <CheckCircle className="w-6 h-6 mx-auto" />
                  ) : (
                    <AlertCircle className="w-6 h-6 mx-auto" />
                  )}
                </div>
                <div className="text-sm text-gray-600">{t.mobileFriendly}</div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">
                  {results.digital_presence.website_health?.ssl_secure ? (
                    <CheckCircle className="w-6 h-6 mx-auto" />
                  ) : (
                    <AlertCircle className="w-6 h-6 mx-auto" />
                  )}
                </div>
                <div className="text-sm text-gray-600">{t.sslSecure}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities */}
      {results.opportunities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t.opportunities}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.opportunities.quick_wins && results.opportunities.quick_wins.length > 0 && (
              <div>
                <label className="text-sm font-medium text-green-600">{t.quickWins}</label>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {results.opportunities.quick_wins.map((item: string, index: number) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.opportunities.strategic && results.opportunities.strategic.length > 0 && (
              <div>
                <label className="text-sm font-medium text-blue-600">{t.strategic}</label>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {results.opportunities.strategic.map((item: string, index: number) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
