
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FeatureList } from "./FeatureList";
import { Plan, FeatureCategory } from "@/data/pricingContent";
import { useNavigate } from "react-router-dom";

interface PlanCardProps {
  plan: Plan;
  features: FeatureCategory[];
}

export const PlanCard = ({ plan, features }: PlanCardProps) => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSelectPlan = (billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    navigate(`/checkout?plan=${plan.id}&cycle=${billingCycle}`);
  };

  let discountBadge = null;
  if (plan.originalPrice && plan.price) {
    const original = parseInt(plan.originalPrice.replace(/[^0-9,]/g, ''));
    const current = parseInt(plan.price.replace(/[^0-9,]/g, ''));
    if (original > current) {
      const percentage = Math.round(((original - current) / original) * 100);
      const saveText = language === 'ar' ? `خصم ${percentage}%` : `Save ${percentage}%`;
      discountBadge = (
        <div className={`absolute top-0 ${isRTL ? 'left-4' : 'right-4'} -mt-3 z-10`}>
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {saveText}
          </div>
        </div>
      );
    }
  }

  return (
    <Card className={`relative group transition-all duration-500 hover:scale-105 font-cairo flex flex-col h-full ${
      plan.popular 
        ? `border-2 ${theme === 'dark' 
            ? 'border-blue-500 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-blue-500/20' 
            : 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-2xl shadow-blue-200/50'
          }` 
        : `${theme === 'dark' 
            ? 'bg-gray-800/80 border-gray-700 hover:bg-gray-800' 
            : 'bg-white/80 border-gray-200 hover:bg-white'
          } backdrop-blur-sm`
    }`}>
      {discountBadge}
      {plan.popular && (
        <div className={`absolute -top-4 ${isRTL ? 'right-1/2' : 'left-1/2'} transform ${isRTL ? 'translate-x-1/2' : '-translate-x-1/2'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold font-cairo shadow-lg flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
          </div>
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            plan.popular
              ? 'bg-gradient-to-br from-blue-500 to-purple-600'
              : theme === 'dark' 
                ? 'bg-gray-700' 
                : 'bg-gray-100'
          }`}>
            <plan.icon className={`w-8 h-8 ${
              plan.popular ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </div>
        </div>
        <CardTitle className={`text-3xl mb-2 font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {plan.name}
        </CardTitle>
        <CardDescription className={`text-lg font-cairo min-h-[2rem] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {plan.description}
        </CardDescription>
        <div className="mt-8 min-h-[6rem] flex flex-col justify-center">
          {plan.originalPrice && (
            <span className={`text-2xl font-medium line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {plan.originalPrice}
            </span>
          )}
          {plan.price && (
            <div>
              <span className={`text-5xl font-bold font-cairo ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {plan.price}
              </span>
              {plan.period && (
                <span className={`text-lg font-cairo ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${
                  isRTL ? 'mr-2' : 'ml-2'
                }`}>
                  /{plan.period}
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-3">
        <Button 
          onClick={() => handleSelectPlan('monthly')}
          className={`w-full h-12 text-lg font-semibold font-cairo transition-all duration-300 ${
            plan.popular 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
              : 'hover:scale-105'
          }`}
          variant={plan.popular ? 'default' : 'outline'}
        >
          {language === 'ar' ? 'ابدأ الآن - شهري' : 'Start Now - Monthly'}
        </Button>
        
        <Button 
          onClick={() => handleSelectPlan('yearly')}
          className="w-full h-12 text-lg font-semibold font-cairo"
          variant="outline"
        >
          {language === 'ar' ? 'ابدأ الآن - سنوي (خصم 17%)' : 'Start Now - Yearly (17% off)'}
        </Button>
      </CardContent>

      <CardContent className="flex-grow pt-0">
          <div className={`w-full h-px my-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <h4 className={`text-lg font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {language === 'ar' ? 'الميزات الرئيسية' : 'Key Features'}
          </h4>
          <FeatureList features={features} planId={plan.id} />
      </CardContent>
    </Card>
  );
};
