
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Building } from 'lucide-react';

interface CompanyInfoStepProps {
  onNext: () => void;
  onPrevious: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ onNext, onPrevious, data, onDataChange }) => {
  const { language, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    industry: data.industry || '',
    companySize: data.companySize || '',
    website: data.website || ''
  });

  const content = {
    ar: {
      title: 'أخبرنا عن شركتك',
      subtitle: 'هذه المعلومات ستساعدنا في تخصيص الخدمة لك',
      companyName: 'اسم الشركة',
      companyNamePlaceholder: 'مثال: شركة التقنية المتقدمة',
      industry: 'القطاع',
      companySize: 'حجم الشركة',
      website: 'الموقع الإلكتروني (اختياري)',
      websitePlaceholder: 'https://example.com',
      industries: [
        { value: 'technology', label: 'التقنية والبرمجيات' },
        { value: 'retail', label: 'التجارة والبيع بالتجزئة' },
        { value: 'healthcare', label: 'الرعاية الصحية' },
        { value: 'education', label: 'التعليم' },
        { value: 'finance', label: 'المالية والمصرفية' },
        { value: 'real_estate', label: 'العقارات' },
        { value: 'food', label: 'المأكولات والمشروبات' },
        { value: 'manufacturing', label: 'التصنيع' },
        { value: 'services', label: 'الخدمات المهنية' },
        { value: 'other', label: 'أخرى' }
      ],
      companySizes: [
        { value: '1-10', label: '1-10 موظفين' },
        { value: '11-50', label: '11-50 موظف' },
        { value: '51-200', label: '51-200 موظف' },
        { value: '201-500', label: '201-500 موظف' },
        { value: '500+', label: 'أكثر من 500 موظف' }
      ],
      next: 'التالي',
      previous: 'السابق',
      required: 'مطلوب'
    },
    en: {
      title: 'Tell us about your company',
      subtitle: 'This information will help us customize the service for you',
      companyName: 'Company Name',
      companyNamePlaceholder: 'Example: Advanced Technology Company',
      industry: 'Industry',
      companySize: 'Company Size',
      website: 'Website (Optional)',
      websitePlaceholder: 'https://example.com',
      industries: [
        { value: 'technology', label: 'Technology & Software' },
        { value: 'retail', label: 'Retail & E-commerce' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'finance', label: 'Finance & Banking' },
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'food', label: 'Food & Beverage' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'services', label: 'Professional Services' },
        { value: 'other', label: 'Other' }
      ],
      companySizes: [
        { value: '1-10', label: '1-10 employees' },
        { value: '11-50', label: '11-50 employees' },
        { value: '51-200', label: '51-200 employees' },
        { value: '201-500', label: '201-500 employees' },
        { value: '500+', label: '500+ employees' }
      ],
      next: 'Next',
      previous: 'Previous',
      required: 'Required'
    }
  };

  const t = content[language];

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const handleNext = () => {
    if (formData.companyName && formData.industry && formData.companySize) {
      onNext();
    }
  };

  const isValid = formData.companyName && formData.industry && formData.companySize;

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <Building className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-blue-200">{t.subtitle}</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <Label htmlFor="companyName" className="text-white mb-2 block">
            {t.companyName} <span className="text-red-400">*</span>
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder={t.companyNamePlaceholder}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <div>
          <Label className="text-white mb-2 block">
            {t.industry} <span className="text-red-400">*</span>
          </Label>
          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="اختر القطاع" />
            </SelectTrigger>
            <SelectContent>
              {t.industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-2 block">
            {t.companySize} <span className="text-red-400">*</span>
          </Label>
          <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="اختر حجم الشركة" />
            </SelectTrigger>
            <SelectContent>
              {t.companySizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="website" className="text-white mb-2 block">
            {t.website}
          </Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder={t.websitePlaceholder}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
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
          disabled={!isValid}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          {t.next}
          {isRTL ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};
