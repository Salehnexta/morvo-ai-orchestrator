
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Terms = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الشروط والأحكام",
      lastUpdated: "آخر تحديث: 15 يونيو 2024",
      sections: [
        {
          title: "1. مقدمة",
          content: "مرحباً بك في مورفو. هذه الشروط والأحكام تحكم استخدامك لمنصة مورفو للذكاء الاصطناعي والتسويق الرقمي. باستخدام خدماتنا، فإنك توافق على هذه الشروط."
        },
        {
          title: "2. قبول الشروط",
          content: "بالوصول إلى منصة مورفو أو استخدامها، فإنك توافق على الالتزام بهذه الشروط والأحكام وسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام خدماتنا."
        },
        {
          title: "3. وصف الخدمة",
          content: "مورفو هي منصة ذكاء اصطناعي للتسويق الرقمي تساعد الشركات على تحليل السوق وبناء استراتيجيات تسويقية فعالة. نحن نقدم أدوات لتحليل وسائل التواصل الاجتماعي، وإنشاء المحتوى، وتتبع الأداء."
        },
        {
          title: "4. حساب المستخدم",
          content: "لاستخدام بعض ميزات مورفو، يجب عليك إنشاء حساب. أنت مسؤول عن الحفاظ على سرية معلومات حسابك وعن جميع الأنشطة التي تحدث تحت حسابك."
        },
        {
          title: "5. الاستخدام المقبول",
          content: "يجب عليك استخدام مورفو فقط للأغراض القانونية والمشروعة. لا يجوز لك استخدام خدماتنا لأي أنشطة احتيالية أو ضارة أو غير قانونية."
        },
        {
          title: "6. الخصوصية والبيانات",
          content: "نحن نحترم خصوصيتك ونحمي بياناتك وفقاً لسياسة الخصوصية الخاصة بنا. بيانات العملاء محمية ولا نشاركها مع أطراف ثالثة دون موافقة صريحة."
        },
        {
          title: "7. الدفع والفوترة",
          content: "الأسعار محددة بالريال السعودي وتشمل ضريبة القيمة المضافة. المدفوعات تتم شهرياً أو سنوياً حسب الخطة المختارة. يمكن إلغاء الاشتراك في أي وقت."
        },
        {
          title: "8. الملكية الفكرية",
          content: "جميع حقوق الملكية الفكرية في منصة مورفو محفوظة لنا. المحتوى الذي تنشئه باستخدام أدواتنا يبقى ملكك، ولكن تمنحنا ترخيصاً لاستخدامه لتحسين خدماتنا."
        },
        {
          title: "9. إخلاء المسؤولية",
          content: "نقدم خدماتنا 'كما هي' دون أي ضمانات. لا نتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام منصتنا."
        },
        {
          title: "10. إنهاء الخدمة",
          content: "يحق لنا إنهاء أو تعليق حسابك في أي وقت إذا انتهكت هذه الشروط. يمكنك أيضاً إنهاء حسابك في أي وقت من خلال إعدادات الحساب."
        },
        {
          title: "11. القانون المطبق",
          content: "تخضع هذه الشروط والأحكام لقوانين المملكة العربية السعودية. أي نزاعات ستحل وفقاً للقوانين السعودية."
        },
        {
          title: "12. التواصل معنا",
          content: "للأسئلة حول هذه الشروط والأحكام، يرجى التواصل معنا على: info@morvo.ai أو +966 50 123 4567"
        }
      ]
    },
    en: {
      title: "Terms & Conditions",
      lastUpdated: "Last updated: June 15, 2024",
      sections: [
        {
          title: "1. Introduction",
          content: "Welcome to Morvo. These Terms and Conditions govern your use of the Morvo AI and digital marketing platform. By using our services, you agree to these terms."
        },
        {
          title: "2. Acceptance of Terms",
          content: "By accessing or using the Morvo platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any of these terms, please do not use our services."
        },
        {
          title: "3. Service Description",
          content: "Morvo is an AI-powered digital marketing platform that helps businesses analyze markets and build effective marketing strategies. We provide tools for social media analysis, content creation, and performance tracking."
        },
        {
          title: "4. User Account",
          content: "To use some features of Morvo, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account."
        },
        {
          title: "5. Acceptable Use",
          content: "You must use Morvo only for lawful and legitimate purposes. You may not use our services for any fraudulent, harmful, or illegal activities."
        },
        {
          title: "6. Privacy and Data",
          content: "We respect your privacy and protect your data according to our Privacy Policy. Customer data is protected and we do not share it with third parties without explicit consent."
        },
        {
          title: "7. Payment and Billing",
          content: "Prices are set in Saudi Riyals and include VAT. Payments are made monthly or annually depending on the chosen plan. Subscriptions can be cancelled at any time."
        },
        {
          title: "8. Intellectual Property",
          content: "All intellectual property rights in the Morvo platform are reserved to us. Content you create using our tools remains yours, but you grant us a license to use it to improve our services."
        },
        {
          title: "9. Disclaimer",
          content: "We provide our services 'as is' without any warranties. We are not liable for any direct or indirect damages that may result from using our platform."
        },
        {
          title: "10. Service Termination",
          content: "We may terminate or suspend your account at any time if you violate these terms. You can also terminate your account at any time through account settings."
        },
        {
          title: "11. Governing Law",
          content: "These Terms and Conditions are governed by the laws of Saudi Arabia. Any disputes will be resolved according to Saudi laws."
        },
        {
          title: "12. Contact Us",
          content: "For questions about these Terms and Conditions, please contact us at: info@morvo.ai or +966 50 123 4567"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <MainLayout>
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.title}
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.lastUpdated}
            </p>
          </div>

          <div className="space-y-6">
            {t.sections.map((section, index) => (
              <Card key={index} className={`${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
              }`}>
                <CardHeader>
                  <CardTitle className={`${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  } ${isRTL ? 'text-right' : 'text-left'}`}>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } ${isRTL ? 'text-right' : 'text-left'}`}>
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
