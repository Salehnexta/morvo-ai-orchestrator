
import React, { useState, useEffect, useRef } from 'react';
import { useJourney } from '@/contexts/JourneyContext';
import { useUserGreeting } from '@/hooks/useUserGreeting';
import { JourneyFlowService, JourneyFlowState } from '@/services/journeyFlowService';
import { JourneyProgress } from './JourneyProgress';
import { WebsiteAnalysisStep } from './steps/WebsiteAnalysisStep';
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
  
  const { fullGreeting, displayName, loading: greetingLoading } = useUserGreeting();
  
  const [flowState, setFlowState] = useState<JourneyFlowState | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [websiteAnalysisData, setWebsiteAnalysisData] = useState<any>(null);
  const [localCurrentPhase, setLocalCurrentPhase] = useState(currentPhase);
  
  // Add ref to track if we're in a transition to prevent sync conflicts
  const isTransitioningRef = useRef(false);
  const lastTransitionRef = useRef<string>('');

  // Sync local phase with context phase - but prevent conflicts during transitions
  useEffect(() => {
    console.log('🔄 Phase sync: context phase =', currentPhase, ', local phase =', localCurrentPhase, ', transitioning =', isTransitioningRef.current);
    
    // Only sync if we're not in the middle of a transition and the phases are actually different
    if (!isTransitioningRef.current && currentPhase !== localCurrentPhase) {
      // Add a small delay to avoid conflicts with rapid state changes
      const timeoutId = setTimeout(() => {
        if (!isTransitioningRef.current) {
          setLocalCurrentPhase(currentPhase);
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentPhase]);

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
  }, [journey, localCurrentPhase]);

  const handlePhaseAction = async (action: string, data?: any) => {
    if (!journey) {
      console.log('No journey found, initializing...');
      return;
    }

    console.log('🎯 Phase action:', action, 'current phase:', localCurrentPhase);
    
    // Set transition flag to prevent sync conflicts
    isTransitioningRef.current = true;
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
          // Handle welcome phase specifically
          if (localCurrentPhase === 'welcome') {
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
        // Prevent the sync effect from interfering
        const transitionId = `${localCurrentPhase}->${nextPhase}`;
        lastTransitionRef.current = transitionId;
        
        // Update both local and context state
        setLocalCurrentPhase(nextPhase);
        updateJourneyPhase(nextPhase);
        
        console.log('✅ Phase transition successful:', localCurrentPhase, '->', nextPhase);
        
        if (onPhaseComplete && action !== 'generate_strategy') {
          onPhaseComplete(localCurrentPhase);
        }
      }
    } catch (error) {
      console.error('❌ Phase action failed:', error);
    } finally {
      setLoading(false);
      // Clear transition flag after a delay to ensure state has settled
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 500);
    }
  };

  const renderPhaseContent = () => {
    const currentPhaseToRender = localCurrentPhase;
    const currentPhaseData = JourneyFlowService.getPhase(currentPhaseToRender);
    
    console.log('🎨 Rendering phase:', currentPhaseToRender);
    
    if (!currentPhaseData) return null;

    switch (currentPhaseToRender) {
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
          <Card className="bg-gray-800/95 border-gray-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                {displayName !== 'مستخدم' ? 
                  `${displayName}، كيف تفضل أن أناديك؟` : 
                  'كيف تفضل أن أناديك؟'
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200">
                اختر الطريقة التي تفضل أن أخاطبك بها في جميع محادثاتنا المستقبلية
              </p>
              <div className="space-y-3">
                <label className="text-white block">اختر طريقة المخاطبة المفضلة:</label>
                <Select onValueChange={(value) => setFormData({...formData, greeting: value})}>
                  <SelectTrigger className="bg-gray-700/80 border-gray-600/50 text-white">
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
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
          <Card className="bg-gray-800/90 border-gray-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">إكمال ملفك التجاري</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200">
                الآن سنقوم بجمع معلومات إضافية عن أعمالك لبناء استراتيجية تسويقية دقيقة.
              </p>
              <div className="bg-amber-600/20 p-4 rounded-lg border border-amber-500/30">
                <p className="text-amber-200">🔄 هذه المرحلة قيد التطوير</p>
                <p className="text-gray-200 text-sm mt-2">
                  سيتم إضافة نموذج تفصيلي لجمع معلومات الأعمال
                </p>
              </div>
              <Button
                onClick={() => handlePhaseAction('profile_completion_complete')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                متابعة للتحليل المتقدم
              </Button>
            </CardContent>
          </Card>
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
              <p className="text-green-200">
                🎯 ستحصل على استراتيجية شاملة مصممة خصيصاً لأعمالك
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
              <CardTitle className="text-white">
                {currentPhaseData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200 mb-4">{currentPhaseData.description}</p>
              <Button
                onClick={() => handlePhaseAction('complete_phase')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                إكمال هذه المرحلة
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  const estimatedTimeRemaining = flowState 
    ? JourneyFlowService.calculateEstimatedTimeRemaining(localCurrentPhase, flowState.completedPhases)
    : undefined;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Journey Progress */}
      <JourneyProgress
        currentPhase={localCurrentPhase}
        completedPhases={flowState?.completedPhases || []}
        progress={progress}
        estimatedTimeRemaining={estimatedTimeRemaining}
      />

      {/* Current Phase Content */}
      {renderPhaseContent()}

      {/* Debug Info */}
      <div className="bg-gray-800/80 p-3 rounded text-xs text-gray-300 border border-gray-600/50">
        <p>Current Phase: {localCurrentPhase}</p>
        <p>Context Phase: {currentPhase}</p>
        <p>Progress: {progress}%</p>
        <p>Journey: {journey ? 'Loaded' : 'Not loaded'}</p>
        <p>Transitioning: {isTransitioningRef.current ? 'Yes' : 'No'}</p>
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
