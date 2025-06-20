
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const { language } = useLanguage();

  const handleStartChat = () => {
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10">
        <Header onStartChat={handleStartChat} />
        
        <main className="container mx-auto px-4 pt-20">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 drop-shadow-2xl text-white leading-tight">
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {language === 'ar' ? 'مستقبل التسويق' : 'The Future of Marketing'}
              </span>
              <br/>
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                {language === 'ar' ? 'بالذكاء الاصطناعي' : 'with AI'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl drop-shadow-lg text-blue-200 max-w-3xl mx-auto font-light">
              {language === 'ar' 
                ? 'منصة ذكية تساعدك على إنشاء وإدارة حملاتك التسويقية بكفاءة عالية'
                : 'An intelligent platform that helps you create and manage your marketing campaigns with high efficiency'
              }
            </p>
            <div className="mt-12 flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {language === 'ar' ? 'جرب مورفو الآن' : 'Try Morvo Now'}
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 hover:border-white/30 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {language === 'ar' ? 'اكتشف المزيد' : 'Learn More'}
              </Button>
            </div>
          </div>

          {showChat ? (
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    {language === 'ar' ? 'تجربة مورفو AI' : 'Try Morvo AI'}
                  </h3>
                  <Button
                    onClick={() => setShowChat(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="h-[600px]">
                  <ChatInterface />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Features Section */}
              <section className="py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
                  {language === 'ar' ? 'مميزات المنصة' : 'Platform Features'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Feature 1 */}
                  <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {language === 'ar' ? 'تحليلات ذكية' : 'Smart Analytics'}
                    </h3>
                    <p className="text-blue-100">
                      {language === 'ar' 
                        ? 'تحليل متقدم للبيانات باستخدام الذكاء الاصطناعي لتحسين أداء حملاتك'
                        : 'Advanced data analysis using AI to improve your campaign performance'
                      }
                    </p>
                  </div>
                  
                  {/* Feature 2 */}
                  <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {language === 'ar' ? 'إنشاء محتوى' : 'Content Creation'}
                    </h3>
                    <p className="text-blue-100">
                      {language === 'ar' 
                        ? 'إنشاء محتوى إبداعي وجذاب لمنصات التواصل الاجتماعي بنقرة واحدة'
                        : 'Create creative and engaging content for social media platforms with one click'
                      }
                    </p>
                  </div>
                  
                  {/* Feature 3 */}
                  <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {language === 'ar' ? 'جدولة ذكية' : 'Smart Scheduling'}
                    </h3>
                    <p className="text-blue-100">
                      {language === 'ar' 
                        ? 'جدولة المنشورات في أفضل الأوقات لزيادة التفاعل والوصول'
                        : 'Schedule posts at the best times to increase engagement and reach'
                      }
                    </p>
                  </div>
                </div>
              </section>
              
              {/* Pricing Section */}
              <section className="py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
                  {language === 'ar' ? 'باقات الاشتراك' : 'Pricing Plans'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {/* Basic Plan */}
                  <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {language === 'ar' ? 'الباقة الأساسية' : 'Basic Plan'}
                    </h3>
                    <div className="text-3xl font-bold mb-4 text-white">
                      $19<span className="text-sm font-normal text-blue-200">/mo</span>
                    </div>
                    <ul className="mb-6 space-y-2">
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? '10,000 طلب شهرياً' : '10,000 requests/month'}
                      </li>
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'تحليلات أساسية' : 'Basic analytics'}
                      </li>
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'دعم بالبريد الإلكتروني' : 'Email support'}
                      </li>
                    </ul>
                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                      {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                    </Button>
                  </div>
                  
                  {/* Pro Plan */}
                  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg p-6 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 transform scale-105 shadow-xl">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      {language === 'ar' ? 'الأكثر شعبية' : 'MOST POPULAR'}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {language === 'ar' ? 'الباقة الاحترافية' : 'Pro Plan'}
                    </h3>
                    <div className="text-3xl font-bold mb-4 text-white">
                      $49<span className="text-sm font-normal text-blue-200">/mo</span>
                    </div>
                    <ul className="mb-6 space-y-2">
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? '50,000 طلب شهرياً' : '50,000 requests/month'}
                      </li>
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'تحليلات متقدمة' : 'Advanced analytics'}
                      </li>
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'دعم على مدار الساعة' : '24/7 support'}
                      </li>
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'تكامل مع منصات التواصل' : 'Social media integration'}
                      </li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                    </Button>
                  </div>
                  
                  {/* Enterprise Plan */}
                  <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {language === 'ar' ? 'باقة المؤسسات' : 'Enterprise Plan'}
                    </h3>
                    <div className="text-3xl font-bold mb-4 text-white">
                      $99<span className="text-sm font-normal text-blue-200">/mo</span>
                    </div>
                    <ul className="mb-6 space-y-2">
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'طلبات غير محدودة' : 'Unlimited requests'}
                      </li>
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'تحليلات مخصصة' : 'Custom analytics'}
                      </li>
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'مدير حساب مخصص' : 'Dedicated account manager'}
                      </li>
                      <li className="flex items-center text-blue-100">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ar' ? 'واجهة برمجة التطبيقات' : 'API access'}
                      </li>
                    </ul>
                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                      {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                    </Button>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
