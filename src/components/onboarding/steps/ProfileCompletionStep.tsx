
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInfoTab } from './profile-completion/BasicInfoTab';
import { BusinessDetailsTab } from './profile-completion/BusinessDetailsTab';
import { TeamMembersTab } from './profile-completion/TeamMembersTab';
import { ContactInfoTab } from './profile-completion/ContactInfoTab';

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

          <TabsContent value="basic">
            <BasicInfoTab 
              profileData={profileData}
              updateField={updateField}
            />
          </TabsContent>

          <TabsContent value="business">
            <BusinessDetailsTab 
              profileData={profileData}
              updateField={updateField}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembersTab 
              teamMembers={profileData.team_members}
              addTeamMember={addTeamMember}
              updateTeamMember={updateTeamMember}
              removeTeamMember={removeTeamMember}
            />
          </TabsContent>

          <TabsContent value="contact">
            <ContactInfoTab 
              profileData={profileData}
              updateField={updateField}
              updateSocialMedia={updateSocialMedia}
            />
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
