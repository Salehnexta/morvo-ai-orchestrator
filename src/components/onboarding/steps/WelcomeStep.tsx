
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, BarChart3, Users } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onDataChange }) => {
  const { language } = useLanguage();

  const content = {
    ar: {
      title: 'مرحباً بك في مورفو AI! 🚀',
      subtitle: 'نحن متحمسون لمساعدتك في بناء استراتيجية تسويقية ناجحة',
      features: [
        {
          icon: Target,
          title: 'تحليل ذكي',
          description: 'نحلل بياناتك لفهم جمهورك المستهدف بدقة'
        },
        {
          icon: BarChart3,
          title: 'استراتيجية مخصصة',
          description: 'نبني لك خطة تسويقية تناسب أهدافك وميزانيتك'
        },
        {
          icon: Users,
          title: 'دعم مستمر',
          description: 'فريقنا من الخبراء جاهز لمساعدتك في كل خطوة'
        }
      ],
      getStarted: 'ابدأ الآن',
      promise: 'سنحتاج فقط 5 دقائق لإعداد حسابك والبدء في رحلة النجاح التسويقي'
    },
    en: {
      title: 'Welcome to Morvo AI! 🚀',
      subtitle: 'We\'re excited to help you build a successful marketing strategy',
      features: [
        {
          icon: Target,
          title: 'Smart Analysis',
          description: 'We analyze your data to understand your target audience precisely'
        },
        {
          icon: BarChart3,
          title: 'Custom Strategy',
          description: 'We build a marketing plan that fits your goals and budget'
        },
        {
          icon: Users,
          title: 'Continuous Support',
          description: 'Our team of experts is ready to help you every step of the way'
        }
      ],
      getStarted: 'Get Started',
      promise: 'We only need 5 minutes to set up your account and start your marketing success journey'
    }
  };

  const t = content[language];

  const handleGetStarted = () => {
    onDataChange({ welcomed: true, timestamp: new Date().toISOString() });
    onNext();
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">{t.title}</h2>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        {t.features.map((feature, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-blue-200 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
        <p className="text-blue-100 mb-6">{t.promise}</p>
        <Button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {t.getStarted}
        </Button>
      </div>
    </div>
  );
};
