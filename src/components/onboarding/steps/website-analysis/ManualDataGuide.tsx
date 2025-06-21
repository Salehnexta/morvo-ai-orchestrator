
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Building2, Users, Settings, Target, Globe, Mail, Share2 } from 'lucide-react';

interface ManualDataGuideProps {
  onContinue: () => void;
  language: 'ar' | 'en';
}

export const ManualDataGuide: React.FC<ManualDataGuideProps> = ({
  onContinue,
  language
}) => {
  const content = {
    ar: {
      title: 'البيانات المطلوبة لملف شركتك',
      subtitle: 'ستحتاج لإدخال هذه المعلومات في الخطوة التالية',
      continue: 'المتابعة لإدخال البيانات',
      dataFields: [
        { icon: <Building2 className="w-4 h-4" />, label: 'نظرة عامة على الشركة', desc: 'وصف مختصر عن شركتك ونشاطها' },
        { icon: <Target className="w-4 h-4" />, label: 'العروض والحلول الأساسية', desc: 'المنتجات أو الخدمات التي تقدمها' },
        { icon: <Settings className="w-4 h-4" />, label: 'المنتجات التقنية', desc: 'التقنيات وواجهات البرمجة المستخدمة' },
        { icon: <Users className="w-4 h-4" />, label: 'أعضاء الفريق الرئيسيون', desc: 'القيادات والخبراء في فريقك' },
        { icon: <Target className="w-4 h-4" />, label: 'التركيز التجاري', desc: 'أهدافك وتأثيرك في السوق' },
        { icon: <FileText className="w-4 h-4" />, label: 'وصف المنتجات والخدمات', desc: 'تفاصيل ما تقدمه للعملاء' },
        { icon: <Mail className="w-4 h-4" />, label: 'معلومات الاتصال', desc: 'طرق التواصل مع شركتك' },
        { icon: <Share2 className="w-4 h-4" />, label: 'حسابات التواصل الاجتماعي', desc: 'منصات التواصل التي تستخدمها' }
      ]
    },
    en: {
      title: 'Required Data for Your Company Profile',
      subtitle: 'You will need to enter this information in the next step',
      continue: 'Continue to Enter Data',
      dataFields: [
        { icon: <Building2 className="w-4 h-4" />, label: 'Company Overview', desc: 'Brief description of your company and activities' },
        { icon: <Target className="w-4 h-4" />, label: 'Core Offerings and Solutions', desc: 'Products or services you provide' },
        { icon: <Settings className="w-4 h-4" />, label: 'Technical Products', desc: 'Technologies and APIs you use' },
        { icon: <Users className="w-4 h-4" />, label: 'Key Team Members', desc: 'Leadership and experts in your team' },
        { icon: <Target className="w-4 h-4" />, label: 'Business Focus', desc: 'Your goals and market impact' },
        { icon: <FileText className="w-4 h-4" />, label: 'Product/Service Descriptions', desc: 'Details of what you offer to customers' },
        { icon: <Mail className="w-4 h-4" />, label: 'Contact Information', desc: 'Ways to reach your company' },
        { icon: <Share2 className="w-4 h-4" />, label: 'Social Media Accounts', desc: 'Social platforms you use' }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.dataFields.map((field, index) => (
          <Card key={index} className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {field.icon}
                {field.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">{field.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={onContinue}
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        <FileText className="w-4 h-4 mr-2" />
        {t.continue}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
