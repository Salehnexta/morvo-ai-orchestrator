import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService, UserProfile } from '@/services/userProfileService';
import { ProfileCompletionService } from '@/services/profileCompletionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { User, Building, Target, Users, DollarSign, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ProfileSetup: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completeness, setCompleteness] = useState(0);
  const [completionStatus, setCompletionStatus] = useState<any>(null);
  
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    full_name: '',
    company_name: '',
    industry: '',
    website_url: '',
    business_type: '',
    company_size: '',
    target_market: '',
    marketing_experience: '',
    primary_marketing_goals: [],
    monthly_marketing_budget: '',
    current_monthly_revenue: '',
    revenue_target: '',
    biggest_marketing_challenge: '',
    unique_selling_points: [],
    main_competitors: [],
    business_model: '',
    preferred_language: 'ar',
    greeting_preference: 'أستاذ'
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userProfile = await UserProfileService.getUserProfile(user.id);
      const status = await ProfileCompletionService.getCompletionStatus(user.id);
      
      if (userProfile) {
        setProfile(userProfile);
        const score = await UserProfileService.calculateCompleteness(userProfile);
        setCompleteness(score);
      }
      
      setCompletionStatus(status);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل البيانات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      console.log('🔄 Starting profile save with completion check');
      
      // Use the new completion service
      const success = await ProfileCompletionService.completeProfileSetup(user.id, profile);
      
      if (success) {
        // Reload status to check if profile was completed
        const newStatus = await ProfileCompletionService.getCompletionStatus(user.id);
        setCompletionStatus(newStatus);
        
        // Update UI
        const updatedProfile = await UserProfileService.getUserProfile(user.id);
        if (updatedProfile) {
          const score = await UserProfileService.calculateCompleteness(updatedProfile);
          setCompleteness(score);
        }
        
        toast({
          title: newStatus.isComplete ? 'تم إكمال الملف الشخصي! 🎉' : 'تم الحفظ',
          description: newStatus.isComplete 
            ? 'تم حفظ بياناتك وبدء تحليل موقعك تلقائياً' 
            : 'تم حفظ بياناتك بنجاح'
        });
        
        // If profile is complete, navigate to dashboard after a delay
        if (newStatus.isComplete) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ البيانات',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field: 'primary_marketing_goals' | 'unique_selling_points' | 'main_competitors', value: string, checked: boolean) => {
    setProfile(prev => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with enhanced status */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">إعداد الملف الشخصي</h1>
            {completionStatus?.isComplete && (
              <CheckCircle className="w-8 h-8 text-green-500" />
            )}
          </div>
          
          <p className="text-gray-600">أكمل معلوماتك للحصول على تجربة مخصصة</p>
          
          {completionStatus && !completionStatus.isComplete && completionStatus.missingFields.length > 0 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">حقول مطلوبة للإكمال:</span>
              </div>
              <ul className="text-sm text-amber-700 list-disc list-inside">
                {completionStatus.missingFields.map((field: string, index: number) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Progress with status indicators */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">اكتمال الملف الشخصي</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600">{completeness}%</span>
                {completionStatus?.hasWebsiteAnalysis && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    تم تحليل الموقع ✅
                  </span>
                )}
              </div>
            </div>
            <Progress value={completeness} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">الاسم الكامل</Label>
                <Input
                  id="full_name"
                  value={profile.full_name || ''}
                  onChange={(e) => updateProfile('full_name', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <Label htmlFor="greeting_preference">طريقة المخاطبة المفضلة</Label>
                <Select value={profile.greeting_preference} onValueChange={(value) => updateProfile('greeting_preference', value)}>
                  <SelectTrigger>
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
                <Label htmlFor="preferred_language">اللغة المفضلة</Label>
                <Select value={profile.preferred_language} onValueChange={(value) => updateProfile('preferred_language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                معلومات الشركة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_name">اسم الشركة</Label>
                <Input
                  id="company_name"
                  value={profile.company_name || ''}
                  onChange={(e) => updateProfile('company_name', e.target.value)}
                  placeholder="أدخل اسم شركتك"
                />
              </div>

              <div>
                <Label htmlFor="industry">المجال</Label>
                <Select value={profile.industry} onValueChange={(value) => updateProfile('industry', value)}>
                  <SelectTrigger>
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
                <Label htmlFor="website_url">رابط الموقع الإلكتروني</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={profile.website_url || ''}
                  onChange={(e) => updateProfile('website_url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="business_type">نوع النشاط</Label>
                <Select value={profile.business_type} onValueChange={(value) => updateProfile('business_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع النشاط" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="b2b">B2B (شركات)</SelectItem>
                    <SelectItem value="b2c">B2C (مستهلكين)</SelectItem>
                    <SelectItem value="both">كلاهما</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                الأهداف التسويقية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>ما هي أهدافك التسويقية الأساسية؟</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    'زيادة المبيعات',
                    'بناء الهوية التجارية',
                    'زيادة الوعي بالعلامة التجارية',
                    'جذب عملاء جدد',
                    'تحسين تفاعل العملاء',
                    'زيادة حركة المرور للموقع'
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={goal}
                        checked={(profile.primary_marketing_goals as string[])?.includes(goal) || false}
                        onCheckedChange={(checked) => handleArrayFieldChange('primary_marketing_goals', goal, checked as boolean)}
                      />
                      <Label htmlFor={goal} className="text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="marketing_experience">خبرتك في التسويق</Label>
                <Select value={profile.marketing_experience} onValueChange={(value) => updateProfile('marketing_experience', value)}>
                  <SelectTrigger>
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
            </CardContent>
          </Card>

          {/* Budget & Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                الميزانية والإيرادات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthly_marketing_budget">الميزانية التسويقية الشهرية</Label>
                <Select value={profile.monthly_marketing_budget} onValueChange={(value) => updateProfile('monthly_marketing_budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر ميزانيتك الشهرية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less_than_1000">أقل من 1,000 ريال</SelectItem>
                    <SelectItem value="1000_5000">1,000 - 5,000 ريال</SelectItem>
                    <SelectItem value="5000_15000">5,000 - 15,000 ريال</SelectItem>
                    <SelectItem value="15000_50000">15,000 - 50,000 ريال</SelectItem>
                    <SelectItem value="more_than_50000">أكثر من 50,000 ريال</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="current_monthly_revenue">الإيرادات الشهرية الحالية</Label>
                <Select value={profile.current_monthly_revenue} onValueChange={(value) => updateProfile('current_monthly_revenue', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نطاق إيراداتك الحالية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less_than_5000">أقل من 5,000 ريال</SelectItem>
                    <SelectItem value="5000_25000">5,000 - 25,000 ريال</SelectItem>
                    <SelectItem value="25000_100000">25,000 - 100,000 ريال</SelectItem>
                    <SelectItem value="100000_500000">100,000 - 500,000 ريال</SelectItem>
                    <SelectItem value="more_than_500000">أكثر من 500,000 ريال</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="revenue_target">الهدف من الإيرادات</Label>
                <Input
                  id="revenue_target"
                  value={profile.revenue_target || ''}
                  onChange={(e) => updateProfile('revenue_target', e.target.value)}
                  placeholder="مثال: زيادة 50% خلال 6 أشهر"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>معلومات إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="biggest_marketing_challenge">أكبر تحدي تسويقي تواجهه</Label>
              <Textarea
                id="biggest_marketing_challenge"
                value={profile.biggest_marketing_challenge || ''}
                onChange={(e) => updateProfile('biggest_marketing_challenge', e.target.value)}
                placeholder="اشرح أكبر التحديات التي تواجهها في التسويق"
                rows={3}
              />
            </div>

            <div>
              <Label>نقاط القوة التنافسية</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'جودة المنتج العالية',
                  'خدمة عملاء ممتازة',
                  'أسعار تنافسية',
                  'سرعة التوصيل',
                  'خبرة طويلة في السوق',
                  'فريق متخصص'
                ].map((point) => (
                  <div key={point} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={point}
                      checked={(profile.unique_selling_points as string[])?.includes(point) || false}
                      onCheckedChange={(checked) => handleArrayFieldChange('unique_selling_points', point, checked as boolean)}
                    />
                    <Label htmlFor={point} className="text-sm">{point}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className={`px-8 ${
              completionStatus?.isComplete 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {completionStatus?.isComplete ? 'جاري التحديث...' : 'جاري الحفظ...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {completionStatus?.isComplete ? 'تحديث الملف' : 'حفظ وإكمال الإعداد'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
