
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CompetitorAnalysisService, EnhancedCompetitorData } from '@/services/competitorAnalysisService';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Users, 
  TrendingUp, 
  Link, 
  Search, 
  AlertTriangle,
  Target,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

export const CompetitorAnalysisCard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [competitorData, setCompetitorData] = useState<EnhancedCompetitorData | null>(null);
  const [needsEnhancement, setNeedsEnhancement] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadCompetitorData();
    }
  }, [user]);

  const loadCompetitorData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await CompetitorAnalysisService.getEnhancedCompetitorAnalysis(user.id);
      setCompetitorData(data);
      
      if (data) {
        setNeedsEnhancement(CompetitorAnalysisService.needsEnhancement(data));
      }
    } catch (error) {
      console.error('Error loading competitor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceAnalysis = async () => {
    if (!user?.id) return;

    setIsEnhancing(true);
    try {
      const enhanced = await CompetitorAnalysisService.enhanceWithSERanking(user.id);
      if (enhanced) {
        setCompetitorData(enhanced);
        setNeedsEnhancement(false);
      }
    } catch (error) {
      console.error('Error enhancing analysis:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const content = {
    ar: {
      title: 'تحليل المنافسين',
      enhance: 'تحسين التحليل بـ SE Ranking',
      enhancing: 'جاري التحليل...',
      noCompetitors: 'لم يتم العثور على منافسين',
      setupFirst: 'أكمل إعداد الملف الشخصي أولاً',
      visibility: 'معدل الظهور',
      backlinks: 'الروابط الخلفية',
      keywords: 'الكلمات المفتاحية',
      traffic: 'حركة الزوار المقدرة',
      gaps: 'الفجوات التنافسية',
      opportunities: 'الفرص المتاحة',
      lastUpdated: 'آخر تحديث',
      basicAnalysis: 'تحليل أساسي',
      enhancedAnalysis: 'تحليل متقدم'
    },
    en: {
      title: 'Competitor Analysis',
      enhance: 'Enhance with SE Ranking',
      enhancing: 'Analyzing...',
      noCompetitors: 'No competitors found',
      setupFirst: 'Complete profile setup first',
      visibility: 'Visibility Score',
      backlinks: 'Backlinks',
      keywords: 'Keywords',
      traffic: 'Estimated Traffic',
      gaps: 'Competitive Gaps',
      opportunities: 'Opportunities',
      lastUpdated: 'Last Updated',
      basicAnalysis: 'Basic Analysis',
      enhancedAnalysis: 'Enhanced Analysis'
    }
  };

  const t = content[language];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t.title}
        </CardTitle>
        
        {needsEnhancement && (
          <Button 
            onClick={handleEnhanceAnalysis}
            disabled={isEnhancing}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isEnhancing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {t.enhancing}
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                {t.enhance}
              </>
            )}
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {!competitorData ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t.noCompetitors}</p>
            <p className="text-sm mt-2">{t.setupFirst}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">منافس تجريبي</h4>
                  <p className="text-sm text-gray-600">example.com</p>
                </div>
                <Badge variant={competitorData.seRankingData ? "default" : "outline"}>
                  {competitorData.seRankingData ? t.enhancedAnalysis : t.basicAnalysis}
                </Badge>
              </div>

              {competitorData.seRankingData && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">75%</div>
                      <div className="text-xs text-gray-600">{t.visibility}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">1,250</div>
                      <div className="text-xs text-gray-600">{t.backlinks}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">345</div>
                      <div className="text-xs text-gray-600">{t.keywords}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">12,500</div>
                      <div className="text-xs text-gray-600">{t.traffic}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      {t.gaps}
                    </h5>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 bg-orange-50 p-2 rounded">
                        فجوة في المحتوى التسويقي
                      </p>
                      <p className="text-xs text-gray-600 bg-orange-50 p-2 rounded">
                        ضعف في استراتيجية الكلمات المفتاحية
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <h5 className="font-medium text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      {t.opportunities}
                    </h5>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                        تحسين المحتوى المحلي
                      </p>
                      <p className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                        استهداف كلمات مفتاحية جديدة
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
