
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Privacy = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث: 15 يونيو 2024",
      sections: [
        {
          title: "1. مقدمة",
          content: "في مورفو، نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. تشرح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك عند استخدام منصتنا."
        },
        {
          title: "2. المعلومات التي نجمعها",
          content: "نجمع المعلومات التي تقدمها لنا مباشرة مثل اسمك وعنوان بريدك الإلكتروني ومعلومات الدفع. كما نجمع معلومات حول كيفية استخدامك لمنصتنا تلقائياً."
        },
        {
          title: "3. كيف نستخدم معلوماتك",
          content: "نستخدم المعلومات المجمعة لتقديم وتحسين خدماتنا، ومعالجة المدفوعات، والتواصل معك، وتخصيص تجربتك، وضمان أمان منصتنا."
        },
        {
          title: "4. مشاركة المعلومات",
          content: "لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقتك الصريحة، باستثناء الحالات المطلوبة قانونياً أو لتقديم الخدمات الأساسية."
        },
        {
          title: "5. أمان البيانات",
          content: "نستخدم تدابير أمنية متقدمة لحماية بياناتك، بما في ذلك التشفير وأنظمة الأمان المتعددة الطبقات. جميع البيانات محفوظة في خوادم آمنة ومشفرة."
        },
        {
          title: "6. ملفات تعريف الارتباط",
          content: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك. يمكنك إدارة إعدادات ملفات تعريف الارتباط من خلال متصفحك."
        },
        {
          title: "7. حقوقك",
          content: "لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها وحذفها. يمكنك أيضاً طلب نسخة من جميع البيانات التي نحتفظ بها عنك."
        },
        {
          title: "8. الاحتفاظ بالبيانات",
          content: "نحتفظ بمعلوماتك الشخصية طالما كان حسابك نشطاً أو حسب الحاجة لتقديم الخدمات. يمكنك طلب حذف بياناتك في أي وقت."
        },
        {
          title: "9. خدمات الطرف الثالث",
          content: "قد تحتوي منصتنا على روابط لخدمات الطرف الثالث. لسنا مسؤولين عن ممارسات الخصوصية لهذه الخدمات ونشجعك على مراجعة سياساتهم."
        },
        {
          title: "10. التغييرات على السياسة",
          content: "قد نحدث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات مهمة عبر البريد الإلكتروني أو من خلال إشعار على منصتنا."
        },
        {
          title: "11. الامتثال القانوني",
          content: "نلتزم بقوانين حماية البيانات المعمول بها في المملكة العربية السعودية ونظام حماية البيانات الشخصية."
        },
        {
          title: "12. التواصل معنا",
          content: "للأسئلة حول سياسة الخصوصية أو لممارسة حقوقك، يرجى التواصل معنا على: privacy@morvo.ai أو +966 50 123 4567"
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: June 15, 2024",
      sections: [
        {
          title: "1. Introduction",
          content: "At Morvo, we are committed to protecting your privacy and personal data. This policy explains how we collect, use, and protect your information when you use our platform."
        },
        {
          title: "2. Information We Collect",
          content: "We collect information you provide directly such as your name, email address, and payment information. We also automatically collect information about how you use our platform."
        },
        {
          title: "3. How We Use Your Information",
          content: "We use collected information to provide and improve our services, process payments, communicate with you, personalize your experience, and ensure platform security."
        },
        {
          title: "4. Information Sharing",
          content: "We do not sell, rent, or share your personal information with third parties without your explicit consent, except as required by law or to provide essential services."
        },
        {
          title: "5. Data Security",
          content: "We use advanced security measures to protect your data, including encryption and multi-layered security systems. All data is stored on secure and encrypted servers."
        },
        {
          title: "6. Cookies",
          content: "We use cookies to improve your experience and remember your preferences. You can manage cookie settings through your browser."
        },
        {
          title: "7. Your Rights",
          content: "You have the right to access, correct, and delete your personal data. You can also request a copy of all data we hold about you."
        },
        {
          title: "8. Data Retention",
          content: "We retain your personal information as long as your account is active or as needed to provide services. You can request deletion of your data at any time."
        },
        {
          title: "9. Third Party Services",
          content: "Our platform may contain links to third party services. We are not responsible for the privacy practices of these services and encourage you to review their policies."
        },
        {
          title: "10. Policy Changes",
          content: "We may update this policy from time to time. We will notify you of any significant changes via email or through a notice on our platform."
        },
        {
          title: "11. Legal Compliance",
          content: "We comply with applicable data protection laws in Saudi Arabia and the Personal Data Protection System."
        },
        {
          title: "12. Contact Us",
          content: "For questions about this privacy policy or to exercise your rights, please contact us at: privacy@morvo.ai or +966 50 123 4567"
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

export default Privacy;
