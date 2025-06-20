import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { UserProfileService, UserProfile } from "@/services/userProfileService";
import { useAuth } from "@/contexts/AuthContext";
import { CompetitorAnalysisService } from "@/services/competitorAnalysisService";

export default function ProfileSetup() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    company_name: '',
    industry: '',
    company_size: '',
    marketing_experience: '',
    current_marketing_tools: [],
    primary_marketing_goals: [],
    target_audience: {},
    marketing_budget: '',
    main_competitors: [],
    competitive_advantages: [],
    preferred_language: language
  });

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  const content = {
    ar: {
      title: "إعداد الملف الشخصي",
      subtitle: "ساعدنا في فهم احتياجاتك التسويقية لتقديم أفضل خدمة مخصصة",
      next: "التالي",
      previous: "السابق",
      finish: "إنهاء",
      save: "حفظ",
      required: "مطلوب",
      step: "الخطوة",
      of: "من",
      steps: {
        1: { title: "اسم الشركة", description: "ما هو اسم شركتك أو مشروعك؟", placeholder: "أدخل اسم الشركة" },
        2: { title: "القطاع", description: "في أي قطاع تعمل شركتك؟", options: [
          { value: "technology", label: "التقنية والبرمجيات" },
          { value: "retail", label: "التجارة والبيع بالتجزئة" },
          { value: "healthcare", label: "الرعاية الصحية" },
          { value: "education", label: "التعليم" },
          { value: "finance", label: "المالية والمصرفية" },
          { value: "real_estate", label: "العقارات" },
          { value: "food", label: "المأكولات والمشروبات" },
          { value: "manufacturing", label: "التصنيع" },
          { value: "services", label: "الخدمات المهنية" },
          { value: "other", label: "أخرى" }
        ]},
        3: { title: "حجم الشركة", description: "كم عدد الموظفين في شركتك؟", options: [
          { value: "1-10", label: "1-10 موظفين" },
          { value: "11-50", label: "11-50 موظف" },
          { value: "51-200", label: "51-200 موظف" },
          { value: "201-500", label: "201-500 موظف" },
          { value: "500+", label: "أكثر من 500 موظف" }
        ]},
        4: {
          title: "مستوى الخبرة التسويقية",
          description: "ما هو مستوى خبرتك في التسويق الرقمي؟",
          options: [
            { value: "beginner", label: "مبتدئ - لدي معرفة قليلة أو لا توجد" },
            { value: "intermediate", label: "متوسط - لدي بعض الخبرة" },
            { value: "advanced", label: "متقدم - لدي خبرة جيدة" },
            { value: "expert", label: "خبير - لدي خبرة واسعة" }
          ]
        } as any,
        5: {
          title: "الأنشطة التسويقية الحالية",
          description: "ما هي الأنشطة التسويقية التي تقوم بها حالياً؟ (يمكن اختيار أكثر من واحد)",
          options: [
            { value: "social_media", label: "وسائل التواصل الاجتماعي" },
            { value: "paid_ads", label: "الإعلانات المدفوعة" },
            { value: "email_marketing", label: "التسويق عبر البريد الإلكتروني" },
            { value: "seo", label: "تحسين محركات البحث" },
            { value: "content_marketing", label: "تسويق المحتوى" },
            { value: "influencer_marketing", label: "التسويق عبر المؤثرين" },
            { value: "events", label: "الفعاليات والمعارض" },
            { value: "none", label: "لا أقوم بأي أنشطة حالياً" }
          ]
        } as any,
        6: {
          title: "الأهداف التسويقية",
          description: "ما هي أهدافك الرئيسية من التسويق؟ (يمكن اختيار أكثر من واحد)",
          options: [
            { value: "increase_sales", label: "زيادة المبيعات" },
            { value: "brand_awareness", label: "زيادة الوعي بالعلامة التجارية" },
            { value: "lead_generation", label: "جذب عملاء محتملين" },
            { value: "customer_retention", label: "الاحتفاظ بالعملاء" },
            { value: "market_expansion", label: "التوسع في السوق" },
            { value: "cost_optimization", label: "تحسين تكلفة التسويق" },
            { value: "digital_transformation", label: "التحول الرقمي" }
          ]
        } as any,
        7: {
          title: "الجمهور المستهدف",
          description: "من هو جمهورك المستهدف؟",
          placeholder: "مثال: الشباب من سن 18-35، أصحاب الأعمال، ربات البيوت..."
        } as any,
        8: {
          title: "الميزانية الشهرية",
          description: "ما هي ميزانيتك الشهرية للتسويق الرقمي؟",
          options: [
            { value: "less_than_1000", label: "أقل من 1,000 ريال" },
            { value: "1000_5000", label: "1,000 - 5,000 ريال" },
            { value: "5000_15000", label: "5,000 - 15,000 ريال" },
            { value: "15000_50000", label: "15,000 - 50,000 ريال" },
            { value: "more_than_50000", label: "أكثر من 50,000 ريال" }
          ]
        } as any,
        9: {
          title: "المنافسون الرئيسيون",
          description: "من هم منافسوك الرئيسيون في السوق؟",
          placeholder: "اذكر أسماء الشركات أو العلامات التجارية المنافسة..."
        } as any,
        10: {
          title: "اللغة المفضلة",
          description: "ما هي لغة التفاعل المفضلة لك؟",
          options: [
            { value: "ar", label: "العربية" },
            { value: "en", label: "English" }
          ]
        } as any
      }
    },
    en: {
      title: "Profile Setup",
      subtitle: "Help us understand your marketing needs to provide the best personalized service",
      next: "Next",
      previous: "Previous", 
      finish: "Finish",
      save: "Save",
      required: "Required",
      step: "Step",
      of: "of",
      steps: {
        1: {
          title: "Company Name",
          description: "What is your company or project name?",
          placeholder: "Enter company name"
        } as any,
        2: {
          title: "Industry",
          description: "What industry does your company operate in?",
          options: [
            { value: "technology", label: "Technology & Software" },
            { value: "retail", label: "Retail & E-commerce" },
            { value: "healthcare", label: "Healthcare" },
            { value: "education", label: "Education" },
            { value: "finance", label: "Finance & Banking" },
            { value: "real_estate", label: "Real Estate" },
            { value: "food", label: "Food & Beverage" },
            { value: "manufacturing", label: "Manufacturing" },
            { value: "services", label: "Professional Services" },
            { value: "other", label: "Other" }
          ]
        } as any,
        3: {
          title: "Company Size",
          description: "How many employees does your company have?",
          options: [
            { value: "1-10", label: "1-10 employees" },
            { value: "11-50", label: "11-50 employees" },
            { value: "51-200", label: "51-200 employees" },
            { value: "201-500", label: "201-500 employees" },
            { value: "500+", label: "500+ employees" }
          ]
        } as any,
        4: {
          title: "Marketing Experience Level",
          description: "What is your level of experience in digital marketing?",
          options: [
            { value: "beginner", label: "Beginner - Little to no experience" },
            { value: "intermediate", label: "Intermediate - Some experience" },
            { value: "advanced", label: "Advanced - Good experience" },
            { value: "expert", label: "Expert - Extensive experience" }
          ]
        } as any,
        5: {
          title: "Current Marketing Activities",
          description: "What marketing activities are you currently doing? (Select multiple)",
          options: [
            { value: "social_media", label: "Social Media" },
            { value: "paid_ads", label: "Paid Advertising" },
            { value: "email_marketing", label: "Email Marketing" },
            { value: "seo", label: "Search Engine Optimization" },
            { value: "content_marketing", label: "Content Marketing" },
            { value: "influencer_marketing", label: "Influencer Marketing" },
            { value: "events", label: "Events & Trade Shows" },
            { value: "none", label: "None currently" }
          ]
        } as any,
        6: {
          title: "Marketing Goals",
          description: "What are your main marketing objectives? (Select multiple)",
          options: [
            { value: "increase_sales", label: "Increase Sales" },
            { value: "brand_awareness", label: "Brand Awareness" },
            { value: "lead_generation", label: "Lead Generation" },
            { value: "customer_retention", label: "Customer Retention" },
            { value: "market_expansion", label: "Market Expansion" },
            { value: "cost_optimization", label: "Cost Optimization" },
            { value: "digital_transformation", label: "Digital Transformation" }
          ]
        } as any,
        7: {
          title: "Target Audience",
          description: "Who is your target audience?",
          placeholder: "Example: Young adults 18-35, business owners, homemakers..."
        } as any,
        8: {
          title: "Monthly Budget",
          description: "What is your monthly budget for digital marketing?",
          options: [
            { value: "less_than_1000", label: "Less than 1,000 SAR" },
            { value: "1000_5000", label: "1,000 - 5,000 SAR" },
            { value: "5000_15000", label: "5,000 - 15,000 SAR" },
            { value: "15000_50000", label: "15,000 - 50,000 SAR" },
            { value: "more_than_50000", label: "More than 50,000 SAR" }
          ]
        } as any,
        9: {
          title: "Main Competitors",
          description: "Who are your main competitors in the market?",
          placeholder: "List company names or competitor brands..."
        } as any,
        10: {
          title: "Preferred Language",
          description: "What is your preferred interaction language?",
          options: [
            { value: "ar", label: "Arabic" },
            { value: "en", label: "English" }
          ]
        } as any
      }
    }
  };

  const t = content[language];

  useEffect(() => {
    checkExistingProfile();
  }, [user]);

  const checkExistingProfile = async () => {
    if (!user?.id) return;

    try {
      const profile = await UserProfileService.getUserProfile(user.id);
      if (profile) {
        setProfileData({
          company_name: profile.company_name || '',
          industry: profile.industry || '',
          company_size: profile.company_size || '',
          marketing_experience: profile.marketing_experience || '',
          current_marketing_tools: profile.current_marketing_tools || [],
          primary_marketing_goals: profile.primary_marketing_goals || [],
          target_audience: profile.target_audience || {},
          marketing_budget: profile.marketing_budget || '',
          main_competitors: profile.main_competitors || [],
          preferred_language: profile.preferred_language || language
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (field: keyof UserProfile, value: string) => {
    const currentValues = profileData[field] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleInputChange(field, newValues);
  };

  const handleFinish = async () => {
    if (!user?.id) {
      navigate('/auth/login');
      return;
    }

    setIsLoading(true);
    try {
      const success = await UserProfileService.saveUserProfile(user.id, {
        ...profileData,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });

      if (success) {
        // Update completeness score
        await UserProfileService.updateCompletenessScore(user.id);
        
        // Save basic competitor information if provided
        if (profileData.main_competitors && profileData.main_competitors.length > 0) {
          await CompetitorAnalysisService.saveBasicCompetitors(user.id, profileData.main_competitors);
        }
        
        toast({
          title: language === 'ar' ? "تم الحفظ بنجاح!" : "Profile Saved Successfully!",
          description: language === 'ar' 
            ? "تم حفظ معلومات الملف الشخصي بنجاح. سيتم تحسين تحليل المنافسين قريباً."
            : "Profile information saved successfully. Competitor analysis will be enhanced soon.",
        });

        navigate('/dashboard');
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' 
          ? "حدث خطأ أثناء حفظ المعلومات"
          : "An error occurred while saving the information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasPlaceholder = (step: any): step is { placeholder: string } => {
    return 'placeholder' in step;
  };

  const hasOptions = (step: any): step is { options: Array<{ value: string; label: string }> } => {
    return 'options' in step;
  };

  const renderStepContent = () => {
    const stepData = t.steps[currentStep as keyof typeof t.steps];
    
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="company_name">{stepData.title} *</Label>
            <Input
              id="company_name"
              value={profileData.company_name || ''}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              placeholder={hasPlaceholder(stepData) ? stepData.placeholder : ''}
              className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
        );
      
      case 2:
      case 3:
      case 4:
      case 8:
      case 10:
        const fieldMap = {
          2: 'industry',
          3: 'company_size', 
          4: 'marketing_experience',
          8: 'marketing_budget',
          10: 'preferred_language'
        };
        const field = fieldMap[currentStep as keyof typeof fieldMap] as keyof UserProfile;
        
        return (
          <div className="space-y-4">
            <Label>{stepData.title} *</Label>
            <Select onValueChange={(value) => handleInputChange(field, value)} value={profileData[field] as string || ''}>
              <SelectTrigger className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                <SelectValue placeholder="اختر..." />
              </SelectTrigger>
              <SelectContent>
                {hasOptions(stepData) && stepData.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 5:
      case 6:
        const multiField = currentStep === 5 ? 'current_marketing_tools' : 'primary_marketing_goals';
        const currentValues = profileData[multiField] as string[];
        
        return (
          <div className="space-y-4">
            <Label>{stepData.title} *</Label>
            <div className="grid grid-cols-1 gap-3">
              {hasOptions(stepData) && stepData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={currentValues?.includes(option.value) || false}
                    onChange={() => handleMultiSelectChange(multiField, option.value)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={option.value} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 7:
        return (
          <div className="space-y-4">
            <Label htmlFor="target_audience">{stepData.title} *</Label>
            <Textarea
              id="target_audience"
              value={profileData.target_audience as string || ''}
              onChange={(e) => handleInputChange('target_audience', e.target.value)}
              placeholder={hasPlaceholder(stepData) ? stepData.placeholder : ''}
              rows={4}
              className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <Label htmlFor="main_competitors">{stepData.title}</Label>
            <Textarea
              id="main_competitors"
              value={profileData.main_competitors?.join(', ') || ''}
              onChange={(e) => {
                const competitors = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                handleInputChange('main_competitors', competitors);
              }}
              placeholder={hasPlaceholder(stepData) ? stepData.placeholder : ''}
              rows={3}
              className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
            />
            <p className="text-sm text-gray-500">
              {language === 'ar' ? 'افصل بين الأسماء بفاصلة' : 'Separate names with commas'}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              {t.title}
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.subtitle}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.step} {currentStep} {t.of} {totalSteps}
              </span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} mb-8`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.steps[currentStep as keyof typeof t.steps].title}
              </CardTitle>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.steps[currentStep as keyof typeof t.steps].description}
              </p>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className={`${isRTL ? 'ml-auto' : ''}`}
            >
              {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
              {t.previous}
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleFinish}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {t.finish}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {t.next}
                {isRTL ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
