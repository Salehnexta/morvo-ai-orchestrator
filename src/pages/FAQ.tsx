
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle } from "lucide-react";

export const FAQ = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات على أكثر الأسئلة تكراراً حول مورفو",
      contactSupport: "تواصل مع الدعم",
      faqs: [
        {
          question: "ما هو مورفو وكيف يعمل؟",
          answer: "مورفو هو أول نظام ذكاء اصطناعي متكامل للتسويق في السوق السعودي. يضم 9 عملاء ذكاء اصطناعي يعملون معاً لتحليل السوق وبناء الاستراتيجيات وتنفيذ الحملات التسويقية بشكل آلي."
        },
        {
          question: "كم من الوقت يستغرق إعداد النظام؟",
          answer: "يمكن إعداد النظام خلال 24 ساعة فقط. بمجرد التسجيل واختيار الباقة المناسبة، سيبدأ فريق الذكاء الاصطناعي في تحليل بياناتك وبناء استراتيجيتك التسويقية."
        },
        {
          question: "هل يدعم النظام اللغة العربية؟",
          answer: "نعم، مورفو مصمم خصيصاً للسوق السعودي والعربي. يدعم اللغة العربية بشكل كامل مع فهم عميق لثقافة وسلوك المستهلك في المنطقة."
        },
        {
          question: "ما مدى دقة النتائج والتنبؤات؟",
          answer: "يحقق مورفو دقة تصل إلى 94% في التنبؤات التسويقية، بفضل تقنيات الذكاء الاصطناعي المتقدمة والتعلم المستمر من البيانات."
        },
        {
          question: "هل يمكن تجربة النظام قبل الشراء؟",
          answer: "نعم، نقدم عرضاً تجريبياً مجانياً لمدة 14 يوماً يتيح لك تجربة جميع مميزات النظام وقياس النتائج قبل اتخاذ قرار الشراء."
        },
        {
          question: "كيف يتم تأمين البيانات؟",
          answer: "نستخدم أحدث معايير الأمان والتشفير لحماية بياناتك. جميع البيانات محفوظة في خوادم آمنة ولا يتم مشاركتها مع أي جهة خارجية."
        },
        {
          question: "هل يمكن التكامل مع الأنظمة الحالية؟",
          answer: "نعم، مورفو يدعم التكامل مع أكثر من 100 منصة ونظام مختلف، بما في ذلك أنظمة إدارة علاقات العملاء ومنصات التجارة الإلكترونية."
        },
        {
          question: "ما هو مستوى الدعم الفني المتاح؟",
          answer: "نوفر دعماً فنياً على مدار الساعة طوال أيام الأسبوع باللغة العربية، بالإضافة إلى مدير حساب مخصص للباقات المتقدمة."
        }
      ]
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to the most common questions about Morvo",
      contactSupport: "Contact Support",
      faqs: [
        {
          question: "What is Morvo and how does it work?",
          answer: "Morvo is the first integrated AI marketing system in the Saudi market. It includes 9 AI agents working together to analyze markets, build strategies, and execute marketing campaigns automatically."
        },
        {
          question: "How long does it take to set up the system?",
          answer: "The system can be set up in just 24 hours. Once you register and choose the right package, the AI team will start analyzing your data and building your marketing strategy."
        },
        {
          question: "Does the system support Arabic language?",
          answer: "Yes, Morvo is specifically designed for the Saudi and Arab markets. It fully supports Arabic with deep understanding of regional culture and consumer behavior."
        },
        {
          question: "How accurate are the results and predictions?",
          answer: "Morvo achieves up to 94% accuracy in marketing predictions, thanks to advanced AI technologies and continuous learning from data."
        },
        {
          question: "Can I try the system before purchasing?",
          answer: "Yes, we offer a free 14-day trial that allows you to experience all system features and measure results before making a purchase decision."
        },
        {
          question: "How is data secured?",
          answer: "We use the latest security and encryption standards to protect your data. All data is stored on secure servers and is not shared with any external parties."
        },
        {
          question: "Can it integrate with existing systems?",
          answer: "Yes, Morvo supports integration with over 100 different platforms and systems, including CRM systems and e-commerce platforms."
        },
        {
          question: "What level of technical support is available?",
          answer: "We provide 24/7 technical support in Arabic, plus a dedicated account manager for advanced packages."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <MainLayout>
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.title}
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl ${
              isRTL ? 'mr-auto' : 'ml-auto'
            }`}>
              {t.subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {t.faqs.map((faq, index) => (
              <Card key={index} className={`transition-all duration-300 hover:shadow-lg ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'
              }`}>
                <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
                  <CardTitle className={`flex items-center gap-3 ${
                    isRTL ? 'flex-row-reverse' : ''
                  } ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <HelpCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`text-base leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } ${isRTL ? 'text-right' : 'text-left'}`}>
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Card className={`p-8 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-blue-50'}`}>
              <div className={`flex items-center justify-center gap-4 mb-6 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}>
                <MessageCircle className="w-8 h-8 text-blue-500" />
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'ar' ? 'هل تحتاج مساعدة إضافية؟' : 'Need additional help?'}
                </h3>
              </div>
              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {language === 'ar' 
                  ? 'فريق الدعم متاح لمساعدتك على مدار الساعة'
                  : 'Our support team is available 24/7 to help you'
                }
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {t.contactSupport}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
