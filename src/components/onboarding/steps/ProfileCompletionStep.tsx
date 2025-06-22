
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Users, Target, Globe, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileData {
  company_name: string;
  industry: string;
  company_size: string;
  company_overview: string;
  core_offerings: string;
  technical_products: string;
  business_focus: string;
  product_descriptions: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  team_members: string[];
  social_media: {
    website: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
}

interface ProfileCompletionStepProps {
  onComplete: (data: ProfileData) => void;
  onSkip: () => void;
  loading?: boolean;
  initialData?: Partial<ProfileData>;
}

export const ProfileCompletionStep: React.FC<ProfileCompletionStepProps> = ({ 
  onComplete, 
  onSkip,
  loading = false,
  initialData = {}
}) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    company_name: initialData.company_name || '',
    industry: initialData.industry || '',
    company_size: initialData.company_size || '',
    company_overview: initialData.company_overview || '',
    core_offerings: initialData.core_offerings || '',
    technical_products: initialData.technical_products || '',
    business_focus: initialData.business_focus || '',
    product_descriptions: initialData.product_descriptions || '',
    contact_email: initialData.contact_email || '',
    contact_phone: initialData.contact_phone || '',
    contact_address: initialData.contact_address || '',
    team_members: initialData.team_members || [''],
    social_media: {
      website: initialData.social_media?.website || '',
      linkedin: initialData.social_media?.linkedin || '',
      twitter: initialData.social_media?.twitter || '',
      instagram: initialData.social_media?.instagram || '',
      facebook: initialData.social_media?.facebook || ''
    }
  });

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

  const updateField = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateSocialMedia = (platform: keyof ProfileData['social_media'], value: string) => {
    setProfileData(prev => ({
      ...prev,
      social_media: { ...prev.social_media, [platform]: value }
    }));
  };

  const addTeamMember = () => {
    setProfileData(prev => ({
      ...prev,
      team_members: [...prev.team_members, '']
    }));
  };

  const updateTeamMember = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      team_members: prev.team_members.map((member, i) => i === index ? value : member)
    }));
  };

  const removeTeamMember = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      team_members: prev.team_members.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const cleanedData = {
      ...profileData,
      team_members: profileData.team_members.filter(member => member.trim().length > 0)
    };
    onComplete(cleanedData);
  };

  const isBasicInfoComplete = profileData.company_name && profileData.industry && profileData.company_size;

  return (
    <Card className="bg-gray-800/95 border-gray-600/50 shadow-xl max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-center justify-center">
          <Building className="w-6 h-6 text-blue-400" />
          إكمال ملفك التجاري
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700/50">
            <TabsTrigger value="basic" className="text-white data-[state=active]:bg-blue-600">
              المعلومات الأساسية
            </TabsTrigger>
            <TabsTrigger value="business" className="text-white data-[state=active]:bg-blue-600">
              الأعمال والخدمات
            </TabsTrigger>
            <TabsTrigger value="team" className="text-white data-[state=active]:bg-blue-600">
              الفريق
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-white data-[state=active]:bg-blue-600">
              التواصل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
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
          </TabsContent>

          <TabsContent value="business" className="space-y-6 mt-6">
            <div>
              <Label className="text-white mb-2 block">العروض والحلول الأساسية</Label>
              <Textarea
                value={profileData.core_offerings}
                onChange={(e) => updateField('core_offerings', e.target.value)}
                placeholder="المنتجات أو الخدمات الأساسية التي تقدمها شركتك..."
                className="bg-gray-700/80 border-gray-600/50 text-white min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">المنتجات التقنية</Label>
              <Textarea
                value={profileData.technical_products}
                onChange={(e) => updateField('technical_products', e.target.value)}
                placeholder="التقنيات وواجهات البرمجة والحلول التقنية المستخدمة..."
                className="bg-gray-700/80 border-gray-600/50 text-white min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">التركيز التجاري</Label>
              <Textarea
                value={profileData.business_focus}
                onChange={(e) => updateField('business_focus', e.target.value)}
                placeholder="أهدافك التجارية وتأثيرك في السوق..."
                className="bg-gray-700/80 border-gray-600/50 text-white min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">وصف المنتجات والخدمات</Label>
              <Textarea
                value={profileData.product_descriptions}
                onChange={(e) => updateField('product_descriptions', e.target.value)}
                placeholder="تفاصيل ما تقدمه للعملاء وقيمته المضافة..."
                className="bg-gray-700/80 border-gray-600/50 text-white min-h-[100px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6 mt-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-white">أعضاء الفريق الرئيسيون</Label>
                <Button
                  onClick={addTeamMember}
                  variant="outline"
                  size="sm"
                  className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة عضو
                </Button>
              </div>
              
              <div className="space-y-3">
                {profileData.team_members.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={member}
                      onChange={(e) => updateTeamMember(index, e.target.value)}
                      placeholder="اسم ومنصب عضو الفريق..."
                      className="bg-gray-700/80 border-gray-600/50 text-white flex-1"
                    />
                    {profileData.team_members.length > 1 && (
                      <Button
                        onClick={() => removeTeamMember(index)}
                        variant="outline"
                        size="sm"
                        className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={profileData.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  placeholder="email@company.com"
                  className="bg-gray-700/80 border-gray-600/50 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white mb-2 block">رقم الهاتف</Label>
                <Input
                  value={profileData.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="bg-gray-700/80 border-gray-600/50 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">العنوان</Label>
              <Input
                value={profileData.contact_address}
                onChange={(e) => updateField('contact_address', e.target.value)}
                placeholder="العنوان الكامل للشركة..."
                className="bg-gray-700/80 border-gray-600/50 text-white"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-white block">حسابات التواصل الاجتماعي</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 mb-1 block text-sm">الموقع الإلكتروني</Label>
                  <Input
                    value={profileData.social_media.website}
                    onChange={(e) => updateSocialMedia('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="bg-gray-700/80 border-gray-600/50 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300 mb-1 block text-sm">لينكد إن</Label>
                  <Input
                    value={profileData.social_media.linkedin}
                    onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                    className="bg-gray-700/80 border-gray-600/50 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300 mb-1 block text-sm">تويتر</Label>
                  <Input
                    value={profileData.social_media.twitter}
                    onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="bg-gray-700/80 border-gray-600/50 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300 mb-1 block text-sm">إنستغرام</Label>
                  <Input
                    value={profileData.social_media.instagram}
                    onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="bg-gray-700/80 border-gray-600/50 text-white"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-600/50">
          <Button
            onClick={onSkip}
            variant="outline"
            className="bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
          >
            تخطي هذه الخطوة
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={loading || !isBasicInfoComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-60"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ البيانات والمتابعة'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
