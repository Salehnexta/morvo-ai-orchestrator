
interface DashboardContentProps {
  data: any;
  theme: string;
  language: string;
  isRTL: boolean;
  content: any;
}

export const DashboardContent = ({ data, theme, language, isRTL, content }: DashboardContentProps) => {
  return (
    <div className={`h-full w-full flex flex-col items-center justify-end text-center px-8 text-white pb-32`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main heading */}
      <div className="mb-12">
        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg text-white`}>
          {language === 'ar' ? (
            <>مرحباً بك في<br/>مورفو AI</>
          ) : (
            <>Welcome to<br/>Morvo AI</>
          )}
        </h1>
        <p className={`text-2xl md:text-3xl drop-shadow-md text-white/90 max-w-4xl mx-auto`}>
          {language === 'ar' 
            ? 'ابدأ من هنا واسألني أي شيء عن التسويق الذكي'
            : 'Start here and ask me anything about smart marketing'
          }
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-6 justify-center">
        <button className={`px-8 py-4 text-lg backdrop-blur-md rounded-full border transition-all duration-300 font-medium bg-gradient-to-r from-white/10 to-white/20 text-white border-white/20 hover:from-white/20 hover:to-white/30 shadow-lg`}>
          {language === 'ar' ? '+ عرض التحليلات' : '+ View Analytics'}
        </button>
        <button className={`px-8 py-4 text-lg backdrop-blur-md rounded-full border transition-all duration-300 font-medium bg-gradient-to-r from-white/10 to-white/20 text-white border-white/20 hover:from-white/20 hover:to-white/30 shadow-lg`}>
          {language === 'ar' ? '+ إدارة المحتوى' : '+ Content Management'}
        </button>
        <button className={`px-8 py-4 text-lg backdrop-blur-md rounded-full border transition-all duration-300 font-medium bg-gradient-to-r from-white/10 to-white/20 text-white border-white/20 hover:from-white/20 hover:to-white/30 shadow-lg`}>
          {language === 'ar' ? '+ إنشاء حملة' : '+ Create Campaign'}
        </button>
      </div>
    </div>
  );
};
