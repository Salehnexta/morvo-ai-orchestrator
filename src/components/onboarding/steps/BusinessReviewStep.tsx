
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit3, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BusinessReviewStepProps {
  analysisData: any;
  websiteUrl: string;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export const BusinessReviewStep: React.FC<BusinessReviewStepProps> = ({
  analysisData,
  websiteUrl,
  onComplete,
  onBack
}) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    company_name: '',
    business_description: '',
    industry: '',
    company_size: '',
    services: [] as string[],
    target_audience: '',
    marketing_budget: '',
    website_url: websiteUrl
  });

  const [newService, setNewService] = useState('');

  const content = {
    ar: {
      title: 'مراجعة معلومات عملك',
      subtitle: 'يرجى تأكيد أو تعديل المعلومات التي وجدناها',
      foundFromWebsite: 'تم العثور عليها من الموقع',
      companyName: 'اسم الشركة',
      businessDescription: 'وصف العمل',
      industry: 'القطاع',
      companySize: 'حجم الشركة',
      services: 'المنتجات/الخدمات',
      targetAudience: 'الجمهور المستهدف',
      marketingBudget: 'الميزانية التسويقية الشهرية',
      addService: 'إضافة خدمة',
      add: 'إضافة',
      confirmContinue: 'تأكيد والمتابعة',
      back: 'العودة',
      required: 'مطلوب',
      pleaseConfirm: 'يرجى تأكيد',
      addOrRemove: 'أضف أو احذف حسب الحاجة',
      companySizes: {
        '1-10': '1-10 موظفين',
        '11-50': '11-50 موظف',
        '51-200': '51-200 موظف',
        '200+': 'أكثر من 200 موظف'
      },
      budgetRanges: {
        'less_1000': 'أقل من 1,000 ريال',
        '1000_5000': '1,000 - 5,000 ريال',
        '5000_15000': '5,000 - 15,000 ريال',
        '15000_50000': '15,000 - 50,000 ريال',
        'more_50000': 'أكثر من 50,000 ريال'
      }
    },
    en: {
      title: 'Review Your Business Information',
      subtitle: 'Please confirm or edit the information we found',
      foundFromWebsite: 'Found from website',
      companyName: 'Company Name',
      businessDescription: 'Business Description',
      industry: 'Industry',
      companySize: 'Company Size',
      services: 'Products/Services',
      targetAudience: 'Target Audience',
      marketingBudget: 'Monthly Marketing Budget',
      addService: 'Add Service',
      add: 'Add',
      confirmContinue: 'Confirm & Continue',
      back: 'Back',
      required: 'Required',
      pleaseConfirm: 'Please confirm',
      addOrRemove: 'Add or remove as needed',
      companySizes: {
        '1-10': '1-10 employees',
        '11-50': '11-50 employees',
        '51-200': '51-200 employees',
        '200+': '200+ employees'
      },
      budgetRanges: {
        'less_1000': 'Less than 1,000 SAR',
        '1000_5000': '1,000 - 5,000 SAR',
        '5000_15000': '5,000 - 15,000 SAR',
        '15000_50000': '15,000 - 50,000 SAR',
        'more_50000': 'More than 50,000 SAR'
      }
    }
  };

  const t = content[language];

  useEffect(() => {
    // Pre-fill form with analysis results
    if (analysisData) {
      setFormData(prev => ({
        ...prev,
        company_name: analysisData.company_name || '',
        business_description: analysisData.business_description || '',
        industry: analysisData.industry || '',
        services: analysisData.services || [],
        target_audience: analysisData.target_audience || ''
      }));
    }
  }, [analysisData]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const isFormValid = formData.company_name && formData.company_size && formData.marketing_budget;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <Badge variant="outline">{websiteUrl}</Badge>
          </div>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <p className="text-gray-600">{t.subtitle}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Company Name */}
          <div>
            <Label htmlFor="company-name">
              {t.companyName} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company-name"
              value={formData.company_name}
              onChange={(e) => updateField('company_name', e.target.value)}
              className="mt-1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">{t.pleaseConfirm}</p>
          </div>

          {/* Business Description */}
          <div>
            <Label htmlFor="business-description">{t.businessDescription}</Label>
            <Textarea
              id="business-description"
              value={formData.business_description}
              onChange={(e) => updateField('business_description', e.target.value)}
              className="mt-1"
              rows={3}
            />
            {analysisData?.business_description && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {t.foundFromWebsite}
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <Label htmlFor="industry">{t.industry}</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => updateField('industry', e.target.value)}
              className="mt-1"
            />
            {analysisData?.industry && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {t.foundFromWebsite}
              </p>
            )}
          </div>

          {/* Company Size */}
          <div>
            <Label>{t.companySize} <span className="text-red-500">*</span></Label>
            <Select onValueChange={(value) => updateField('company_size', value)} value={formData.company_size}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t.required} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.companySizes).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services */}
          <div>
            <Label>{t.services}</Label>
            <div className="mt-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeService(service)}
                  >
                    {service} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t.addService}
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addService()}
                />
                <Button onClick={addService} variant="outline" size="sm">
                  {t.add}
                </Button>
              </div>
            </div>
            {analysisData?.services?.length > 0 && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {t.addOrRemove}
              </p>
            )}
          </div>

          {/* Target Audience */}
          <div>
            <Label htmlFor="target-audience">{t.targetAudience}</Label>
            <Textarea
              id="target-audience"
              value={formData.target_audience}
              onChange={(e) => updateField('target_audience', e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Marketing Budget */}
          <div>
            <Label>{t.marketingBudget} <span className="text-red-500">*</span></Label>
            <Select onValueChange={(value) => updateField('marketing_budget', value)} value={formData.marketing_budget}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t.required} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.budgetRanges).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {t.confirmContinue}
            </Button>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              {t.back}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
