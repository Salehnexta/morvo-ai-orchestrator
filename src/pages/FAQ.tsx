import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQ = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات على أهم الأسئلة حول مورفو",
      finalNote: "لا يزال لديك سؤال؟ راسلنا عبر الدردشة، أو جرّب مورفو مجاناً 14 يوماً واكتشف بنفسك.",
      faqs: [
        {
          question: "كم يستغرق الإعداد؟",
          answer: "أقل من 5 دقائق: تسجيل، ربط القنوات، وتظهر البيانات تلقائياً."
        },
        {
          question: "هل النظام يدعم العربية؟",
          answer: "نعم، يفهم ويحلّل وينشئ محتوى بالعربية والإنجليزية مع مراعاة اللهجة السعودية."
        },
        {
          question: "كيف يُؤمَّن البيانات؟",
          answer: "تشفير 256-bit أثناء النقل والتخزين، وتوافق كامل مع GDPR وISO 27001."
        },
        {
          question: "هل يمكن الإلغاء متى شئت؟",
          answer: "بالتأكيد، لا عقود طويلة؛ يمكنك الإلغاء من لوحة التحكم بنقرة."
        },
        {
          question: "ما الفرق بين مورفو والأدوات المتعددة؟",
          answer: "يجمع 6–10 أدوات في منصة واحدة، ويقلّل الوقت التشغيلي 90 ٪ ويزيد العائد حتى 5×."
        },
        {
          question: "هل تقدّمون خصماً للمنظمات غير الربحية؟",
          answer: "نعم، خصم 25 ٪ على جميع الباقات. تواصل مع فريق المبيعات لتفعيله."
        },
        {
          question: "ما قنوات الدعم؟",
          answer: "دردشة مباشرة داخل اللوحة، واتساب، أو تذكرة بريدية — متوفرة 24/7."
        },
        {
          question: "كيف أستفيد من تنبيهات الأزمات؟",
          answer: "عند ارتفاع الذِّكر السلبي أو ظهور وسم مضرّ، يصلك تنبيه مع خطة استجابة فورية."
        },
        {
          question: "هل أحتاج خبرة تقنية؟",
          answer: "لا، الواجهة محادثة طبيعية ولوحة بصرية بسيطة؛ إذا كنت تعرف تستخدم واتساب فأنت جاهز."
        },
        {
          question: "هل يمكن ربط منصات إضافية؟",
          answer: "نعم، عبر تكاملات Zapier وAPI المفتوح في باقة المؤسسة."
        }
      ]
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to the most important questions about Morvo",
      finalNote: "Still have a question? Contact us via chat, or try Morvo free for 14 days and discover for yourself.",
      faqs: [
        {
          question: "How long does setup take?",
          answer: "Less than 5 minutes: registration, connect channels, and data appears automatically."
        },
        {
          question: "Does the system support Arabic?",
          answer: "Yes, it understands, analyzes and creates content in Arabic and English with consideration for Saudi dialect."
        },
        {
          question: "How is data secured?",
          answer: "256-bit encryption during transit and storage, with full GDPR and ISO 27001 compliance."
        },
        {
          question: "Can I cancel anytime?",
          answer: "Absolutely, no long contracts; you can cancel from the dashboard with one click."
        },
        {
          question: "What's the difference between Morvo and multiple tools?",
          answer: "Combines 6-10 tools in one platform, reduces operational time by 90% and increases ROI up to 5×."
        },
        {
          question: "Do you offer discounts for non-profit organizations?",
          answer: "Yes, 25% discount on all plans. Contact the sales team to activate it."
        },
        {
          question: "What are the support channels?",
          answer: "Live chat within the dashboard, WhatsApp, or email ticket — available 24/7."
        },
        {
          question: "How do I benefit from crisis alerts?",
          answer: "When negative mentions rise or harmful tags appear, you get an alert with an immediate response plan."
        },
        {
          question: "Do I need technical expertise?",
          answer: "No, the interface is natural conversation and simple visual dashboard; if you know how to use WhatsApp you're ready."
        },
        {
          question: "Can I connect additional platforms?",
          answer: "Yes, via Zapier integrations and open API in the Enterprise plan."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <MainLayout>
      <div className={`py-16 font-cairo ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16`}>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 font-cairo ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.title}
            </h1>
            <p className={`text-xl font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              {t.subtitle}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {t.faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className={`border rounded-lg px-6 font-cairo ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <AccordionTrigger className={`text-lg font-medium font-cairo ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                } ${isRTL ? 'text-right' : 'text-left'} hover:no-underline`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={`text-base font-cairo ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                } ${isRTL ? 'text-right' : 'text-left'} pt-2 pb-6`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className={`text-center mt-16`}>
            <p className={`text-lg font-cairo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.finalNote}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
