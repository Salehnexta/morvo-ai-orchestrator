
import React, { useState, useEffect } from 'react';
import { useJourney } from '@/contexts/JourneyContext';
import { JourneyFlowService, JourneyFlowState } from '@/services/journeyFlowService';
import { JourneyProgress } from './JourneyProgress';
import { WebsiteAnalysisStep } from './steps/WebsiteAnalysisStep';
import { BusinessReviewStep } from './steps/BusinessReviewStep';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, User, CheckCircle, Sparkles } from 'lucide-react';

interface JourneyPhaseHandlerProps {
  onPhaseComplete?: (phase: string) => void;
  className?: string;
}

export const JourneyPhaseHandler: React.FC<JourneyPhaseHandlerProps> = ({
  onPhaseComplete,
  className = ''
}) => {
  const { 
    journey, 
    currentPhase, 
    progress, 
    setGreeting, 
    analyzeWebsite, 
    updateJourneyPhase,
    generateStrategy
  } = useJourney();
  
  const [flowState, setFlowState] = useState<JourneyFlowState | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [websiteAnalysisData, setWebsiteAnalysisData] = useState<any>(null);

  // Load journey flow state
  useEffect(() => {
    const loadFlowState = async () => {
      if (journey?.journey_id) {
        const state = await JourneyFlowService.getJourneyFlowState(
          journey.journey_id, 
          journey.client_id
        );
        setFlowState(state);
      }
    };

    loadFlowState();
  }, [journey, currentPhase]);

  const handlePhaseAction = async (action: string, data?: any) => {
    if (!journey) return;

    setLoading(true);
    try {
      let success = false;

      switch (action) {
        case 'set_greeting':
          success = await setGreeting(data.greeting);
          if (success) {
            await JourneyFlowService.recordPhaseTransition(
              journey.journey_id,
              journey.client_id,
              'greeting_preference',
              'website_analysis',
              { greeting_selected: data.greeting }
            );
            updateJourneyPhase('website_analysis');
          }
          break;

        case 'website_analysis_complete':
          setWebsiteAnalysisData(data);
          updateJourneyPhase('analysis_review');
          success = true;
          break;

        case 'skip_website_analysis':
          updateJourneyPhase('profile_completion');
          success = true;
          break;

        case 'analysis_review_complete':
          updateJourneyPhase('profile_completion');
          success = true;
          break;

        case 'profile_completion_complete':
          updateJourneyPhase('professional_analysis');
          success = true;
          break;

        case 'professional_analysis_complete':
          updateJourneyPhase('strategy_generation');
          success = true;
          break;

        case 'generate_strategy':
          const strategy = await generateStrategy();
          if (strategy) {
            success = true;
            // Journey is now complete, trigger completion
            if (onPhaseComplete) {
              onPhaseComplete('strategy_generation');
            }
          }
          break;

        case 'complete_phase':
          const nextPhase = flowState?.nextPhase;
          if (nextPhase) {
            await JourneyFlowService.recordPhaseTransition(
              journey.journey_id,
              journey.client_id,
              currentPhase,
              nextPhase,
              data
            );
            updateJourneyPhase(nextPhase);
            success = true;
          }
          break;
      }

      if (success && onPhaseComplete && action !== 'generate_strategy') {
        onPhaseComplete(currentPhase);
      }
    } catch (error) {
      console.error('❌ Phase action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPhaseContent = () => {
    const currentPhaseData = JourneyFlowService.getPhase(currentPhase);
    if (!currentPhaseData) return null;

    switch (currentPhase) {
      case 'welcome':
        return (
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                {currentPhaseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-blue-200 mb-6">{currentPhaseData.description}</p>
              <p className="text-blue-100 mb-6 text-sm">
                سنقوم معاً ببناء استراتيجية تسويقية مخصصة لأعمالك في خطوات بسيطة
              </p>
              <Button
                onClick={() => handlePhaseAction('complete_phase')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                ابدأ الرحلة <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 'greeting_preference':
        return (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                {currentPhaseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-200">{currentPhaseData.description}</p>
              <div className="space-y-3">
                <label className="text-white block">اختر طريقة المخاطبة المفضلة:</label>
                <Select onValueChange={(value) => setFormData({...formData, greeting: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="أستاذ">أستاذ</SelectItem>
                    <SelectItem value="دكتور">دكتور</SelectItem>
                    <SelectItem value="مهندس">مهندس</SelectItem>
                    <SelectItem value="الاسم فقط">الاسم فقط</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handlePhaseAction('set_greeting', formData)}
                  disabled={loading || !formData.greeting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التفضيل'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'website_analysis':
        return (
          <WebsiteAnalysisStep
            onComplete={(data) => handlePhaseAction('website_analysis_complete', data)}
            onSkip={() => handlePhaseAction('skip_website_analysis')}
          />
        );

      case 'analysis_review':
        return (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">مراجعة نتائج التحليل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-200">
                تم تحليل موقعك بنجاح. يمكنك الآن مراجعة النتائج والمتابعة لإكمال ملفك التجاري.
              </p>
              {websiteAnalysisData && (
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-green-200">✅ تم تحليل الموقع بنجاح</p>
                </div>
              )}
              <Button
                onClick={() => handlePhaseAction('analysis_review_complete')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                المتابعة لإكمال الملف التجاري
              </Button>
            </CardContent>
          </Card>
        );

      case 'profile_completion':
        return (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">إكمال ملفك التجاري</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-200">
                الآن سنقوم بجمع معلومات إضافية عن أعمالك لبناء استراتيجية تسويقية دقيقة.
              </p>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-yellow-200">🔄 هذه المرحلة قيد التطوير</p>
                <p className="text-blue-200 text-sm mt-2">
                  سيتم إضافة نموذج تفصيلي لجمع معلومات الأعمال
                </p>
              </div>
              <Button
                onClick={() => handlePhaseAction('profile_completion_complete')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                متابعة للتحليل المتقدم
              </Button>
            </CardContent>
          </Card>
        );

      case 'professional_analysis':
        return (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">التحليل التسويقي المتقدم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-200">
                سنقوم الآن بتحليل شامل لوضعك التسويقي الحالي باستخدام الذكاء الاصطناعي.
              </p>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-yellow-200">🔄 التحليل المتقدم قيد التطوير</p>
                <p className="text-blue-200 text-sm mt-2">
                  سيتم دمج تحليلات متقدمة من مصادر متعددة
                </p>
              </div>
              <Button
                onClick={() => handlePhaseAction('professional_analysis_complete')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                المتابعة لتوليد الاستراتيجية
              </Button>
            </CardContent>
          </Card>
        );

      case 'strategy_generation':
        return (
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {currentPhaseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-blue-200">{currentPhaseData.description}</p>
              <p className="text-green-200">
                🎯 سيتم الآن توليد استراتيجيتك التسويقية المخصصة باستخدام GPT-4
              </p>
              <div className="bg-white/5 p-4 rounded-lg text-right">
                <p className="text-blue-200 text-sm">
                  ستتضمن الاستراتيجية:
                </p>
                <ul className="text-blue-100 text-sm mt-2 space-y-1">
                  <li>• تحليل السوق والمنافسين</li>
                  <li>• استراتيجية المحتوى</li>
                  <li>• خطة التسويق الرقمي</li>
                  <li>• توصيات الأدوات والقنوات</li>
                </ul>
              </div>
              <Button
                onClick={() => handlePhaseAction('generate_strategy')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'جاري توليد الاستراتيجية...' : 'توليد الاستراتيجية'}
                <Sparkles className="w-4 h-4 mr-2" />
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {currentPhaseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 mb-4">{currentPhaseData.description}</p>
              <Button
                onClick={() => handlePhaseAction('complete_phase')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                إكمال هذه المرحلة
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  const estimatedTimeRemaining = flowState 
    ? JourneyFlowService.calculateEstimatedTimeRemaining(currentPhase, flowState.completedPhases)
    : undefined;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Journey Progress */}
      <JourneyProgress
        currentPhase={currentPhase}
        completedPhases={flowState?.completedPhases || []}
        progress={progress}
        estimatedTimeRemaining={estimatedTimeRemaining}
      />

      {/* Current Phase Content */}
      {renderPhaseContent()}

      {/* Blockers Display */}
      {flowState?.blockers && flowState.blockers.length > 0 && (
        <Card className="bg-red-500/20 border-red-400/30">
          <CardContent className="p-4">
            <h4 className="font-semibold text-red-200 mb-2">متطلبات مفقودة:</h4>
            <ul className="text-red-300 text-sm space-y-1">
              {flowState.blockers.map((blocker, index) => (
                <li key={index}>• {blocker}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
