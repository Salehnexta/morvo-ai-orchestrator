
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';

interface ExperienceStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({ onNext, onPrevious, onSkip, data, onDataChange }) => {
  const { language, isRTL } = useLanguage();
  const [selectedExperience, setSelectedExperience] = useState(data.experience || '');

  const content = {
    ar: {
      title: 'ما هو مستوى خبرتك في التسويق الرقمي؟',
      subtitle: 'هذا سيساعدنا في تخصيص المحتوى والتوصيات لك',
      experiences: [
        { 
          id: 'beginner', 
          title: 'مبتدئ', 
          description: 'لدي معرفة قليلة أو لا توجد خبرة في التسويق الرقمي',
          color: 'bg-green-500/20 border-green-400'
        },
        { 
          id: 'intermediate', 
          title: 'متوسط', 
          description: 'أعرف الأساسيات وقمت ببعض الحملات التسويقية',
          color: 'bg-blue-500/20 border-blue-400'
        },
        { 
          id: 'advanced', 
          title: 'متقدم', 
          description: 'لدي خبرة جيدة في التسويق الرقمي وأدير حملات بانتظام',
          color: 'bg-purple-500/20 border-purple-400'
        },
        { 
          id: 'expert', 
          title: 'خبير', 
          description: 'لدي خبرة واسعة ومتخصص في مجال التسويق الرقمي',
          color: 'bg-orange-500/20 border-orange-400'
        }
      ],
      next: 'التالي',
      previous: 'السابق',
      skip: 'تخطي',
      optional: 'يمكنك تخطي هذه الخطوة'
    },
    en: {
      title: 'What is your level of experience in digital marketing?',
      subtitle: 'This will help us customize content and recommendations for you',
      experiences: [
        { 
          id: 'beginner', 
          title: 'Beginner', 
          description: 'Little to no experience in digital marketing',
          color: 'bg-green-500/20 border-green-400'
        },
        { 
          id: 'intermediate', 
          title: 'Intermediate', 
          description: 'Know the basics and have done some marketing campaigns',
          color: 'bg-blue-500/20 border-blue-400'
        },
        { 
          id: 'advanced', 
          title: 'Advanced', 
          description: 'Good experience in digital marketing and manage campaigns regularly',
          color: 'bg-purple-500/20 border-purple-400'
        },
        { 
          id: 'expert', 
          title: 'Expert', 
          description: 'Extensive experience and specialist in digital marketing',
          color: 'bg-orange-500/20 border-orange-400'
        }
      ],
      next: 'Next',
      previous: 'Previous',
      skip: 'Skip',
      optional: 'You can skip this step'
    }
  };

  const t = content[language];

  const handleExperienceSelect = (experienceId: string) => {
    setSelectedExperience(experienceId);
    onDataChange({ experience: experienceId });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <GraduationCap className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-blue-200">{t.subtitle}</p>
        <p className="text-yellow-400 text-sm mt-2">{t.optional}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {t.experiences.map((experience) => (
          <div
            key={experience.id}
            onClick={() => handleExperienceSelect(experience.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedExperience === experience.id
                ? `${experience.color} shadow-lg scale-105`
                : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="text-center">
              <h3 className={`font-bold text-xl mb-3 ${selectedExperience === experience.id ? 'text-white' : 'text-gray-300'}`}>
                {experience.title}
              </h3>
              <p className={`text-sm leading-relaxed ${selectedExperience === experience.id ? 'text-blue-200' : 'text-gray-400'}`}>
                {experience.description}
              </p>
              <div className={`w-6 h-6 rounded-full border-2 mx-auto mt-4 flex items-center justify-center ${
                selectedExperience === experience.id
                  ? 'border-blue-400 bg-blue-400'
                  : 'border-gray-400'
              }`}>
                {selectedExperience === experience.id && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
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

        <div className="space-x-2">
          {onSkip && (
            <Button
              onClick={onSkip}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {t.skip}
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {t.next}
            {isRTL ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
