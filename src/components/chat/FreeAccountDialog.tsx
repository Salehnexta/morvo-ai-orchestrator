
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TokenService } from "@/services/tokenService";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface FreeAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onAccountCreated: (clientId: string) => void;
  isUpgrade?: boolean;
}

export const FreeAccountDialog = ({ open, onClose, onAccountCreated, isUpgrade = false }: FreeAccountDialogProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company_name: '',
    industry: '',
    target_audience: '',
    experience_level: '',
    budget_range: '',
    marketing_goals: ''
  });

  const content = {
    ar: {
      title: isUpgrade ? "ترقية الحساب" : "إنشاء حساب مجاني",
      subtitle: isUpgrade ? "احصل على المزيد من التوكنز مع الحساب المدفوع" : "احصل على 5000 توكن شهرياً مجاناً!",
      email: "البريد الإلكتروني",
      name: "الاسم",
      companyName: "اسم الشركة",
      industry: "الصناعة",
      targetAudience: "الجمهور المستهدف",
      experienceLevel: "مستوى الخبرة التسويقية",
      budgetRange: "نطاق الميزانية الشهرية",
      marketingGoals: "الأهداف التسويقية",
      create: "إنشاء حساب مجاني",
      upgrade: "ترقية الحساب",
      cancel: "إلغاء",
      creating: "جاري الإنشاء...",
      industries: {
        technology: "التقنية",
        retail: "البيع بالتجزئة",
        healthcare: "الرعاية الصحية",
        finance: "المالية",
        education: "التعليم",
        other: "أخرى"
      },
      experience: {
        beginner: "مبتدئ",
        intermediate: "متوسط",
        advanced: "متقدم",
        expert: "خبير"
      },
      budget: {
        "0-1000": "0 - 1,000 ريال",
        "1000-5000": "1,000 - 5,000 ريال",
        "5000-10000": "5,000 - 10,000 ريال",
        "10000+": "أكثر من 10,000 ريال"
      }
    },
    en: {
      title: isUpgrade ? "Upgrade Account" : "Create Free Account",
      subtitle: isUpgrade ? "Get more tokens with a paid account" : "Get 5000 free tokens monthly!",
      email: "Email",
      name: "Name",
      companyName: "Company Name",
      industry: "Industry",
      targetAudience: "Target Audience",
      experienceLevel: "Marketing Experience Level",
      budgetRange: "Monthly Budget Range",
      marketingGoals: "Marketing Goals",
      create: "Create Free Account",
      upgrade: "Upgrade Account",
      cancel: "Cancel",
      creating: "Creating...",
      industries: {
        technology: "Technology",
        retail: "Retail",
        healthcare: "Healthcare",
        finance: "Finance",
        education: "Education",
        other: "Other"
      },
      experience: {
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        expert: "Expert"
      },
      budget: {
        "0-1000": "0 - 1,000 SAR",
        "1000-5000": "1,000 - 5,000 SAR",
        "5000-10000": "5,000 - 10,000 SAR",
        "10000+": "10,000+ SAR"
      }
    }
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني والاسم",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isUpgrade) {
        // توجيه للصفحة المدفوعة
        window.location.href = '/pricing';
        return;
      }

      const result = await TokenService.createFreeAccount(formData.email, {
        ...formData,
        marketing_goals: formData.marketing_goals.split(',').map(g => g.trim()).filter(Boolean)
      });

      if (result.success && result.clientId) {
        onAccountCreated(result.clientId);
        setFormData({
          email: '',
          name: '',
          company_name: '',
          industry: '',
          target_audience: '',
          experience_level: '',
          budget_range: '',
          marketing_goals: ''
        });
      } else {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: result.error || "حدث خطأ غير متوقع",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('خطأ في إنشاء الحساب:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t.title}</DialogTitle>
          <p className="text-gray-600">{t.subtitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">{t.email} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="name">{t.name} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="company_name">{t.companyName}</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="industry">{t.industry}</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.industries).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience_level">{t.experienceLevel}</Label>
              <Select value={formData.experience_level} onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.experience).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget_range">{t.budgetRange}</Label>
              <Select value={formData.budget_range} onValueChange={(value) => setFormData(prev => ({ ...prev, budget_range: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.budget).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="target_audience">{t.targetAudience}</Label>
            <Textarea
              id="target_audience"
              value={formData.target_audience}
              onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="marketing_goals">{t.marketingGoals}</Label>
            <Textarea
              id="marketing_goals"
              value={formData.marketing_goals}
              onChange={(e) => setFormData(prev => ({ ...prev, marketing_goals: e.target.value }))}
              placeholder="مثال: زيادة المبيعات، تحسين الوعي بالعلامة التجارية"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? t.creating : (isUpgrade ? t.upgrade : t.create)}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
