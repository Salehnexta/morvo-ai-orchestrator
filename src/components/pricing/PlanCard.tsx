
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Plan } from "@/data/pricingContent";

interface PlanCardProps {
  plan: Plan;
  features: any[];
}

export const PlanCard = ({ plan }: PlanCardProps) => {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleCTAClick = () => {
    if (plan.ctaAction === "start-free") {
      navigate("/auth/register");
    }
  };

  return (
    <Card className={`relative h-full transition-all duration-300 hover:shadow-xl border-2 ${
      plan.isPopular 
        ? 'border-blue-500 shadow-lg' 
        : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-4 py-1 flex items-center gap-1">
            <Star className="w-3 h-3" />
            {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
          </Badge>
        </div>
      )}
      
      <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
        <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {plan.name}
        </CardTitle>
        <div className="mt-4">
          <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {plan.price}
          </span>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {plan.period}
          </p>
        </div>
        <CardDescription className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        <Button
          onClick={handleCTAClick}
          className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
            plan.isPopular
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transform hover:scale-105'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
        >
          {plan.ctaText}
        </Button>
      </CardContent>
    </Card>
  );
};
