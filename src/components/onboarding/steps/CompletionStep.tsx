
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight, Trophy } from 'lucide-react';
import { UserProfileService } from '@/services/userProfileService';
import { useAuth } from '@/contexts/AuthContext';

interface CompletionStepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  onComplete?: () => void;
  data?: any;
  onDataChange?: (data: any) => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  data,
  onDataChange
}) => {
  const [completing, setCompleting] = useState(false);
  const { user } = useAuth();

  const handleComplete = async () => {
    if (!user) return;

    setCompleting(true);
    try {
      // Mark onboarding as complete
      await UserProfileService.saveUserProfile(user.id, {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });

      // Update completeness score
      await UserProfileService.updateCompleteness(user.id);

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit">
            <Trophy className="w-8 h-8 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-white mb-2">
            مبروك! اكتمل الإعداد
          </CardTitle>
          <p className="text-blue-200">
            تم إعداد ملفك التسويقي بنجاح، الآن يمكنك البدء في استخدام مورفو AI
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Achievement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-white font-medium">معلومات الشركة</p>
              <p className="text-xs text-blue-200">مكتملة</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-white font-medium">الأهداف التسويقية</p>
              <p className="text-xs text-blue-200">محددة</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-white font-medium">الجمهور المستهدف</p>
              <p className="text-xs text-blue-200">معرّف</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              الخطوات التالية
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                استكشف لوحة التحكم الرئيسية
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                ابدأ محادثة مع مستشارك الذكي
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                احصل على استراتيجية تسويقية مخصصة
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleComplete}
              disabled={completing}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              {completing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري الإنهاء...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  ابدأ رحلتك مع مورفو
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
