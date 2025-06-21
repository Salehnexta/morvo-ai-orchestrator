
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CompletionStepProps {
  onComplete?: () => void;
  data?: any;
  onDataChange?: (data: any) => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ 
  onComplete, 
  data = {}, 
  onDataChange = () => {} 
}) => {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const content = {
    ar: {
      title: 'تهانينا! 🎉',
      subtitle: 'تم إعداد حسابك بنجاح',
      message: 'نحن الآن جاهزون لمساعدتك في بناء استراتيجية تسويقية ناجحة مخصصة لشركتك',
      features: [
        'تحليل شامل لبياناتك وجمهورك المستهدف',
        'استراتيجية تسويقية مخصصة حسب أهدافك',
        'توصيات ذكية لتحسين أداء حملاتك',
        'دعم فني متخصص على مدار الساعة'
      ],
      startJourney: 'ابدأ رحلتك التسويقية',
      ready: 'جاهز للانطلاق!'
    },
    en: {
      title: 'Congratulations! 🎉',
      subtitle: 'Your account has been successfully set up',
      message: 'We are now ready to help you build a successful marketing strategy customized for your company',
      features: [
        'Comprehensive analysis of your data and target audience',
        'Customized marketing strategy according to your goals',
        'Smart recommendations to improve campaign performance',
        '24/7 specialized technical support'
      ],
      startJourney: 'Start Your Marketing Journey',
      ready: 'Ready to Launch!'
    }
  };

  const t = content[language];

  const handleComplete = async () => {
    if (!user) {
      console.error('No user found for onboarding completion');
      return;
    }

    try {
      console.log('🎯 Completing onboarding for user:', user.id);
      
      // First, get the client record
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (clientError || !clientData) {
        console.error('Error finding client record:', clientError);
        toast({
          title: "خطأ",
          description: "حدث خطأ في إتمام عملية الإعداد",
          variant: "destructive",
        });
        return;
      }

      // Update customer profile to mark onboarding as completed
      const { error: profileError } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: user.id,
          client_id: clientData.id,
          profile_data: {
            onboarding_completed: true,
            completed_at: new Date().toISOString(),
            ...data
          },
          status: 'active',
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error updating customer profile:', profileError);
        toast({
          title: "خطأ",
          description: "حدث خطأ في حفظ البيانات",
          variant: "destructive",
        });
        return;
      }

      // Also update any onboarding journey record if it exists
      const { error: journeyError } = await supabase
        .from('onboarding_journeys')
        .upsert({
          client_id: clientData.id,
          is_completed: true,
          profile_progress: 100,
          analysis_completed_at: new Date().toISOString()
        });

      if (journeyError) {
        console.log('Note: Could not update onboarding journey:', journeyError);
        // Don't block completion for this error
      }

      console.log('✅ Onboarding completed successfully');
      
      // Update local state
      onDataChange({ 
        ...data, 
        completed: true, 
        completedAt: new Date().toISOString() 
      });

      // Call the completion callback
      if (onComplete) {
        onComplete();
      }

      toast({
        title: "مبروك!",
        description: "تم إكمال عملية الإعداد بنجاح",
      });
      
    } catch (error) {
      console.error('Error in handleComplete:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-center space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
        </div>
        <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6 relative z-10" />
      </div>

      <div>
        <h2 className="text-4xl font-bold text-white mb-4">{t.title}</h2>
        <h3 className="text-xl text-green-400 font-semibold mb-4">{t.subtitle}</h3>
        <p className="text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">{t.message}</p>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-green-400/20 max-w-2xl mx-auto">
        <h4 className="text-lg font-semibold text-white mb-4">{t.ready}</h4>
        <ul className="space-y-3 text-blue-200">
          {t.features.map((feature, index) => (
            <li key={index} className="flex items-start text-left">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-8">
        <Button
          onClick={handleComplete}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
          size="lg"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          {t.startJourney}
          <ArrowRight className="w-6 h-6 ml-3" />
        </Button>
      </div>
    </div>
  );
};
