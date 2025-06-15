
import { Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FeatureCategory } from "@/data/pricingContent";

interface FeatureListProps {
  features: FeatureCategory[];
  planId: 'base' | 'pro' | 'business';
}

export const FeatureList = ({ features, planId }: FeatureListProps) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-4">
      {features.map((category) => (
        <div key={category.title}>
          <h4 className={`text-base font-semibold mt-4 mb-2 text-left ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>{category.title}</h4>
          <div className="space-y-3">
            {category.items.map((feature) => {
              const value = feature[planId];
              if (!value) return null;
              
              return (
                <div key={feature.name} className={`flex items-start gap-3 p-1 rounded-lg`}>
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feature.name}
                    {typeof value !== 'boolean' && (
                      <span className={`block font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
