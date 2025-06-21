
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Globe, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MorvoAIService } from '@/services/morvoAIService';

interface WebsiteAnalysisStepProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
  journeyId: string;
}

type AnalysisState = 'input' | 'analyzing' | 'completed' | 'error' | 'skipped';

export const WebsiteAnalysisStep: React.FC<WebsiteAnalysisStepProps> = ({
  onComplete,
  onSkip,
  journeyId
}) => {
  const { language } = useLanguage();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('input');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const content = {
    ar: {
      title: 'تحليل موقعك الإلكتروني',
      subtitle: 'سنحلل موقعك لجمع المعلومات وتوفير الوقت عليك',
      urlLabel: 'رابط موقعك الإلكتروني',
      urlPlaceholder: 'https://your-website.com',
      analyzeButton: 'تحليل الموقع',
      skipButton: 'لا يوجد موقع؟ إدخال يدوي',
      analyzingTitle: 'جاري تحليل موقعك...',
      analyzingSubtitle: 'يستغرق هذا عادة 30-45 ثانية',
      errorTitle: 'فشل في التحليل',
      tryAgain: 'حاول مرة أخرى',
      continueManually: 'المتابعة يدوياً',
      successTitle: 'تم التحليل بنجاح!',
      reviewData: 'مراجعة البيانات',
      invalidUrl: 'يرجى إدخال رابط صحيح'
    },
    en: {
      title: 'Analyze Your Website',
      subtitle: "We'll analyze your website to gather information and save you time",
      urlLabel: 'Your Website URL',
      urlPlaceholder: 'https://your-website.com',
      analyzeButton: 'Analyze Website',
      skipButton: "Don't have a website? Fill manually",
      analyzingTitle: 'Analyzing your website...',
      analyzingSubtitle: 'This usually takes 30-45 seconds',
      errorTitle: 'Analysis Failed',
      tryAgain: 'Try Again',
      continueManually: 'Continue Manually',
      successTitle: 'Analysis Complete!',
      reviewData: 'Review Data',
      invalidUrl: 'Please enter a valid URL'
    }
  };

  const t = content[language];

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const startAnalysis = async () => {
    if (!websiteUrl.trim()) {
      setError(t.invalidUrl);
      return;
    }

    if (!isValidUrl(websiteUrl)) {
      setError(t.invalidUrl);
      return;
    }

    setError('');
    setAnalysisState('analyzing');
    setAnalysisProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 2000);

    try {
      const response = await fetch('/v1/onboarding/website-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await MorvoAIService.getAuthToken()}`
        },
        body: JSON.stringify({
          journey_id: journeyId,
          website_url: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
        })
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResults(data.analysis_results);
      setAnalysisState('completed');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Website analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      setAnalysisState('error');
    }
  };

  const handleComplete = () => {
    onComplete({
      website_url: websiteUrl,
      analysis_results: analysisResults
    });
  };

  const renderContent = () => {
    switch (analysisState) {
      case 'input':
        return (
          <CardContent className="space-y-6">
            <div className="text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="website-url">{t.urlLabel}</Label>
                <Input
                  id="website-url"
                  type="url"
                  placeholder={t.urlPlaceholder}
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="mt-1"
                />
                {error && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={startAnalysis}
                  disabled={!websiteUrl.trim()}
                  className="w-full"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {t.analyzeButton}
                </Button>
                
                <Button
                  onClick={onSkip}
                  variant="outline"
                  className="w-full"
                >
                  {t.skipButton}
                </Button>
              </div>
            </div>
          </CardContent>
        );

      case 'analyzing':
        return (
          <CardContent className="space-y-6">
            <div className="text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
              <h2 className="text-2xl font-bold mb-2">{t.analyzingTitle}</h2>
              <p className="text-gray-600 mb-4">{t.analyzingSubtitle}</p>
              
              <div className="max-w-md mx-auto">
                <Progress value={analysisProgress} className="mb-2" />
                <p className="text-sm text-gray-500">
                  {Math.round(analysisProgress)}% {language === 'ar' ? 'مكتمل' : 'complete'}
                </p>
              </div>
            </div>
          </CardContent>
        );

      case 'error':
        return (
          <CardContent className="space-y-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h2 className="text-2xl font-bold mb-2 text-red-600">{t.errorTitle}</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setAnalysisState('input')}
                  variant="outline"
                >
                  {t.tryAgain}
                </Button>
                
                <Button onClick={onSkip}>
                  {t.continueManually}
                </Button>
              </div>
            </div>
          </CardContent>
        );

      case 'completed':
        return (
          <CardContent className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2 text-green-600">{t.successTitle}</h2>
              <p className="text-gray-600 mb-4">
                {language === 'ar' 
                  ? 'تم تحليل موقعك بنجاح. يمكنك الآن مراجعة وتحرير المعلومات.'
                  : 'Your website has been analyzed successfully. You can now review and edit the information.'
                }
              </p>
              
              <Button
                onClick={handleComplete}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.reviewData}
              </Button>
            </div>
          </CardContent>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        {renderContent()}
      </Card>
    </div>
  );
};
