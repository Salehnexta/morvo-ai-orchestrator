
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plan, FeatureCategory } from "@/data/pricingContent";

interface PlanCardProps {
  plan: Plan;
  features: FeatureCategory[];
}

export const PlanCard = ({ plan, features }: PlanCardProps) => {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const IconComponent = plan.icon;

  const getFeatureValue = (feature: any, planId: string) => {
    return feature[planId];
  };

  const renderFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-gray-400" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  const handleButtonClick = () => {
    if (plan.id === 'free') {
      window.location.href = '/auth/register';
    } else if (plan.id === 'business') {
      window.location.href = '/contact';
    } else {
      window.location.href = '/checkout';
    }
  };

  return (
    <Card
      className={`relative h-full transition-all duration-300 hover:shadow-xl ${
        plan.popular
          ? theme === 'dark'
            ? 'border-blue-500 shadow-blue-500/20'
            : 'border-blue-500 shadow-blue-500/10'
          : theme === 'dark'
          ? 'border-gray-700'
          : 'border-gray-200'
      } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
    >
      {plan.popular && (
        <div className={`absolute -top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            الأكثر شعبية
          </span>
        </div>
      )}

      <CardHeader className={`text-center pb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 ${theme === 'dark' ? 'from-blue-900 to-purple-900' : ''} mb-4 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>
        
        <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {plan.name}
        </h3>
        
        {plan.description && (
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {plan.description}
          </p>
        )}

        <div className="mb-6">
          {plan.originalPrice && (
            <span className={`text-lg line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {plan.originalPrice}
            </span>
          )}
          
          <div className="flex items-baseline justify-center gap-2">
            {plan.price ? (
              <>
                <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price.split(' ')[0]}
                </span>
                <span className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ر.س
                </span>
              </>
            ) : (
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                تواصل معنا
              </span>
            )}
          </div>
          
          {plan.period && (
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {plan.period}
            </p>
          )}
        </div>

        <Button
          onClick={handleButtonClick}
          className={`w-full ${
            plan.popular
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              : plan.id === 'free'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              : theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
        >
          {plan.buttonText}
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-6">
          {features.map((category) => (
            <div key={category.title}>
              <h4 className={`font-semibold mb-3 text-sm uppercase tracking-wide ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {category.title}
              </h4>
              
              <div className="space-y-3">
                {category.items.map((feature, index) => {
                  const value = getFeatureValue(feature, plan.id);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 text-sm ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {renderFeatureValue(value)}
                      </div>
                      <span className={`flex-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      } ${isRTL ? 'text-right' : 'text-left'}`}>
                        {feature.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
