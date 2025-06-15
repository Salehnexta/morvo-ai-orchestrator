
interface DashboardContentProps {
  data: any;
  theme: string;
  language: string;
  isRTL: boolean;
  content: any;
}

export const DashboardContent = ({ data, theme, language, isRTL, content }: DashboardContentProps) => {
  return (
    <div className="h-screen w-full" dir="rtl">
      {/* Empty dashboard with just the background image */}
    </div>
  );
};
