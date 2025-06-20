
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface CompletionStepProps {
  onComplete?: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ onComplete, onDataChange }) => {
  const { language, isRTL } = useLanguage();

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

  const handleComplete = () => {
    onDataChange({ completed: true, completedAt: new Date().toISOString() });
    if (onComplete) {
      onComplete();
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
