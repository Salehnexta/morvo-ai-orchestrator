
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BasicInfoFormProps {
  profile: any;
  updateProfile: (field: string, value: any) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ profile, updateProfile }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="full_name" className="text-white">
            الاسم الكامل *
          </Label>
          <Input
            id="full_name"
            value={profile.full_name || ''}
            onChange={(e) => updateProfile('full_name', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        <div>
          <Label htmlFor="greeting_preference" className="text-white">
            طريقة المخاطبة المفضلة
          </Label>
          <Select
            value={profile.greeting_preference}
            onValueChange={(value) => updateProfile('greeting_preference', value)}
          >
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="اختر طريقة المخاطبة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="أستاذ">أستاذ</SelectItem>
              <SelectItem value="دكتور">دكتور</SelectItem>
              <SelectItem value="مهندس">مهندس</SelectItem>
              <SelectItem value="بالاسم">بالاسم الأول</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="company_name" className="text-white">
            اسم الشركة *
          </Label>
          <Input
            id="company_name"
            value={profile.company_name || ''}
            onChange={(e) => updateProfile('company_name', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="أدخل اسم شركتك"
          />
        </div>

        <div>
          <Label htmlFor="industry" className="text-white">
            المجال *
          </Label>
          <Select
            value={profile.industry}
            onValueChange={(value) => updateProfile('industry', value)}
          >
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="اختر مجال عملك" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">التجارة الإلكترونية</SelectItem>
              <SelectItem value="healthcare">الرعاية الصحية</SelectItem>
              <SelectItem value="education">التعليم</SelectItem>
              <SelectItem value="technology">التكنولوجيا</SelectItem>
              <SelectItem value="finance">المالية</SelectItem>
              <SelectItem value="real_estate">العقارات</SelectItem>
              <SelectItem value="food">الطعام والمشروبات</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="company_size" className="text-white">
            حجم الشركة *
          </Label>
          <Select
            value={profile.company_size}
            onValueChange={(value) => updateProfile('company_size', value)}
          >
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="اختر حجم شركتك" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 موظفين</SelectItem>
              <SelectItem value="11-50">11-50 موظف</SelectItem>
              <SelectItem value="51-200">51-200 موظف</SelectItem>
              <SelectItem value="201-500">201-500 موظف</SelectItem>
              <SelectItem value="500+">أكثر من 500 موظف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="website_url" className="text-white">
            رابط الموقع الإلكتروني
          </Label>
          <Input
            id="website_url"
            type="url"
            value={profile.website_url || ''}
            onChange={(e) => updateProfile('website_url', e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="company_overview" className="text-white">
          نبذة عن الشركة *
        </Label>
        <Textarea
          id="company_overview"
          value={profile.company_overview || ''}
          onChange={(e) => updateProfile('company_overview', e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white"
          placeholder="اكتب نبذة مختصرة عن شركتك وما تقدمه من خدمات أو منتجات"
          rows={4}
        />
      </div>
    </div>
  );
};
