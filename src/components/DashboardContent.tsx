
interface DashboardContentProps {
  data: any;
  theme: string;
  language: string;
  isRTL: boolean;
  content: any;
}

export const DashboardContent = ({ data, theme, language, isRTL, content }: DashboardContentProps) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center px-8 text-white relative" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Enhanced Main Content */}
      <div className="mb-16 relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 drop-shadow-2xl text-white leading-tight">
          {language === 'ar' ? (
            <>
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                مرحباً بك في
              </span>
              <br/>
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                مورفو AI
              </span>
            </>
          ) : (
            <>
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br/>
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Morvo AI
              </span>
            </>
          )}
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl drop-shadow-lg text-blue-200 max-w-4xl mx-auto font-light">
          {language === 'ar' 
            ? 'ابدأ من هنا واسألني أي شيء عن التسويق الذكي والذكاء الاصطناعي'
            : 'Start here and ask me anything about smart marketing and AI'
          }
        </p>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="flex flex-wrap gap-6 justify-center relative z-10">
        <button className="group px-8 py-4 text-lg backdrop-blur-xl rounded-2xl border transition-all duration-500 font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-300/50 shadow-xl hover:shadow-2xl hover:scale-105 transform">
          <span className="flex items-center gap-3">
            {language === 'ar' ? '📊 عرض التحليلات' : '📊 View Analytics'}
          </span>
        </button>
        
        <button className="group px-8 py-4 text-lg backdrop-blur-xl rounded-2xl border transition-all duration-500 font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-300/50 shadow-xl hover:shadow-2xl hover:scale-105 transform">
          <span className="flex items-center gap-3">
            {language === 'ar' ? '✨ إدارة المحتوى' : '✨ Content Management'}
          </span>
        </button>
        
        <button className="group px-8 py-4 text-lg backdrop-blur-xl rounded-2xl border transition-all duration-500 font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border-cyan-400/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-300/50 shadow-xl hover:shadow-2xl hover:scale-105 transform">
          <span className="flex items-center gap-3">
            {language === 'ar' ? '🚀 إنشاء حملة' : '🚀 Create Campaign'}
          </span>
        </button>
      </div>

      {/* Floating Decoration Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping delay-500"></div>
    </div>
  );
};
