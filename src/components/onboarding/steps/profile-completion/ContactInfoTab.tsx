
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactInfoTabProps {
  profileData: {
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    social_media: {
      website: string;
      linkedin: string;
      twitter: string;
      instagram: string;
      facebook: string;
    };
  };
  updateField: (field: string, value: string) => void;
  updateSocialMedia: (platform: string, value: string) => void;
}

export const ContactInfoTab: React.FC<ContactInfoTabProps> = ({
  profileData,
  updateField,
  updateSocialMedia
}) => {
  return (
    <div className="space-y-6 mt-6">
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
    </div>
  );
};
