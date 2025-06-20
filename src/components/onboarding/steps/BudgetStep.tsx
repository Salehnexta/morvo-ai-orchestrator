
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, DollarSign } from 'lucide-react';

interface BudgetStepProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const BudgetStep: React.FC<BudgetStepProps> = ({ onNext, onPrevious, data, onDataChange }) => {
  const { language, isRTL } = useLanguage();
  const [selectedBudget, setSelectedBudget] = useState(data.budget || '');

  const content = {
    ar: {
      title: 'ما هي ميزانيتك التسويقية؟',
      subtitle: 'اختر الميزانية الشهرية المناسبة لك',
      budgets: [
        { id: 'less_than_1000', title: 'أقل من 1,000 ريال', description: 'مناسب للشركات الناشئة', color: 'bg-green-500/20 border-green-400' },
        { id: '1000_5000', title: '1,000 - 5,000 ريال', description: 'مناسب للشركات الصغيرة', color: 'bg-blue-500/20 border-blue-400' },
        { id: '5000_15000', title: '5,000 - 15,000 ريال', description: 'مناسب للشركات المتوسطة', color: 'bg-purple-500/20 border-purple-400' },
        { id: '15000_50000', title: '15,000 - 50,000 ريال', description: 'مناسب للشركات الكبيرة', color: 'bg-orange-500/20 border-orange-400' },
        { id: 'more_than_50000', title: 'أكثر من 50,000 ريال', description: 'مناسب للمؤسسات الكبرى', color: 'bg-red-500/20 border-red-400' },
        { id: 'not_sure', title: 'لست متأكداً', description: 'سنساعدك في تحديد الميزانية المناسبة', color: 'bg-gray-500/20 border-gray-400' }
      ],
      next: 'التالي',
      previous: 'السابق',
      selectBudget: 'يرجى اختيار الميزانية المناسبة'
    },
    en: {
      title: 'What is your marketing budget?',
      subtitle: 'Choose the monthly budget that suits you',
      budgets: [
        { id: 'less_than_1000', title: 'Less than 1,000 SAR', description: 'Suitable for startups', color: 'bg-green-500/20 border-green-400' },
        { id: '1000_5000', title: '1,000 - 5,000 SAR', description: 'Suitable for small companies', color: 'bg-blue-500/20 border-blue-400' },
        { id: '5000_15000', title: '5,000 - 15,000 SAR', description: 'Suitable for medium companies', color: 'bg-purple-500/20 border-purple-400' },
        { id: '15000_50000', title: '15,000 - 50,000 SAR', description: 'Suitable for large companies', color: 'bg-orange-500/20 border-orange-400' },
        { id: 'more_than_50000', title: 'More than 50,000 SAR', description: 'Suitable for enterprises', color: 'bg-red-500/20 border-red-400' },
        { id: 'not_sure', title: 'Not sure', description: 'We will help you determine the right budget', color: 'bg-gray-500/20 border-gray-400' }
      ],
      next: 'Next',
      previous: 'Previous',
      selectBudget: 'Please select a suitable budget'
    }
  };

  const t = content[language];

  const handleBudgetSelect = (budgetId: string) => {
    setSelectedBudget(budgetId);
    onDataChange({ budget: budgetId });
  };

  const handleNext = () => {
    if (selectedBudget) {
      onNext();
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <DollarSign className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-blue-200">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {t.budgets.map((budget) => (
          <div
            key={budget.id}
            onClick={() => handleBudgetSelect(budget.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedBudget === budget.id
                ? `${budget.color} shadow-lg scale-105`
                : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="text-center">
              <h3 className={`font-semibold text-lg mb-2 ${selectedBudget === budget.id ? 'text-white' : 'text-gray-300'}`}>
                {budget.title}
              </h3>
              <p className={`text-sm ${selectedBudget === budget.id ? 'text-blue-200' : 'text-gray-400'}`}>
                {budget.description}
              </p>
              <div className={`w-6 h-6 rounded-full border-2 mx-auto mt-4 flex items-center justify-center ${
                selectedBudget === budget.id
                  ? 'border-blue-400 bg-blue-400'
                  : 'border-gray-400'
              }`}>
                {selectedBudget === budget.id && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!selectedBudget && (
        <p className="text-center text-yellow-400 text-sm">{t.selectBudget}</p>
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
          disabled={!selectedBudget}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          {t.next}
          {isRTL ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};
