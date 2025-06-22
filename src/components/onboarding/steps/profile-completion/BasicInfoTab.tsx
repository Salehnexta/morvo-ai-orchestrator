
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoTabProps {
  profileData: {
    company_name: string;
    industry: string;
    company_size: string;
    company_overview: string;
  };
  updateField: (field: string, value: string) => void;
}

const industries = [
  { value: 'technology', label: 'التقنية والبرمجيات' },
  { value: 'retail', label: 'التجارة والبيع بالتجزئة' },
  { value: 'healthcare', label: 'الرعاية الصحية' },
  { value: 'education', label: 'التعليم' },
  { value: 'finance', label: 'المالية والمصرفية' },
  { value: 'real_estate', label: 'العقارات' },
  { value: 'food', label: 'المأكولات والمشروبات' },
  { value: 'manufacturing', label: 'التصنيع' },
  { value: 'services', label: 'الخدمات المهنية' },
  { value: 'consulting', label: 'الاستشارات' },
  { value: 'marketing', label: 'التسويق والإعلان' },
  { value: 'other', label: 'أخرى' }
];

const companySizes = [
  { value: '1-5', label: '1-5 موظفين' },
  { value: '6-20', label: '6-20 موظف' },
  { value: '21-50', label: '21-50 موظف' },
  { value: '51-200', label: '51-200 موظف' },
  { value: '200+', label: 'أكثر من 200 موظف' }
];

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ profileData, updateField }) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-white mb-2 block">اسم الشركة *</Label>
          <Input
            value={profileData.company_name}
            onChange={(e) => updateField('company_name', e.target.value)}
            placeholder="أدخل اسم شركتك"
            className="bg-gray-700/80 border-gray-600/50 text-white"
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">القطاع *</Label>
          <Select value={profileData.industry} onValueChange={(value) => updateField('industry', value)}>
            <SelectTrigger className="bg-gray-700/80 border-gray-600/50 text-white">
              <SelectValue placeholder="اختر القطاع" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value} className="text-white">
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-2 block">حجم الشركة *</Label>
          <Select value={profileData.company_size} onValueChange={(value) => updateField('company_size', value)}>
            <SelectTrigger className="bg-gray-700/80 border-gray-600/50 text-white">
              <SelectValue placeholder="اختر حجم الشركة" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {companySizes.map((size) => (
                <SelectItem key={size.value} value={size.value} className="text-white">
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-white mb-2 block">نظرة عامة على الشركة</Label>
        <Textarea
          value={profileData.company_overview}
          onChange={(e) => updateField('company_overview', e.target.value)}
          placeholder="وصف مختصر عن شركتك ونشاطها الأساسي..."
          className="bg-gray-700/80 border-gray-600/50 text-white min-h-[100px]"
        />
      </div>
    </div>
  );
};
