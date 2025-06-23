
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MarketingFormProps {
  profile: any;
  updateProfile: (field: string, value: any) => void;
  handleArrayFieldChange: (field: string, value: string, checked: boolean) => void;
}

export const MarketingForm: React.FC<MarketingFormProps> = ({ 
  profile, 
  updateProfile, 
  handleArrayFieldChange 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="marketing_experience" className="text-white">
            خبرتك في التسويق *
          </Label>
          <Select
            value={profile.marketing_experience}
            onValueChange={(value) => updateProfile('marketing_experience', value)}
          >
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="اختر مستوى خبرتك" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">مبتدئ</SelectItem>
              <SelectItem value="intermediate">متوسط</SelectItem>
              <SelectItem value="advanced">متقدم</SelectItem>
              <SelectItem value="expert">خبير</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="monthly_marketing_budget" className="text-white">
            الميزانية التسويقية الشهرية *
          </Label>
          <Select
            value={profile.monthly_marketing_budget}
            onValueChange={(value) => updateProfile('monthly_marketing_budget', value)}
          >
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="اختر ميزانيتك الشهرية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less_than_1000">أقل من 1,000 ريال</SelectItem>
              <SelectItem value="1000_5000">1,000 - 5,000 ريال</SelectItem>
              <SelectItem value="5000_15000">5,000 - 15,000 ريال</SelectItem>
              <SelectItem value="15000_50000">15,000 - 50,000 ريال</SelectItem>
              <SelectItem value="more_than_50000">أكثر من 50,000 ريال</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-white">
          ما هي أهدافك التسويقية الأساسية؟
        </Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {[
            'زيادة المبيعات',
            'بناء الهوية التجارية',
            'زيادة الوعي بالعلامة التجارية',
            'جذب عملاء جدد',
            'تحسين تفاعل العملاء',
            'زيادة حركة المرور للموقع',
          ].map((goal) => (
            <div
              key={goal}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Checkbox
                id={goal}
                checked={(profile.primary_marketing_goals as string[])?.includes(goal) || false}
                onCheckedChange={(checked) =>
                  handleArrayFieldChange('primary_marketing_goals', goal, checked as boolean)
                }
                className="border-slate-400"
              />
              <Label htmlFor={goal} className="text-sm text-white">
                {goal}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="biggest_marketing_challenge" className="text-white">
          أكبر تحدي تسويقي تواجهه
        </Label>
        <Textarea
          id="biggest_marketing_challenge"
          value={profile.biggest_marketing_challenge || ''}
          onChange={(e) => updateProfile('biggest_marketing_challenge', e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white"
          placeholder="اشرح أكبر التحديات التي تواجهها في التسويق"
          rows={3}
        />
      </div>
    </div>
  );
};
