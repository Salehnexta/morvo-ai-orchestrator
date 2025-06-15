
interface DashboardContentProps {
  data: any;
  theme: string;
  language: string;
  isRTL: boolean;
  content: any;
}

export const DashboardContent = ({ data, theme, language, isRTL, content }: DashboardContentProps) => {
  const t = content[language];

  return (
    <div className={`h-screen w-full flex flex-col items-center justify-center text-center px-8 ${
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main heading */}
      <div className="mb-8">
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {language === 'ar' ? (
            <>مرحباً بك في مورفو <span className="text-blue-400">AI</span></>
          ) : (
            <>Welcome to Morvo <span className="text-blue-400">AI</span></>
          )}
        </h1>
        <p className={`text-xl md:text-2xl drop-shadow-md ${
          theme === 'dark' ? 'text-white/90' : 'text-gray-700'
        }`}>
          {language === 'ar' 
            ? 'ابدأ من هنا واسألني أي شيء عن التسويق الذكي'
            : 'Start here and ask me anything about smart marketing'
          }
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button className={`px-6 py-3 backdrop-blur-sm rounded-full border transition-all duration-300 font-medium ${
          theme === 'dark' 
            ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
            : 'bg-gray-100/80 text-gray-900 border-gray-300 hover:bg-gray-200/80'
        }`}>
          {language === 'ar' ? '+ عرض التحليلات' : '+ View Analytics'}
        </button>
        <button className={`px-6 py-3 backdrop-blur-sm rounded-full border transition-all duration-300 font-medium ${
          theme === 'dark' 
            ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
            : 'bg-gray-100/80 text-gray-900 border-gray-300 hover:bg-gray-200/80'
        }`}>
          {language === 'ar' ? '+ إدارة المحتوى' : '+ Content Management'}
        </button>
        <button className={`px-6 py-3 backdrop-blur-sm rounded-full border transition-all duration-300 font-medium ${
          theme === 'dark' 
            ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
            : 'bg-gray-100/80 text-gray-900 border-gray-300 hover:bg-gray-200/80'
        }`}>
          {language === 'ar' ? '+ إنشاء حملة' : '+ Create Campaign'}
        </button>
      </div>
    </div>
  );
};
