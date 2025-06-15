
interface DashboardContentProps {
  data: any;
  theme: string;
  language: string;
  isRTL: boolean;
  content: any;
}

export const DashboardContent = ({ data, theme, language, isRTL, content }: DashboardContentProps) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center px-8" dir="rtl">
      {/* Main heading */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          مرحباً بك في مورفو <span className="text-blue-400">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
          ابدأ من هنا واسألني أي شيء عن التسويق الذكي
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 font-medium">
          + عرض التحليلات
        </button>
        <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 font-medium">
          + إدارة المحتوى
        </button>
        <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 font-medium">
          + إنشاء حملة
        </button>
      </div>
    </div>
  );
};
