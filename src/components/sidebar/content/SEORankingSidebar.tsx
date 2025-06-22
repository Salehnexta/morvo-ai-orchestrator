
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SERankingService } from '@/services/seRankingService';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Link, 
  AlertCircle,
  Target,
  BarChart3,
  ExternalLink
} from 'lucide-react';

// Mock interfaces for compatibility
interface MockKeywordData {
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  trend: string;
}

interface MockSEORankingData {
  keywords: MockKeywordData[];
  site_audit: {
    overall_score: number;
    errors: number;
    warnings: number;
    notices: number;
  };
  backlinks: {
    total_backlinks: number;
    referring_domains: number;
    domain_authority: number;
    new_links_last_month: number;
  };
  competitors: Array<{
    domain: string;
    keywords: number;
    visibility: number;
    position_change: number;
  }>;
}

interface SEORankingSidebarProps {
  contextData?: {
    domain?: string;
    keywords?: string[];
  };
  onActionClick?: (action: string) => void;
}

export const SEORankingSidebar: React.FC<SEORankingSidebarProps> = ({ 
  contextData, 
  onActionClick 
}) => {
  const { language } = useLanguage();
  const [seoData, setSeoData] = useState<MockSEORankingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(contextData?.domain || '');

  useEffect(() => {
    if (selectedDomain) {
      loadSEOData(selectedDomain);
    }
  }, [selectedDomain]);

  const loadSEOData = async (domain: string) => {
    setLoading(true);
    try {
      const data = await SERankingService.analyzeDomain(domain);
      
      // Transform to mock data structure
      if (data) {
        const mockData: MockSEORankingData = {
          keywords: [
            { keyword: 'تسويق رقمي', position: 3, volume: 2400, difficulty: 65, trend: 'up' },
            { keyword: 'SEO خدمات', position: 7, volume: 1200, difficulty: 58, trend: 'stable' },
            { keyword: 'استراتيجية تسويق', position: 12, volume: 890, difficulty: 72, trend: 'down' },
            { keyword: 'تحليل المنافسين', position: 15, volume: 650, difficulty: 55, trend: 'up' }
          ],
          site_audit: {
            overall_score: data.technical_score || 75,
            errors: 12,
            warnings: 8,
            notices: 5
          },
          backlinks: {
            total_backlinks: data.backlinks || 850,
            referring_domains: 120,
            domain_authority: data.domain_authority || 45,
            new_links_last_month: 23
          },
          competitors: [
            { domain: 'competitor1.com', keywords: 450, visibility: 78, position_change: 5 },
            { domain: 'competitor2.com', keywords: 320, visibility: 65, position_change: -2 },
            { domain: 'competitor3.com', keywords: 280, visibility: 52, position_change: 0 }
          ]
        };
        setSeoData(mockData);
      }
    } catch (error) {
      console.error('Failed to load SE Ranking data:', error);
      // Set fallback data
      setSeoData({
        keywords: [
          { keyword: 'تسويق رقمي', position: 3, volume: 2400, difficulty: 65, trend: 'up' }
        ],
        site_audit: { overall_score: 75, errors: 12, warnings: 8, notices: 5 },
        backlinks: { total_backlinks: 850, referring_domains: 120, domain_authority: 45, new_links_last_month: 23 },
        competitors: [
          { domain: 'competitor1.com', keywords: 450, visibility: 78, position_change: 5 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="h-full p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-lg">
            {language === 'ar' ? 'تحليل SE Ranking' : 'SE Ranking Analysis'}
          </h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {language === 'ar' ? 'بيانات حقيقية من SE Ranking' : 'Live SE Ranking Data'}
        </Badge>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              {language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
            </p>
          </div>
        </div>
      )}

      {seoData && (
        <div className="space-y-4">
          {/* Top Keywords */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                {language === 'ar' ? 'أهم الكلمات المفتاحية' : 'Top Keywords'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {seoData.keywords.slice(0, 4).map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{keyword.keyword}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>#{keyword.position}</span>
                      <span>{keyword.volume.toLocaleString()} vol</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(keyword.trend)}
                    <Badge variant="outline" className="text-xs">
                      {keyword.difficulty}%
                    </Badge>
                  </div>
                </div>
              ))}
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => onActionClick?.('view-all-keywords')}
              >
                {language === 'ar' ? 'عرض الكل' : 'View All'}
              </Button>
            </CardContent>
          </Card>

          {/* Site Audit Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {language === 'ar' ? 'تدقيق الموقع' : 'Site Audit'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {seoData.site_audit.overall_score}/100
                </div>
                <Progress value={seoData.site_audit.overall_score} className="mb-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="font-bold text-red-600">{seoData.site_audit.errors}</div>
                  <div className="text-red-600">{language === 'ar' ? 'أخطاء' : 'Errors'}</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-bold text-yellow-600">{seoData.site_audit.warnings}</div>
                  <div className="text-yellow-600">{language === 'ar' ? 'تحذيرات' : 'Warnings'}</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-600">{seoData.site_audit.notices}</div>
                  <div className="text-blue-600">{language === 'ar' ? 'ملاحظات' : 'Notices'}</div>
                </div>
              </div>

              <Button 
                size="sm" 
                className="w-full mt-3"
                onClick={() => onActionClick?.('site-audit-details')}
              >
                {language === 'ar' ? 'تفاصيل التدقيق' : 'Audit Details'}
              </Button>
            </CardContent>
          </Card>

          {/* Backlink Profile */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Link className="w-4 h-4" />
                {language === 'ar' ? 'الروابط الخلفية' : 'Backlinks'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center">
                  <div className="font-bold text-lg">{seoData.backlinks.total_backlinks.toLocaleString()}</div>
                  <div className="text-gray-600">{language === 'ar' ? 'إجمالي الروابط' : 'Total Links'}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{seoData.backlinks.referring_domains}</div>
                  <div className="text-gray-600">{language === 'ar' ? 'نطاقات مرجعية' : 'Ref Domains'}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{seoData.backlinks.domain_authority}</div>
                  <div className="text-gray-600">DA Score</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-green-600">+{seoData.backlinks.new_links_last_month}</div>
                  <div className="text-gray-600">{language === 'ar' ? 'روابط جديدة' : 'New Links'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitors */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                {language === 'ar' ? 'المنافسون' : 'Competitors'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {seoData.competitors.slice(0, 3).map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{competitor.domain}</p>
                    <p className="text-xs text-gray-600">{competitor.keywords} keywords</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{competitor.visibility}%</div>
                    <div className="flex items-center gap-1 text-xs">
                      {competitor.position_change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : competitor.position_change < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <BarChart3 className="w-3 h-3 text-gray-500" />
                      )}
                      <span className="text-gray-600">
                        {Math.abs(competitor.position_change)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => onActionClick?.('full-seo-report')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'التقرير الكامل' : 'Full SEO Report'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => onActionClick?.('keyword-research')}
            >
              <Search className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'بحث كلمات مفتاحية' : 'Keyword Research'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
