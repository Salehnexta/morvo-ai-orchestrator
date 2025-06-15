
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Privacy = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "سياسة الخصوصية لـ Morvo AI",
      lastUpdated: "آخر تحديث: 15 يونيو 2024",
      sections: [
        {
          title: "المقدمة",
          content: "ترحب بكم Morvo AI (\"نحن\"، \"لنا\"). نحن نلتزم بشدة بحماية خصوصية وأمن بياناتكم الشخصية. تقدم سياسة الخصوصية هذه (\"السياسة\") شرحًا شاملاً ومفصلاً حول الآلية التي نتبعها في جمع، واستخدام، وتخزين، ومعالجة، ومشاركة، وحماية بياناتكم الشخصية.\n\nتنطبق هذه السياسة عندما تقومون بالتسجيل، أو استخدام، أو الوصول، أو التفاعل مع أي من منصاتنا، أو مواقعنا الإلكترونية، أو منتجاتنا، أو خدماتنا.\n\nلأغراض هذه السياسة، نقوم بجمع واستخدام المعلومات من فئات المستخدمين التالية: التجار، العملاء، المستهلكون، الشركاء، والزوار."
        },
        {
          title: "جمع البيانات والمعلومات",
          content: "نقوم بجمع معلوماتكم الشخصية من خلال قنوات متعددة لتمكينكم من استخدام منصتنا وتحقيق مصالحنا المشروعة في الحفاظ على علاقتنا التجارية، ومنع المخاطر والاحتيال، وتقديم خدمات فعالة.\n\n1. المعلومات التي تقدمونها مباشرة: نجمع المعلومات التي تزودوننا بها طوعًا عند التسجيل في خدماتنا، أو ملء النماذج، أو التواصل مع فريق الدعم.\n\n2. المعلومات التي نجمعها تلقائيًا: عند استخدامكم لخدماتنا، نقوم تلقائيًا بجمع معلومات معينة حول جهازكم وأنشطتكم.\n\n3. المعلومات التي نحصل عليها من أطراف ثالثة: قد نتلقى معلومات عنكم من مصادر أخرى، مثل شركائنا في الدفع، وخدمات التحقق من الهوية."
        },
        {
          title: "أنواع المعلومات التي نجمعها",
          content: "بصفتك تاجرًا: نجمع مجموعة واسعة من المعلومات لدعم أعمالك، بما في ذلك تفاصيل العمل الكاملة، معلومات الدفع، والمستندات التعريفية الرسمية.\n\nبصفتك مستهلكًا: نقوم بجمع معلومات الحساب ومعلومات الاتصال مثل اسمك، وعنوان الشحن، وتفاصيل الدفع، وعنوان بريدك الإلكتروني.\n\nبصفتك شريكًا: نقوم بجمع تفاصيل عملك، ومعلومات الدفع، والمستندات التعريفية لك ولموظفيك.\n\nبصفتك زائرًا: عند زيارتك لمواقعنا، نجمع معلومات حول سلوك التصفح الخاص بك، مثل عنوان IP، ونوع المتصفح، والصفحات التي تزورها."
        },
        {
          title: "المعالجة والاستخدام",
          content: "تتم معالجة بياناتك الشخصية بشكل قانوني وعادل وشفاف، بما يتوافق مع مصالحنا المشروعة والتزاماتنا التعاقدية. نستخدم معلوماتك للأغراض التالية:\n\n• تقديم وتحسين خدماتنا: نستخدم بياناتك لتشغيل وصيانة وتوفير كافة ميزات منصتنا.\n• الاتصالات والتسويق: نستخدم معلومات الاتصال الخاصة بك لإرسال إشعارات هامة حول الخدمة.\n• الأمان ومنع الاحتيال: نستخدم البيانات لمراقبة الأنشطة المشبوهة، ومنع الاحتيال.\n• التحليلات والأبحاث: نقوم بتحليل بيانات الاستخدام لفهم كيفية تفاعل المستخدمين مع خدماتنا."
        },
        {
          title: "مشاركة المعلومات والبيانات",
          content: "نحن لا نبيع بياناتك الشخصية. ومع ذلك، قد نشارك معلوماتك مع أطراف ثالثة موثوقة في ظروف محددة:\n\n• مزودو الخدمات: نشارك المعلومات مع الشركات التي تساعدنا في عملياتنا التجارية، مثل بوابات الدفع، وخدمات الحوسبة السحابية.\n• الشركاء: عندما يقوم تاجر بتثبيت تطبيق أو خدمة من أحد شركائنا، فإننا نشارك معلومات التاجر اللازمة.\n• الامتثال القانوني: قد نكشف عن معلوماتك إذا كنا نعتقد بحسن نية أن الإفصاح ضروري للامتثال لقانون أو لائحة سارية.\n• بموافقتك: قد نشارك معلوماتك مع أطراف أخرى عندما نحصل على موافقتك الصريحة."
        },
        {
          title: "الحقوق المتعلقة بالمعلومات والبيانات",
          content: "بصفتك مالكًا للبيانات الشخصية، تمنحك القوانين المعمول بها مجموعة من الحقوق:\n\n• الحق في العلم: الحق في أن يتم إخبارك بالأساس القانوني لجمع بياناتك والغرض منها.\n• الحق في الوصول: الحق في طلب الوصول إلى بياناتك الشخصية التي نحتفظ بها ومراجعتها.\n• الحق في التصحيح: الحق في طلب تصحيح أو استكمال أو تحديث أي بيانات شخصية غير دقيقة.\n• الحق في الحذف: الحق في طلب حذف بياناتك الشخصية عندما لا تعود هناك حاجة للاحتفاظ بها.\n• الحق في سحب الموافقة: الحق في سحب موافقتك على معالجة بياناتك الشخصية في أي وقت."
        },
        {
          title: "حماية وأمن المعلومات",
          content: "نحن نأخذ أمن البيانات على محمل الجد ونطبق تدابير تنظيمية وتقنية وإدارية قوية ومناسبة لحماية بياناتك الشخصية من الوصول غير المصرح به، أو التغيير، أو الإفصاح، أو الإتلاف.\n\nتشمل هذه الإجراءات استخدام التشفير للبيانات أثناء النقل والتخزين، وتطبيق ضوابط صارمة للوصول إلى البيانات، وإجراء تقييمات أمنية منتظمة. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100%، لذا لا يمكننا ضمان الأمان المطلق."
        },
        {
          title: "نقل البيانات عبر الحدود",
          content: "قد يتم نقل بياناتك الشخصية ومعالجتها وتخزينها في بلدان أخرى خارج بلد إقامتك، حيث قد تكون قوانين حماية البيانات مختلفة. عند نقل بياناتك عبر الحدود، سنتخذ جميع الخطوات اللازمة لضمان حماية بياناتك بشكل كافٍ ووفقًا لمتطلبات القوانين المعمول بها."
        },
        {
          title: "الاحتفاظ بالبيانات",
          content: "سنحتفظ ببياناتك الشخصية فقط طالما كان ذلك ضروريًا لتحقيق الأغراض التي تم جمعها من أجلها، بما في ذلك الامتثال لالتزاماتنا التعاقدية والقانونية، وحل النزاعات، وإنفاذ سياساتنا. بعد انتهاء الغرض من جمعها، سنقوم بإتلاف بياناتك الشخصية بشكل آمن، ما لم يكن هناك مبرر نظامي للاحتفاظ بها لفترة أطول."
        },
        {
          title: "الإفصاح عن المعلومات",
          content: "لن يتم الكشف عن بياناتك الشخصية للجمهور أو لأي طرف ثالث دون موافقتك المسبقة، إلا في الحالات الاستثنائية التي يتطلبها القانون، مثل طلب من جهة حكومية أو قضائية مختصة لأغراض أمنية أو لتنفيذ نظام معين."
        },
        {
          title: "الاتصال بنا",
          content: "إذا كان لديكم أي استفسارات أو مخاوف حول سياسة الخصوصية هذه أو كيفية تعاملنا مع معلوماتكم الشخصية، يرجى عدم التردد في التواصل مع مسؤول حماية البيانات لدينا:\n\nMorvo AI\nللعناية: مسؤول حماية البيانات\nالبريد الإلكتروني: privacy@morvo.ai"
        }
      ]
    },
    en: {
      title: "Privacy Policy for Morvo AI",
      lastUpdated: "Last updated: June 15, 2024",
      sections: [
        {
          title: "Introduction",
          content: "Welcome to Morvo AI (\"we\", \"us\"). We are strongly committed to protecting the privacy and security of your personal data. This Privacy Policy (\"Policy\") provides a comprehensive and detailed explanation of how we collect, use, store, process, share, and protect your personal data.\n\nThis Policy applies when you register, use, access, or interact with any of our platforms, websites, products, or services.\n\nFor the purposes of this Policy, we collect and use information from the following user categories: merchants, customers, consumers, partners, and visitors."
        },
        {
          title: "Data and Information Collection",
          content: "We collect your personal information through multiple channels to enable you to use our platform and achieve our legitimate interests in maintaining our business relationship, preventing risks and fraud, and providing effective services.\n\n1. Information you provide directly: We collect information you voluntarily provide when registering for our services, filling out forms, or contacting our support team.\n\n2. Information we collect automatically: When you use our services, we automatically collect certain information about your device and activities.\n\n3. Information we obtain from third parties: We may receive information about you from other sources, such as our payment partners and identity verification services."
        },
        {
          title: "Types of Information We Collect",
          content: "As a merchant: We collect a wide range of information to support your business, including complete business details, payment information, and official identification documents.\n\nAs a consumer: We collect account information and contact details such as your name, shipping address, payment details, and email address.\n\nAs a partner: We collect your business details, payment information, and identification documents for you and your employees.\n\nAs a visitor: When you visit our websites, we collect information about your browsing behavior, such as IP address, browser type, and pages you visit."
        },
        {
          title: "Processing and Use",
          content: "Your personal data is processed legally, fairly, and transparently, in accordance with our legitimate interests and contractual obligations. We use your information for the following purposes:\n\n• Providing and improving our services: We use your data to operate, maintain, and provide all features of our platform.\n• Communications and marketing: We use your contact information to send important service notifications.\n• Security and fraud prevention: We use data to monitor suspicious activities and prevent fraud.\n• Analytics and research: We analyze usage data to understand how users interact with our services."
        },
        {
          title: "Information and Data Sharing",
          content: "We do not sell your personal data. However, we may share your information with trusted third parties under specific circumstances:\n\n• Service providers: We share information with companies that help us with our business operations, such as payment gateways and cloud computing services.\n• Partners: When a merchant installs an app or service from one of our partners, we share necessary merchant information.\n• Legal compliance: We may disclose your information if we believe in good faith that disclosure is necessary to comply with applicable law or regulation.\n• With your consent: We may share your information with other parties when we obtain your explicit consent."
        },
        {
          title: "Information and Data Rights",
          content: "As a personal data owner, applicable laws grant you a set of rights:\n\n• Right to know: The right to be informed about the legal basis for collecting your data and its purpose.\n• Right to access: The right to request access to and review your personal data we hold.\n• Right to correction: The right to request correction, completion, or updating of any inaccurate personal data.\n• Right to deletion: The right to request deletion of your personal data when there is no longer a need to retain it.\n• Right to withdraw consent: The right to withdraw your consent to process your personal data at any time."
        },
        {
          title: "Information Protection and Security",
          content: "We take data security seriously and implement strong and appropriate organizational, technical, and administrative measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.\n\nThese procedures include using encryption for data in transit and storage, implementing strict data access controls, and conducting regular security assessments. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security."
        },
        {
          title: "Cross-Border Data Transfer",
          content: "Your personal data may be transferred, processed, and stored in countries other than your country of residence, where data protection laws may be different. When transferring your data across borders, we will take all necessary steps to ensure your data is adequately protected and in accordance with applicable law requirements."
        },
        {
          title: "Data Retention",
          content: "We will retain your personal data only as long as necessary to achieve the purposes for which it was collected, including compliance with our contractual and legal obligations, resolving disputes, and enforcing our policies. After the purpose of collection ends, we will securely destroy your personal data unless there is a legitimate reason to retain it for a longer period."
        },
        {
          title: "Information Disclosure",
          content: "Your personal data will not be disclosed to the public or any third party without your prior consent, except in exceptional cases required by law, such as a request from a competent governmental or judicial authority for security purposes or to implement a specific system."
        },
        {
          title: "Contact Us",
          content: "If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please do not hesitate to contact our Data Protection Officer:\n\nMorvo AI\nAttn: Data Protection Officer\nEmail: privacy@morvo.ai"
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
                  <div className={`leading-relaxed whitespace-pre-line ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } ${isRTL ? 'text-right' : 'text-left'}`}>
                    {section.content}
                  </div>
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
