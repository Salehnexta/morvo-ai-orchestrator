
import { MainLayout } from "@/components/layouts/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Terms = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();

  const content = {
    ar: {
      title: "الشروط والأحكام لـ Morvo AI",
      lastUpdated: "آخر تحديث: يونيو 2025",
      sections: [
        {
          title: "1. مقدمة",
          content: "أهلاً بك في منصة Morvo AI. تحكم هذه الشروط والأحكام ('الشروط') بشكل كامل استخدامك أو زيارتك لمنصتنا، والاستفادة من كافة المنتجات والخصائص والأدوات التي نقدمها ('الخدمة' أو 'خدماتنا'). هذه الخدمات مملوكة ومُدارة من قبل Morvo AI ('نحن'، 'لنا').\n\nإن استخدامك لخدماتنا مشروط بقبولك لهذه الشروط والامتثال الكامل لها. تنطبق هذه الشروط على جميع الزوار والمستخدمين وأي طرف آخر يصل إلى الخدمة أو يستخدمها. من خلال وصولك إلى خدماتنا أو استخدامها، فإنك تؤكد موافقتك الصريحة على الالتزام بهذه الشروط وسياسة الخصوصية الخاصة بنا، والتي تعد جزءًا لا يتجزأ من هذا الاتفاق."
        },
        {
          title: "2. الحسابات",
          content: "إنشاء الحساب: للاستفادة الكاملة من خدماتنا، يجب عليك إنشاء حساب. أنت تتعهد بتقديم معلومات دقيقة وكاملة ومحدثة في جميع الأوقات عند التسجيل.\n\nالأهلية القانونية: أنت تقر بأن عمرك لا يقل عن (18) ثمانية عشر عامًا أو أنك بلغت سن الرشد القانوني في دولتك.\n\nأمان الحساب: أنت المسؤول الوحيد عن حماية كلمة المرور التي تستخدمها للوصول إلى الخدمة وعن أي أنشطة أو إجراءات تتم تحت كلمة المرور الخاصة بك."
        },
        {
          title: "3. المدفوعات والاشتراكات",
          content: "الرسوم: قد يتطلب استخدام بعض خدماتنا دفع رسوم اشتراك شهرية أو سنوية ('الرسوم'). أنت تفوضنا صراحةً بتحصيل هذه الرسوم وأي ضرائب مطبقة (مثل ضريبة القيمة المضافة) من خلال طريقة الدفع التي تحددها لنا عند التسجيل.\n\nدورة الفوترة والتجديد التلقائي: يتم دفع رسوم الاشتراك مقدمًا. سيتم تجديد اشتراكك تلقائيًا في نهاية كل فترة فوترة (شهرية أو سنوية).\n\nعدم القابلية للاسترداد: إلى أقصى حد يسمح به القانون المعمول به، فإن جميع المدفوعات غير قابلة للاسترداد."
        },
        {
          title: "4. المحتوى الخاص بك",
          content: "المسؤولية عن المحتوى: تتيح لك خدمتنا نشر وتحميل وتخزين ومشاركة معلومات وبيانات ونصوص ورسومات ومقاطع فيديو ومواد أخرى ('المحتوى'). أنت المسؤول مسؤولية كاملة عن أي محتوى تنشره على الخدمة.\n\nترخيص الاستخدام: من خلال نشر المحتوى، فإنك تمنح Morvo AI حقًا عالميًا، غير حصري، خاليًا من حقوق الملكية، وقابل للترخيص من الباطن لاستخدام واستضافة ونسخ وتوزيع وتعديل وعرض وتشغيل المحتوى الخاص بك."
        },
        {
          title: "5. إنهاء الحساب",
          content: "الإنهاء من قبل Morvo AI: يجوز لنا تعليق أو إنهاء حسابك ووقف تزويدك بالخدمات بشكل فوري ودون سابق إنذار أو مسؤولية، لأي سبب كان.\n\nالإنهاء من قبلك: يمكنك إلغاء حسابك في أي وقت عن طريق اتباع التعليمات الموجودة على المنصة أو بالتواصل مع فريق الدعم لدينا.\n\nأثر الإنهاء: عند إنهاء حسابك، يتوقف حقك في استخدام الخدمة على الفور."
        },
        {
          title: "6. الملكية الفكرية",
          content: "الخدمة وجميع محتوياتها الأصلية (باستثناء المحتوى المقدم من المستخدمين)، بما في ذلك النصوص والرسومات والبيانات والشعارات والصور والبرامج ومقاطع الفيديو والتصاميم، والميزات والوظائف، هي وستظل ملكية حصرية لـ Morvo AI ومرخصيها. الخدمة محمية بموجب قوانين حقوق النشر والعلامات التجارية والقوانين الأخرى في المملكة العربية السعودية والدول الأخرى."
        },
        {
          title: "7. حدود المسؤولية والتعويض",
          content: "إخلاء المسؤولية عن الضمانات: نحن نقدم خدماتنا 'كما هي' و'كما هي متاحة' دون أي تمثيل أو ضمانات أو شروط من أي نوع، سواء كانت صريحة أو ضمنية.\n\nتحديد المسؤولية: بأي حال من الأحوال، لن يتحمل مسؤولو Morvo AI أو مديروها أو موظفوها أو الشركات التابعة لها المسؤولية عن أي إصابة أو خسارة أو مطالبة.\n\nالتعويض: أنت توافق على تعويض Morvo AI والدفاع عنها وحمايتها من وضد أي وجميع المطالبات والأضرار."
        },
        {
          title: "8. الاسترجاع",
          content: "السياسة العامة: يمكن النظر في طلبات استرجاع المبالغ المدفوعة للاشتراكات الجديدة خلال مدة محددة، عادة ما تكون (7 إلى 14) يومًا من تاريخ الدفع الأولي.\n\nالمراجعة والقرار: تتم مراجعة كل طلب استرجاع على حدة. نحتفظ بالحق في رفض أي طلب استرجاع لا يفي بشروطنا.\n\nالاستثناءات: لا يتم تقديم المبالغ المستردة للاشتراكات التي تم تجديدها، أو لفترات الاشتراك الجزئية، أو للخدمات التي تم استخدامها."
        },
        {
          title: "9. أحكام عامة",
          content: "القانون الحاكم وحل النزاعات: تخضع هذه الشروط والأحكام وتُفسر وفقًا لقوانين المملكة العربية السعودية. في حال نشوء أي نزاع، يجب السعي لحله وديًا أولاً.\n\nقابلية الفصل: إذا اعتبرت المحكمة أن أي حكم من هذه الشروط غير صالح أو غير قابل للتنفيذ، فستظل الأحكام المتبقية من هذه الشروط سارية المفعول بالكامل.\n\nالتعديلات: نحتفظ بالحق، وفقًا لتقديرنا الخاص، في تعديل أو استبدال هذه الشروط في أي وقت.\n\nالتواصل: إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر البريد الإلكتروني: info@morvo.ai."
        }
      ]
    },
    en: {
      title: "Terms & Conditions for Morvo AI",
      lastUpdated: "Last updated: June 2025",
      sections: [
        {
          title: "1. Introduction",
          content: "Welcome to the Morvo AI platform. These Terms and Conditions ('Terms') fully govern your use or visit to our platform, and benefit from all products, features and tools we provide ('Service' or 'our services'). These services are owned and managed by Morvo AI ('we', 'us').\n\nYour use of our services is conditional upon your acceptance of these Terms and full compliance with them. These Terms apply to all visitors, users and any other party who accesses or uses the Service. By accessing or using our services, you expressly confirm your agreement to comply with these Terms and our Privacy Policy, which is an integral part of this agreement."
        },
        {
          title: "2. Accounts",
          content: "Account Creation: To fully benefit from our services, you must create an account. You undertake to provide accurate, complete and updated information at all times when registering.\n\nLegal Eligibility: You acknowledge that you are at least (18) eighteen years old or have reached the legal age of majority in your country.\n\nAccount Security: You are solely responsible for protecting the password you use to access the Service and for any activities or actions that occur under your password."
        },
        {
          title: "3. Payments and Subscriptions",
          content: "Fees: Using some of our services may require paying monthly or annual subscription fees ('Fees'). You expressly authorize us to collect these fees and any applicable taxes (such as VAT) through the payment method you specify to us upon registration.\n\nBilling Cycle and Auto-Renewal: Subscription fees are paid in advance. Your subscription will automatically renew at the end of each billing period (monthly or annual).\n\nNon-Refundability: To the fullest extent permitted by applicable law, all payments are non-refundable."
        },
        {
          title: "4. Your Content",
          content: "Content Responsibility: Our service allows you to post, upload, store and share information, data, text, graphics, videos and other materials ('Content'). You are fully responsible for any content you post on the Service.\n\nUsage License: By posting Content, you grant Morvo AI a worldwide, non-exclusive, royalty-free, sublicensable right to use, host, copy, distribute, modify, display and perform your Content."
        },
        {
          title: "5. Account Termination",
          content: "Termination by Morvo AI: We may suspend or terminate your account and stop providing you with services immediately and without prior notice or liability, for any reason whatsoever.\n\nTermination by You: You can cancel your account at any time by following the instructions on the platform or by contacting our support team.\n\nEffect of Termination: Upon termination of your account, your right to use the Service stops immediately."
        },
        {
          title: "6. Intellectual Property",
          content: "The Service and all of its original content (except user-provided content), including text, graphics, data, logos, images, software, videos, designs, features and functionality, are and will remain the exclusive property of Morvo AI and its licensors. The Service is protected under copyright, trademark and other laws in Saudi Arabia and other countries."
        },
        {
          title: "7. Liability Limitations and Indemnification",
          content: "Disclaimer of Warranties: We provide our services 'as is' and 'as available' without any representations, warranties or conditions of any kind, whether express or implied.\n\nLimitation of Liability: Under no circumstances shall Morvo AI's officers, directors, employees or affiliates be liable for any injury, loss or claim.\n\nIndemnification: You agree to indemnify, defend and hold harmless Morvo AI against any and all claims and damages."
        },
        {
          title: "8. Refunds",
          content: "General Policy: Refund requests for new subscriptions can be considered within a specified period, usually (7 to 14) days from the initial payment date.\n\nReview and Decision: Each refund request is reviewed individually. We reserve the right to refuse any refund request that does not meet our terms.\n\nExceptions: No refunds are provided for renewed subscriptions, partial subscription periods, or services that have been used."
        },
        {
          title: "9. General Provisions",
          content: "Governing Law and Dispute Resolution: These Terms and Conditions are governed by and construed in accordance with the laws of Saudi Arabia. In the event of any dispute, an amicable resolution must first be sought.\n\nSeverability: If a court finds any provision of these Terms invalid or unenforceable, the remaining provisions of these Terms shall remain in full force and effect.\n\nModifications: We reserve the right, at our sole discretion, to modify or replace these Terms at any time.\n\nContact: If you have any questions about these Terms, please contact us via email: info@morvo.ai."
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

export default Terms;
