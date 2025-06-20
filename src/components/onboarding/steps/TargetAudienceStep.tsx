
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Users } from 'lucide-react';

interface TargetAudienceStepProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const TargetAudienceStep: React.FC<TargetAudienceStepProps> = ({ onNext, onPrevious, data, onDataChange }) => {
  const { language, isRTL } = useLanguage();
  const [targetAudience, setTargetAudience] = useState(data.targetAudience || '');

  const content = {
    ar: {
      title: 'من هو جمهورك المستهدف؟',
      subtitle: 'صف لنا عملاءك المثاليين لنساعدك في الوصول إليهم',
      placeholder: 'مثال: الشباب من سن 25-40 سنة، أصحاب الدخل المتوسط إلى العالي، مهتمون بالتقنية والابتكار، يعيشون في المدن الكبرى، يستخدمون وسائل التواصل الاجتماعي بكثرة...',
      examples: {
        title: 'أمثلة لوصف الجمهور المستهدف:',
        list: [
          'العمر والجنس: "النساء من سن 25-45 سنة"',
          'الموقع الجغرافي: "سكان الرياض وجدة والدمام"',
          'الاهتمامات: "مهتمون بالصحة واللياقة البدنية"',
          'السلوك: "يتسوقون عبر الإنترنت بانتظام"',
          'الدخل: "أصحاب الدخل المتوسط إلى العالي"'
        ]
      },
      next: 'التالي',
      previous: 'السابق',
      required: 'يرجى وصف جمهورك المستهدف'
    },
    en: {
      title: 'Who is your target audience?',
      subtitle: 'Describe your ideal customers so we can help you reach them',
      placeholder: 'Example: Young adults aged 25-40, middle to high income, interested in technology and innovation, living in major cities, heavy social media users...',
      examples: {
        title: 'Examples of target audience description:',
        list: [
          'Age and gender: "Women aged 25-45"',
          'Location: "Residents of Riyadh, Jeddah, and Dammam"',
          'Interests: "Interested in health and fitness"',
          'Behavior: "Regular online shoppers"',
          'Income: "Middle to high income earners"'
        ]
      },
      next: 'Next',
      previous: 'Previous',
      required: 'Please describe your target audience'
    }
  };

  const t = content[language];

  const handleChange = (value: string) => {
    setTargetAudience(value);
    onDataChange({ targetAudience: value });
  };

  const handleNext = () => {
    if (targetAudience.trim()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-blue-200">{t.subtitle}</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Textarea
            value={targetAudience}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t.placeholder}
            rows={6}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
          />
          {!targetAudience.trim() && (
            <p className="text-yellow-400 text-sm mt-2">{t.required}</p>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">{t.examples.title}</h3>
          <ul className="space-y-2 text-blue-200">
            {t.examples.list.map((example, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                {example}
              </li>
            ))}
          </ul>
        </div>
      </div>

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
          disabled={!targetAudience.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          {t.next}
          {isRTL ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};
