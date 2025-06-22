import React, { useState, useEffect } from 'react';
import { useJourney } from '@/contexts/JourneyContext';
import { useUserGreeting } from '@/hooks/useUserGreeting';
import { JourneyFlowService, JourneyFlowState } from '@/services/journeyFlowService';
import { JourneyProgress } from './JourneyProgress';
import { WebsiteAnalysisStep } from './steps/WebsiteAnalysisStep';
import { GreetingPreferenceStep } from './steps/GreetingPreferenceStep';
import { ProfileCompletionStep } from './steps/ProfileCompletionStep';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

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
    generateStrategy,
    saveAnswer
  } = useJourney();
  
  const { fullGreeting, displayName, loading: greetingLoading } = useUserGreeting();
  
  const [flowState, setFlowState] = useState<JourneyFlowState | null>(null);
  const [loading, setLoading] = useState(false);
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
    if (!journey) {
      console.log('No journey found, initializing...');
      return;
    }

    console.log('🎯 Phase action:', action, 'current phase:', currentPhase);
    
    setLoading(true);
    
    try {
      let success = false;
      let nextPhase = '';

      switch (action) {
        case 'set_greeting':
          success = await setGreeting(data.greeting);
          if (success) {
            nextPhase = 'website_analysis';
          }
          break;

        case 'website_analysis_complete':
          setWebsiteAnalysisData(data);
          nextPhase = 'analysis_review';
          success = true;
          break;

        case 'skip_website_analysis':
          nextPhase = 'profile_completion';
          success = true;
          break;

        case 'analysis_review_complete':
          nextPhase = 'profile_completion';
          success = true;
          break;

        case 'profile_completion_complete':
          // Save all profile data
          const profileKeys = [
            'company_name', 'industry', 'company_size', 'company_overview',
            'core_offerings', 'technical_products', 'business_focus', 'product_descriptions',
            'contact_email', 'contact_phone', 'contact_address', 'team_members', 'social_media'
          ];
          
          for (const key of profileKeys) {
            if (data[key] !== undefined) {
              await saveAnswer(key, data[key]);
            }
          }
          
          nextPhase = 'professional_analysis';
          success = true;
          break;

        case 'professional_analysis_complete':
          nextPhase = 'strategy_generation';
          success = true;
          break;

        case 'generate_strategy':
          const strategy = await generateStrategy();
          if (strategy) {
            success = true;
            if (onPhaseComplete) {
              onPhaseComplete('strategy_generation');
            }
          }
          break;

        case 'complete_phase':
          if (currentPhase === 'welcome') {
            nextPhase = 'greeting_preference';
            console.log('✅ Moving from welcome to greeting_preference');
          } else {
            const nextPhaseFromFlow = flowState?.nextPhase;
            if (nextPhaseFromFlow) {
              nextPhase = nextPhaseFromFlow;
            }
          }
          success = true;
          break;
      }

      if (success && nextPhase) {
        updateJourneyPhase(nextPhase);
        console.log('✅ Phase transition successful:', currentPhase, '->', nextPhase);
        
        if (onPhaseComplete && action !== 'generate_strategy') {
          onPhaseComplete(currentPhase);
        }
      }
    } catch (error) {
      console.error('❌ Phase action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPhaseContent = () => {
    console.log('🎨 Rendering phase:', currentPhase);
    
    switch (currentPhase) {
      case 'welcome':
        return (
          <Card className="bg-gray-800/95 border-gray-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                {greetingLoading ? 'مرحباً بك في مورفو!' : `${fullGreeting}، مرحباً بك في مورفو!`}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 mb-6">
                {displayName !== 'مستخدم' ? 
                  `${displayName}، سنقوم معاً ببناء استراتيجية تسويقية مخصصة لأعمالك في خطوات بسيطة` :
                  'سنقوم معاً ببناء استراتيجية تسويقية مخصصة لأعمالك في خطوات بسيطة'
                }
              </p>
              <div className="bg-gray-700/80 rounded-lg p-4 mb-6 border border-gray-600/50">
                <h3 className="text-white font-semibold mb-2">ما ستحصل عليه:</h3>
                <ul className="text-gray-200 text-sm space-y-1 text-right">
                  <li>• استراتيجية تسويقية شاملة مخصصة لأعمالك</li>
                  <li>• خطة محتوى لـ 3-6 أشهر</li>
                  <li>• تحليل منافسين وفرص السوق</li>
                  <li>• جدول نشر مقترح</li>
                  <li>• مؤشرات أداء مخصصة</li>
                </ul>
              </div>
              <Button
                onClick={() => handlePhaseAction('complete_phase')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                {loading ? 'جاري التحضير...' : 'ابدأ الرحلة'}
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 'greeting_preference':
        return (
          <GreetingPreferenceStep
            onComplete={(greeting) => handlePhaseAction('set_greeting', { greeting })}
            loading={loading}
            currentGreeting={journey?.greeting_preference}
          />
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
          <Card className="bg-gray-800/90 border-gray-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">مراجعة نتائج التحليل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200">
                تم تحليل موقعك بنجاح. يمكنك الآن مراجعة النتائج والمتابعة لإكمال ملفك التجاري.
              </p>
              {websiteAnalysisData && (
                <div className="bg-green-600/20 p-4 rounded-lg border border-green-500/30">
                  <p className="text-green-200">✅ تم تحليل الموقع بنجاح</p>
                </div>
              )}
              <Button
                onClick={() => handlePhaseAction('analysis_review_complete')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                المتابعة لإكمال الملف التجاري
              </Button>
            </CardContent>
          </Card>
        );

      case 'profile_completion':
        return (
          <ProfileCompletionStep
            onComplete={(data) => handlePhaseAction('profile_completion_complete', data)}
            onSkip={() => handlePhaseAction('professional_analysis_complete')}
            loading={loading}
            initialData={journey}
          />
        );

      case 'professional_analysis':
        return (
          <Card className="bg-gray-800/90 border-gray-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">التحليل التسويقي المتقدم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200">
                سنقوم الآن بتحليل شامل لوضعك التسويقي الحالي باستخدام الذكاء الاصطناعي.
              </p>
              <div className="bg-amber-600/20 p-4 rounded-lg border border-amber-500/30">
                <p className="text-amber-200">🔄 التحليل المتقدم قيد التطوير</p>
                <p className="text-gray-200 text-sm mt-2">
                  سيتم دمج تحليلات متقدمة من مصادر متعددة
                </p>
              </div>
              <Button
                onClick={() => handlePhaseAction('professional_analysis_complete')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                المتابعة لتوليد الاستراتيجية
              </Button>
            </CardContent>
          </Card>
        );

      case 'strategy_generation':
        return (
          <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                {greetingLoading ? 
                  'تحضير استراتيجيتك الخاصة' : 
                  `${fullGreeting}، تحضير استراتيجيتك الخاصة`
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-200">
                الآن سأقوم بإنشاء استراتيجية تسويقية مخصصة لك باستخدام أحدث تقنيات الذكاء الاصطناعي
              </p>
              <div className="bg-gray-700/60 p-4 rounded-lg text-right border border-gray-600/30">
                <p className="text-gray-200 text-sm">
                  ستتضمن الاستراتيجية:
                </p>
                <ul className="text-gray-100 text-sm mt-2 space-y-1">
                  <li>• تحليل السوق والمنافسين</li>
                  <li>• استراتيجية المحتوى</li>
                  <li>• خطة التسويق الرقمي</li>
                  <li>• توصيات الأدوات والقنوات</li>
                  <li>• جدول زمني للتنفيذ</li>
                </ul>
              </div>
              <Button
                onClick={() => handlePhaseAction('generate_strategy')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                {loading ? 'جاري توليد الاستراتيجية...' : 'توليد الاستراتيجية'}
                <Sparkles className="w-4 h-4 mr-2" />
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="bg-gray-800/95 border-gray-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">مرحلة غير معرّفة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200 mb-4">حدث خطأ في تحديد المرحلة الحالية</p>
              <Button
                onClick={() => handlePhaseAction('complete_phase')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                المتابعة
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

      {/* Debug Info */}
      <div className="bg-gray-800/80 p-3 rounded text-xs text-gray-300 border border-gray-600/50">
        <p>Current Phase: {currentPhase}</p>
        <p>Progress: {progress}%</p>
        <p>Journey: {journey ? 'Loaded' : 'Not loaded'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
      </div>

      {/* Blockers Display */}
      {flowState?.blockers && flowState.blockers.length > 0 && (
        <Card className="bg-red-600/20 border-red-400/50 shadow-xl">
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
