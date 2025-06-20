
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Target, TrendingUp, Users, DollarSign, Globe, Shield } from 'lucide-react';

interface MarketingGoalsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const MarketingGoalsStep: React.FC<MarketingGoalsStepProps> = ({ onNext, onPrevious, data, onDataChange }) => {
  const { language, isRTL } = useLanguage();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals || []);

  const content = {
    ar: {
      title: 'ما هي أهدافك التسويقية؟',
      subtitle: 'اختر الأهداف التي تريد تحقيقها (يمكن اختيار أكثر من هدف)',
      goals: [
        { id: 'increase_sales', title: 'زيادة المبيعات', description: 'تحسين الإيرادات وزيادة الطلب على المنتجات', icon: DollarSign },
        { id: 'brand_awareness', title: 'زيادة الوعي بالعلامة التجارية', description: 'جعل العلامة التجارية معروفة أكثر', icon: TrendingUp },
        { id: 'lead_generation', title: 'جذب عملاء محتملين', description: 'الحصول على معلومات العملاء المهتمين', icon: Users },
        { id: 'customer_retention', title: 'الاحتفاظ بالعملاء', description: 'بناء علاقات طويلة المدى مع العملاء', icon: Shield },
        { id: 'market_expansion', title: 'التوسع في السوق', description: 'دخول أسواق جديدة أو شرائح عملاء جديدة', icon: Globe },
        { id: 'cost_optimization', title: 'تحسين تكلفة التسويق', description: 'تحقيق نتائج أفضل بتكلفة أقل', icon: Target }
      ],
      next: 'التالي',
      previous: 'السابق',
      selectAtLeast: 'يرجى اختيار هدف واحد على الأقل'
    },
    en: {
      title: 'What are your marketing goals?',
      subtitle: 'Choose the goals you want to achieve (you can select multiple goals)',
      goals: [
        { id: 'increase_sales', title: 'Increase Sales', description: 'Improve revenue and increase product demand', icon: DollarSign },
        { id: 'brand_awareness', title: 'Brand Awareness', description: 'Make your brand more recognizable', icon: TrendingUp },
        { id: 'lead_generation', title: 'Lead Generation', description: 'Get information from interested customers', icon: Users },
        { id: 'customer_retention', title: 'Customer Retention', description: 'Build long-term relationships with customers', icon: Shield },
        { id: 'market_expansion', title: 'Market Expansion', description: 'Enter new markets or customer segments', icon: Globe },
        { id: 'cost_optimization', title: 'Cost Optimization', description: 'Achieve better results at lower cost', icon: Target }
      ],
      next: 'Next',
      previous: 'Previous',
      selectAtLeast: 'Please select at least one goal'
    }
  };

  const t = content[language];

  const handleGoalToggle = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    
    setSelectedGoals(newGoals);
    onDataChange({ goals: newGoals });
  };

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-blue-200">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {t.goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => handleGoalToggle(goal.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedGoals.includes(goal.id)
                ? 'border-blue-400 bg-blue-500/20 shadow-lg'
                : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start space-x-3">
              <goal.icon className={`w-6 h-6 mt-1 ${selectedGoals.includes(goal.id) ? 'text-blue-400' : 'text-gray-400'}`} />
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${selectedGoals.includes(goal.id) ? 'text-white' : 'text-gray-300'}`}>
                  {goal.title}
                </h3>
                <p className={`text-sm ${selectedGoals.includes(goal.id) ? 'text-blue-200' : 'text-gray-400'}`}>
                  {goal.description}
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedGoals.includes(goal.id)
                  ? 'border-blue-400 bg-blue-400'
                  : 'border-gray-400'
              }`}>
                {selectedGoals.includes(goal.id) && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGoals.length === 0 && (
        <p className="text-center text-yellow-400 text-sm">{t.selectAtLeast}</p>
      )}

      <div className={`flex justify-between pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          onClick={onPrevious}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
          {t.previous}
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedGoals.length === 0}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          {t.next}
          {isRTL ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};
