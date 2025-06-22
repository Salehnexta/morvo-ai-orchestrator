
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Target, BarChart3, Users } from 'lucide-react';
import { UserProfileService } from '@/services/userProfileService';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeStepProps {
  onNext: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, data, onDataChange }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(data?.greeting_preference || '');
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    ar: {
      title: 'مرحباً بك في مورفو AI! 🚀',
      subtitle: 'نحن متحمسون لمساعدتك في بناء استراتيجية تسويقية ناجحة',
      greetingLabel: 'كيف تفضل أن نناديك؟',
      greetingPlaceholder: 'مثال: أستاذ أحمد، دكتور سارة، أو اسمك الأول',
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
      greetingLabel: 'How would you like us to address you?',
      greetingPlaceholder: 'Example: Mr. Ahmed, Dr. Sarah, or your first name',
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

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      // Save greeting preference directly to user profile
      if (greeting.trim() && user) {
        await UserProfileService.saveUserProfile(user.id, {
          greeting_preference: greeting.trim()
        });
      }

      // Update local data
      onDataChange({ 
        welcomed: true, 
        greeting_preference: greeting.trim(),
        timestamp: new Date().toISOString() 
      });

      onNext();
    } catch (error) {
      console.error('Error in welcome step:', error);
      // Continue anyway to avoid blocking user
      onDataChange({ 
        welcomed: true, 
        greeting_preference: greeting.trim(),
        timestamp: new Date().toISOString() 
      });
      onNext();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">{t.title}</h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        {t.features.map((feature, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-blue-200 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30 space-y-4 max-w-md mx-auto">
        <div className="text-left space-y-3">
          <Label htmlFor="greeting" className="text-blue-100 text-sm font-medium">
            {t.greetingLabel}
          </Label>
          <Input
            id="greeting"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder={t.greetingPlaceholder}
            className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
            dir="rtl"
          />
        </div>
        
        <p className="text-blue-100 mb-6 text-sm">{t.promise}</p>
        
        <Button
          onClick={handleGetStarted}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isLoading ? 'جاري التحضير...' : t.getStarted}
        </Button>
      </div>
    </div>
  );
};
