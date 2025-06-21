
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Settings, Target, FileText, Globe, Mail, Share2 } from 'lucide-react';

interface AnalysisResultsDisplayProps {
  results: any;
  language: 'ar' | 'en';
}

const AnalysisDataStructure = {
  company_overview: 'Company Overview',
  core_offerings: 'Core Offerings and Solutions', 
  technical_products: 'Technical Products and APIs',
  key_team_members: 'Key Team Members',
  business_focus: 'Business Focus and Impact',
  additional_insights: 'Additional Insights',
  product_descriptions: 'Product/Service Descriptions',
  api_documentation: 'API Documentation Details',
  use_cases: 'Use Cases and Case Studies',
  blog_updates: 'Blog/News Updates',
  contact_information: 'Contact Information',
  team_bios: 'Team Bios',
  social_media: 'Social Media Accounts'
};

export const AnalysisResultsDisplay: React.FC<AnalysisResultsDisplayProps> = ({
  results,
  language
}) => {
  const content = {
    ar: {
      title: 'البيانات المستخرجة من الموقع',
      subtitle: 'المعلومات التي تم جمعها لتوفير الوقت عليك',
      dataStructure: {
        company_overview: 'نظرة عامة على الشركة',
        core_offerings: 'العروض والحلول الأساسية',
        technical_products: 'المنتجات التقنية وواجهات البرمجة',
        key_team_members: 'أعضاء الفريق الرئيسيون',
        business_focus: 'التركيز التجاري والتأثير',
        additional_insights: 'رؤى إضافية',
        product_descriptions: 'أوصاف المنتجات/الخدمات',
        api_documentation: 'تفاصيل توثيق واجهات البرمجة',
        use_cases: 'حالات الاستخدام ودراسات الحالة',
        blog_updates: 'تحديثات المدونة/الأخبار',
        contact_information: 'معلومات الاتصال',
        team_bios: 'السير الذاتية للفريق',
        social_media: 'حسابات وسائل التواصل الاجتماعي'
      },
      noData: 'لم يتم العثور على بيانات',
      found: 'تم العثور عليها',
      notFound: 'لم يتم العثور عليها'
    },
    en: {
      title: 'Data Extracted from Website',
      subtitle: 'Information gathered to save you time',
      dataStructure: AnalysisDataStructure,
      noData: 'No data found',
      found: 'Found',
      notFound: 'Not found'
    }
  };

  const t = content[language];

  const getIcon = (key: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      company_overview: <Building2 className="w-4 h-4" />,
      core_offerings: <Target className="w-4 h-4" />,
      technical_products: <Settings className="w-4 h-4" />,
      key_team_members: <Users className="w-4 h-4" />,
      business_focus: <Target className="w-4 h-4" />,
      additional_insights: <FileText className="w-4 h-4" />,
      product_descriptions: <FileText className="w-4 h-4" />,
      api_documentation: <Settings className="w-4 h-4" />,
      use_cases: <FileText className="w-4 h-4" />,
      blog_updates: <Globe className="w-4 h-4" />,
      contact_information: <Mail className="w-4 h-4" />,
      team_bios: <Users className="w-4 h-4" />,
      social_media: <Share2 className="w-4 h-4" />
    };
    return iconMap[key] || <FileText className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
        <p className="text-gray-600 text-sm">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(t.dataStructure).map(([key, label]) => {
          const hasData = results && results[key] && results[key].trim();
          
          return (
            <Card key={key} className={`${hasData ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getIcon(key)}
                  {label}
                  <Badge variant={hasData ? "default" : "secondary"} className="ml-auto text-xs">
                    {hasData ? t.found : t.notFound}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {hasData ? (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {typeof results[key] === 'string' 
                      ? results[key] 
                      : Array.isArray(results[key]) 
                        ? results[key].join(', ') 
                        : JSON.stringify(results[key])
                    }
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 italic">{t.noData}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
