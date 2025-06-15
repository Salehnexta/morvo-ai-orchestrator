
import { useTheme } from "@/contexts/ThemeContext";

interface PricingFooterProps {
  note: string;
}

export const PricingFooter = ({ note }: PricingFooterProps) => {
  const { theme } = useTheme();
  return (
    <div className="text-center mt-8">
      <p className={`text-sm font-cairo ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} max-w-4xl mx-auto leading-relaxed`}>
        {note}
      </p>
    </div>
  );
};
