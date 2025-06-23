import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService, UserProfile } from '@/services/userProfileService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Building, Target, Users, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const FirstTimeSetup: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  // const [completeness, setCompleteness] = useState(0);

  const [profile, setProfile] = useState<Partial<UserProfile>>({
    full_name: user?.user_metadata?.full_name || '',
    company_name: '',
    industry: '',
    website_url: '',
    business_type: '',
    company_size: '',
    company_overview: '',
    target_market: '',
    marketing_experience: '',
    primary_marketing_goals: [],
    monthly_marketing_budget: '',
    current_monthly_revenue: '',
    revenue_target: '',
    biggest_marketing_challenge: '',
    unique_selling_points: [],
    contact_info: {
      email: user?.email || '',
      phone: '',
      address: '',
      social_media: {
        twitter: '',
        linkedin: '',
        instagram: '',
      },
    },
    key_team_members: [],
    preferred_language: 'ar',
    greeting_preference: 'أستاذ',
  });
  const completeness = useMemo(() => {
    const requiredFields = [
      'full_name',
      'company_name',
      'industry',
      'company_size',
      'company_overview',
      'marketing_experience',
      'monthly_marketing_budget',
    ];

    const completed = requiredFields.filter((field) => {
      const value = profile[field as keyof UserProfile];
      return value && value !== '';
    }).length;

    return Math.round((completed / requiredFields.length) * 100);
  }, [profile]);
  // useEffect(() => {
  //   if (user) {
  //     loadExistingProfile();
  //   }
  //   calculateCompleteness();
  // }, [profile, user]);
  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]); // اعتماد فقط على user

  useEffect(() => {
    calculateCompleteness();
  }, [profile]); // اعتماد فقط على profile
  const loadExistingProfile = async () => {
    if (!user) return;

    try {
      console.log('📋 Loading existing profile for user:', user.id);
      const existingProfile = await UserProfileService.getUserProfile(user.id);

      if (existingProfile) {
        console.log(
          '📋 Found existing profile, pre-filling form:',
          existingProfile
        );
        setProfile((prev) => ({
          ...prev,
          ...existingProfile,
          // Ensure contact_info structure is maintained
          contact_info: {
            email: user?.email || '',
            phone: '',
            address: '',
            social_media: {
              twitter: '',
              linkedin: '',
              instagram: '',
            },
            ...existingProfile.contact_info,
          },
        }));
      }
    } catch (error) {
      console.error('📋 Error loading existing profile:', error);
    }
  };

  // const calculateCompleteness = () => {
  //   const requiredFields = [
  //     'full_name',
  //     'company_name',
  //     'industry',
  //     'company_size',
  //     'company_overview',
  //     'marketing_experience',
  //     'monthly_marketing_budget',
  //   ];

  //   const completed = requiredFields.filter((field) => {
  //     const value = profile[field as keyof UserProfile];
  //     return value && value !== '';
  //   }).length;

  //   const percentage = Math.round((completed / requiredFields.length) * 100);
  //   setCompleteness(percentage);
  // };
  const calculateCompleteness = () => {
    const requiredFields = [
      'full_name',
      'company_name',
      'industry',
      'company_size',
      'company_overview',
      'marketing_experience',
      'monthly_marketing_budget',
    ];

    const completed = requiredFields.filter((field) => {
      const value = profile[field as keyof UserProfile];
      return value && value !== '';
    }).length;

    const percentage = Math.round((completed / requiredFields.length) * 100);

    // تحديث الحالة فقط إذا اختلفت النسبة
    // if (percentage !== completeness) {
    //   setCompleteness(percentage);
    // }
  };
  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateContactInfo = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value,
      },
    }));
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        social_media: {
          ...prev.contact_info?.social_media,
          [platform]: value,
        },
      },
    }));
  };

  const handleArrayFieldChange = (
    field: 'primary_marketing_goals' | 'unique_selling_points',
    value: string,
    checked: boolean
  ) => {
    setProfile((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      }
    });
  };

  const addTeamMember = () => {
    const currentMembers = (profile.key_team_members as any[]) || [];
    setProfile((prev) => ({
      ...prev,
      key_team_members: [...currentMembers, { name: '', role: '' }],
    }));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const currentMembers = [...((profile.key_team_members as any[]) || [])];
    currentMembers[index] = { ...currentMembers[index], [field]: value };
    setProfile((prev) => ({ ...prev, key_team_members: currentMembers }));
  };

  const removeTeamMember = (index: number) => {
    const currentMembers = (profile.key_team_members as any[]) || [];
    setProfile((prev) => ({
      ...prev,
      key_team_members: currentMembers.filter((_, i) => i !== index),
    }));
  };

  const handleComplete = async () => {
    if (!user) {
      console.error('❌ No user found for completion');
      return;
    }

    if (completeness < 70) {
      toast({
        title: 'معلومات ناقصة',
        description: 'يرجى إكمال المعلومات الأساسية قبل المتابعة',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      console.log('🎯 Completing first-time setup for user:', user.id);
      console.log('🎯 Final profile data:', profile);

      const profileData = {
        ...profile,
        first_time_setup_completed: true,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      };

      console.log('🎯 Saving final profile data:', profileData);
      const success = await UserProfileService.saveUserProfile(
        user.id,
        profileData
      );

      if (success) {
        // Update completeness score
        await UserProfileService.updateCompleteness(user.id);

        // Verify the data was saved
        const savedProfile = await UserProfileService.getUserProfile(user.id);
        console.log('✅ Verification - saved profile:', savedProfile);

        toast({
          title: 'مرحباً بك في مورفو! 🎉',
          description: 'تم حفظ معلوماتك بنجاح. سيتم توجيهك إلى لوحة التحكم',
        });

        // Small delay for better UX
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('❌ Error completing setup:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const nextTab = () => {
    const tabs = ['basic', 'business', 'marketing', 'contact'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            مرحباً بك في مورفو! 🚀
          </h1>
          <p className="text-blue-200 text-lg">
            دعنا نتعرف على عملك لنقدم لك أفضل استراتيجيات التسويق الرقمي
          </p>

          {/* Progress */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-200">إكمال المعلومات</span>
              <span className="text-sm font-medium text-white">
                {completeness}%
              </span>
            </div>
            <Progress value={completeness} className="h-3 bg-slate-700" />
          </div>
        </div>

        {/* Main Form */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 bg-slate-700/50 mb-8">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-blue-600 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  المعلومات الأساسية
                </TabsTrigger>
                <TabsTrigger
                  value="business"
                  className="data-[state=active]:bg-blue-600 text-white"
                >
                  <Building className="w-4 h-4 mr-2" />
                  تفاصيل العمل
                </TabsTrigger>
                <TabsTrigger
                  value="marketing"
                  className="data-[state=active]:bg-blue-600 text-white"
                >
                  <Target className="w-4 h-4 mr-2" />
                  التسويق والأهداف
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-blue-600 text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  التواصل والفريق
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name" className="text-white">
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="full_name"
                      value={profile.full_name || ''}
                      onChange={(e) =>
                        updateProfile('full_name', e.target.value)
                      }
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
                      onValueChange={(value) =>
                        updateProfile('greeting_preference', value)
                      }
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
                      onChange={(e) =>
                        updateProfile('company_name', e.target.value)
                      }
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
                      onValueChange={(value) =>
                        updateProfile('industry', value)
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="اختر مجال عملك" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">
                          التجارة الإلكترونية
                        </SelectItem>
                        <SelectItem value="healthcare">
                          الرعاية الصحية
                        </SelectItem>
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
                      onValueChange={(value) =>
                        updateProfile('company_size', value)
                      }
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
                      onChange={(e) =>
                        updateProfile('website_url', e.target.value)
                      }
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
                    onChange={(e) =>
                      updateProfile('company_overview', e.target.value)
                    }
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="اكتب نبذة مختصرة عن شركتك وما تقدمه من خدمات أو منتجات"
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* Business Details Tab */}
              <TabsContent value="business" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="business_type" className="text-white">
                      نوع النشاط
                    </Label>
                    <Select
                      value={profile.business_type}
                      onValueChange={(value) =>
                        updateProfile('business_type', value)
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="اختر نوع النشاط" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="b2b">B2B (شركات)</SelectItem>
                        <SelectItem value="b2c">B2C (مستهلكين)</SelectItem>
                        <SelectItem value="both">كلاهما</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target_market" className="text-white">
                      السوق المستهدف
                    </Label>
                    <Input
                      id="target_market"
                      value={profile.target_market || ''}
                      onChange={(e) =>
                        updateProfile('target_market', e.target.value)
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="مثال: السوق السعودي، دول الخليج"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="current_monthly_revenue"
                      className="text-white"
                    >
                      الإيرادات الشهرية الحالية
                    </Label>
                    <Select
                      value={profile.current_monthly_revenue}
                      onValueChange={(value) =>
                        updateProfile('current_monthly_revenue', value)
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="اختر نطاق إيراداتك" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less_than_5000">
                          أقل من 5,000 ريال
                        </SelectItem>
                        <SelectItem value="5000_25000">
                          5,000 - 25,000 ريال
                        </SelectItem>
                        <SelectItem value="25000_100000">
                          25,000 - 100,000 ريال
                        </SelectItem>
                        <SelectItem value="100000_500000">
                          100,000 - 500,000 ريال
                        </SelectItem>
                        <SelectItem value="more_than_500000">
                          أكثر من 500,000 ريال
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="revenue_target" className="text-white">
                      هدف الإيرادات
                    </Label>
                    <Input
                      id="revenue_target"
                      value={profile.revenue_target || ''}
                      onChange={(e) =>
                        updateProfile('revenue_target', e.target.value)
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="مثال: زيادة 50% خلال 6 أشهر"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">نقاط القوة التنافسية</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      'جودة المنتج العالية',
                      'خدمة عملاء ممتازة',
                      'أسعار تنافسية',
                      'سرعة التوصيل',
                      'خبرة طويلة في السوق',
                      'فريق متخصص',
                    ].map((point) => (
                      <div
                        key={point}
                        className="flex items-center space-x-2 space-x-reverse"
                      >
                        <Checkbox
                          id={point}
                          checked={
                            (
                              profile.unique_selling_points as string[]
                            )?.includes(point) || false
                          }
                          onCheckedChange={(checked) =>
                            handleArrayFieldChange(
                              'unique_selling_points',
                              point,
                              checked as boolean
                            )
                          }
                          className="border-slate-400"
                        />
                        <Label htmlFor={point} className="text-sm text-white">
                          {point}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Marketing & Goals Tab */}
              <TabsContent value="marketing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="marketing_experience"
                      className="text-white"
                    >
                      خبرتك في التسويق *
                    </Label>
                    <Select
                      value={profile.marketing_experience}
                      onValueChange={(value) =>
                        updateProfile('marketing_experience', value)
                      }
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
                    <Label
                      htmlFor="monthly_marketing_budget"
                      className="text-white"
                    >
                      الميزانية التسويقية الشهرية *
                    </Label>
                    <Select
                      value={profile.monthly_marketing_budget}
                      onValueChange={(value) =>
                        updateProfile('monthly_marketing_budget', value)
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="اختر ميزانيتك الشهرية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less_than_1000">
                          أقل من 1,000 ريال
                        </SelectItem>
                        <SelectItem value="1000_5000">
                          1,000 - 5,000 ريال
                        </SelectItem>
                        <SelectItem value="5000_15000">
                          5,000 - 15,000 ريال
                        </SelectItem>
                        <SelectItem value="15000_50000">
                          15,000 - 50,000 ريال
                        </SelectItem>
                        <SelectItem value="more_than_50000">
                          أكثر من 50,000 ريال
                        </SelectItem>
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
                          checked={
                            (
                              profile.primary_marketing_goals as string[]
                            )?.includes(goal) || false
                          }
                          onCheckedChange={(checked) =>
                            handleArrayFieldChange(
                              'primary_marketing_goals',
                              goal,
                              checked as boolean
                            )
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
                  <Label
                    htmlFor="biggest_marketing_challenge"
                    className="text-white"
                  >
                    أكبر تحدي تسويقي تواجهه
                  </Label>
                  <Textarea
                    id="biggest_marketing_challenge"
                    value={profile.biggest_marketing_challenge || ''}
                    onChange={(e) =>
                      updateProfile(
                        'biggest_marketing_challenge',
                        e.target.value
                      )
                    }
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="اشرح أكبر التحديات التي تواجهها في التسويق"
                    rows={3}
                  />
                </div>
              </TabsContent>

              {/* Contact & Team Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contact_email" className="text-white">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={profile.contact_info?.email || ''}
                      onChange={(e) =>
                        updateContactInfo('email', e.target.value)
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_phone" className="text-white">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="contact_phone"
                      value={profile.contact_info?.phone || ''}
                      onChange={(e) =>
                        updateContactInfo('phone', e.target.value)
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="+966 50 xxx xxxx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="text-white">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={profile.contact_info?.social_media?.linkedin || ''}
                      onChange={(e) =>
                        updateSocialMedia('linkedin', e.target.value)
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram" className="text-white">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={
                        profile.contact_info?.social_media?.instagram || ''
                      }
                      onChange={(e) =>
                        updateSocialMedia('instagram', e.target.value)
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="@yourcompany"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-white">أعضاء الفريق الرئيسيين</Label>
                    <Button
                      type="button"
                      onClick={addTeamMember}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                    >
                      إضافة عضو
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {((profile.key_team_members as any[]) || []).map(
                      (member, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <Input
                            value={member.name || ''}
                            onChange={(e) =>
                              updateTeamMember(index, 'name', e.target.value)
                            }
                            placeholder="الاسم"
                            className="bg-slate-700/50 border-slate-600 text-white flex-1"
                          />
                          <Input
                            value={member.role || ''}
                            onChange={(e) =>
                              updateTeamMember(index, 'role', e.target.value)
                            }
                            placeholder="المنصب"
                            className="bg-slate-700/50 border-slate-600 text-white flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            variant="outline"
                            size="sm"
                            className="bg-red-600/20 border-red-500 text-red-400 hover:bg-red-600/30"
                          >
                            حذف
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-600">
              <div className="flex gap-3">
                {currentTab !== 'basic' && (
                  <Button
                    onClick={() => {
                      const tabs = [
                        'basic',
                        'business',
                        'marketing',
                        'contact',
                      ];
                      const currentIndex = tabs.indexOf(currentTab);
                      if (currentIndex > 0) {
                        setCurrentTab(tabs[currentIndex - 1]);
                      }
                    }}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  >
                    السابق
                  </Button>
                )}

                {currentTab !== 'contact' && (
                  <Button
                    onClick={nextTab}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    التالي
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                )}
              </div>

              {currentTab === 'contact' && (
                <Button
                  onClick={handleComplete}
                  disabled={saving || completeness < 70}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      إكمال الإعداد والدخول إلى مورفو
                    </>
                  )}
                </Button>
              )}
            </div>

            {completeness < 70 && (
              <p className="text-orange-300 text-sm text-center mt-4">
                يرجى إكمال {70 - completeness}% إضافية من المعلومات الأساسية
                للمتابعة
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FirstTimeSetup;
