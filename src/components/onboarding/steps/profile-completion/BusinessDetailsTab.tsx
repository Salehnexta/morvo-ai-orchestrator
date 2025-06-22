
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BusinessDetailsTabProps {
  profileData: {
    core_offerings: string;
    technical_products: string;
    business_focus: string;
    product_descriptions: string;
  };
  updateField: (field: string, value: string) => void;
}

export const BusinessDetailsTab: React.FC<BusinessDetailsTabProps> = ({ profileData, updateField }) => {
  return (
    <div className="space-y-6 mt-6">
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
    </div>
  );
};
