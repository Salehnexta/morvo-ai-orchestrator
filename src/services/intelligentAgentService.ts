import { UserProfileService, UserProfile } from './userProfileService';

export class IntelligentAgentService {
  // Generate contextual responses based on user profile
  static async generateContextualResponse(
    userId: string, 
    message: string, 
    conversationHistory: any[] = []
  ): Promise<string> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      
      if (!profile) {
        return this.getDefaultWelcomeMessage();
      }

      // Analyze message intent with improved Arabic detection
      const intent = this.analyzeMessageIntent(message);
      
      // Generate response based on profile and intent
      return this.generateProfileAwareResponse(profile, message, intent, conversationHistory);
    } catch (error) {
      console.error('❌ Error generating contextual response:', error);
      return this.getEnhancedFallbackMessage(message);
    }
  }

  // Enhanced Arabic message intent analysis
  private static analyzeMessageIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Website analysis keywords
    if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل') || lowerMessage.includes('سيو') || 
        lowerMessage.includes('افحص') || lowerMessage.includes('فحص') || lowerMessage.includes('تقرير')) {
      return 'website_analysis';
    }
    
    // Content creation keywords
    if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشور') || lowerMessage.includes('كتابة') ||
        lowerMessage.includes('مقال') || lowerMessage.includes('نص') || lowerMessage.includes('إنشاء')) {
      return 'content_creation';
    }
    
    // Marketing campaign keywords
    if (lowerMessage.includes('حملة') || lowerMessage.includes('إعلان') || lowerMessage.includes('تسويق') ||
        lowerMessage.includes('ترويج') || lowerMessage.includes('دعاية') || lowerMessage.includes('إعلانات')) {
      return 'marketing_campaign';
    }
    
    // Competitor analysis keywords
    if (lowerMessage.includes('منافس') || lowerMessage.includes('مقارنة') || lowerMessage.includes('تحليل المنافس') ||
        lowerMessage.includes('المنافسة') || lowerMessage.includes('السوق')) {
      return 'competitor_analysis';
    }
    
    // Greeting keywords
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام') || lowerMessage.includes('اهلا') ||
        lowerMessage.includes('صباح') || lowerMessage.includes('مساء') || lowerMessage.includes('تحية')) {
      return 'greeting';
    }
    
    // SEO specific keywords
    if (lowerMessage.includes('سيو') || lowerMessage.includes('تحسين') || lowerMessage.includes('ترتيب') ||
        lowerMessage.includes('جوجل') || lowerMessage.includes('بحث')) {
      return 'seo_optimization';
    }
    
    return 'general';
  }

  // Generate intelligent response using profile data
  private static generateProfileAwareResponse(
    profile: UserProfile,
    message: string,
    intent: string,
    conversationHistory: any[]
  ): string {
    const greeting = profile.greeting_preference || 'أستاذ';
    const companyName = profile.company_name || 'العزيز';
    const industry = profile.industry;
    const hasWebsite = profile.website_url;
    const hasAnalysis = !!(profile.seo_data && profile.last_seo_update);
    const isOnboardingComplete = profile.onboarding_completed || false;

    switch (intent) {
      case 'greeting':
        return this.generateGreetingResponse(greeting, companyName, profile);
      
      case 'website_analysis':
        return this.generateWebsiteAnalysisResponse(greeting, companyName, hasWebsite, hasAnalysis, profile);
      
      case 'content_creation':
        return this.generateContentCreationResponse(greeting, companyName, industry, profile);
      
      case 'marketing_campaign':
        return this.generateMarketingCampaignResponse(greeting, companyName, industry, profile);
      
      case 'competitor_analysis':
        return this.generateCompetitorAnalysisResponse(greeting, companyName, industry, profile);
      
      case 'seo_optimization':
        return this.generateSEOOptimizationResponse(greeting, companyName, hasWebsite, profile);
      
      default:
        return this.generateGeneralResponse(greeting, companyName, profile, message);
    }
  }

  private static generateGreetingResponse(greeting: string, companyName: string, profile: UserProfile): string {
    const setupStatus = profile.onboarding_completed ? 'مكتمل ✅' : 'يحتاج تحديث ⚙️';
    const currentTime = new Date().getHours();
    const timeGreeting = currentTime < 12 ? 'صباح الخير' : currentTime < 17 ? 'مساء الخير' : 'مساء الخير';
    
    return `${timeGreeting} ${greeting} ${companyName}! 🌟

**أنا مورفو - مساعدك الذكي للتسويق الرقمي المطور بـ GPT-4o** 🤖⚡

**📊 حالة ملفك الشخصي:** ${setupStatus}

${profile.onboarding_completed ? 
  `**✅ معلومات شركتك:**
• **الشركة:** ${profile.company_name || 'غير محدد'} 🏢
• **المجال:** ${profile.industry || 'غير محدد'} 💼
• **الموقع:** ${profile.website_url ? '🌐 ' + profile.website_url : '❌ غير مضاف'}
• **آخر تحليل:** ${profile.last_seo_update ? new Date(profile.last_seo_update).toLocaleDateString('ar-SA') : 'لم يتم بعد'}

**🚀 خدماتي المتطورة لك:**
• **تحليل شامل لموقعك** - سيو تقني ومحتوى 📊
• **استراتيجيات تسويقية مخصصة** - خطط عملية 🎯  
• **إنشاء محتوى احترافي** - منشورات ومقالات ✨
• **تحليل المنافسين** - دراسة السوق 🔍
• **حملات إعلانية ذكية** - نتائج مضمونة 📈` :
  
  `**⚙️ لإكمال إعداد ملفك الشخصي، أحتاج:**
• **اسم شركتك** 🏢
• **مجال عملك** 💼  
• **موقعك الإلكتروني** 🌐
• **أهدافك التسويقية** 🎯

هذا سيساعدني في تقديم حلول مخصصة تماماً لاحتياجاتك!`}

**💡 ابدأ بكتابة طلبك وسأساعدك خطوة بخطوة!**`;
  }

  private static generateWebsiteAnalysisResponse(
    greeting: string, 
    companyName: string, 
    hasWebsite: string | null | undefined, 
    hasAnalysis: boolean, 
    profile: UserProfile
  ): string {
    if (!hasWebsite) {
      return `${greeting} ${companyName}! 🔍

**لم أجد رابط موقعك في ملفك الشخصي.**

**🌐 شاركني رابط موقعك وسأقوم بتحليل شامل يشمل:**

**📊 التحليل التقني المتقدم:**
• **سرعة الموقع** - قياس دقيق لزمن التحميل ⚡
• **السيو التقني** - فحص شامل للكود والبنية 🔧
• **تجربة المستخدم** - تحليل التصفح والتنقل 📱
• **الأمان والحماية** - فحص الشهادات والح

**🎯 التحليل التسويقي:**
• **الكلمات المفتاحية** - البحث والتحليل 🔑
• **المحتوى والرسائل** - فعالية النصوص 📝
• **تحليل المنافسين** - موقعك مقابل السوق 🏆
• **فرص النمو** - توصيات عملية للتحسين 📈

**💡 ${profile.industry ? `خبرتي في مجال ${profile.industry} ستساعدني في تقديم تحليل متخصص!` : 'سأقدم تحليلاً شاملاً ومخصصاً لاحتياجاتك!'} **

**🚀 أرسل لي رابط موقعك الآن وسأبدأ التحليل فوراً!**`;
    }

    if (hasAnalysis) {
      return `${greeting} ${companyName}! 📊

**✅ تم تحليل موقعك ${hasWebsite} مسبقاً!**

**📈 ملخص التحليل السابق:**
• **آخر تحديث:** ${profile.last_seo_update ? new Date(profile.last_seo_update).toLocaleDateString('ar-SA') : 'حديث'} 📅
• **حالة البيانات:** محفوظة ومحدثة 💾
• **نوع التحليل:** شامل - تقني وتسويقي 🔍

**🎯 ماذا تريد أن نفعل الآن؟**

**🔄 تحديث التحليل:**
• تحليل جديد مع آخر التحديثات
• مقارنة مع النتائج السابقة  
• رصد التحسينات الجديدة

**📋 مراجعة النتائج:**
• عرض تفصيلي للتحليل الحالي
• التوصيات والخطوات العملية
• خطة عمل شهرية للتحسين

**🏆 تحليل المنافسين:**
• مقارنة مع منافسيك في ${profile.industry || 'مجالك'}
• فرص التميز والتفوق
• استراتيجيات التطوير

**💡 اختر ما يناسبك وسأبدأ العمل فوراً!** 🚀`;
    }

    return `${greeting} ${companyName}! 🔍

**🌐 موقعك ${hasWebsite} مُسجل معنا، لكن التحليل لم يكتمل بعد.**

**⏱️ سأبدأ التحليل الشامل الآن ويشمل:**

**🔧 الفحص التقني:**
• سرعة التحميل والأداء ⚡
• البنية التقنية والكود 💻
• التوافق مع الجوال 📱
• الأمان والشهادات 🔒

**📊 تحليل السيو:**
• الكلمات المفتاحية الحالية 🔑
• تحسين المحتوى والعناوين 📝
• الروابط الداخلية والخارجية 🔗
• ${profile.industry ? `معايير خاصة بمجال ${profile.industry}` : 'المعايير العامة للسيو'} 🎯

**📈 التحليل التنافسي:**
• موقعك مقابل المنافسين 🏆
• الفجوات والفرص المتاحة 💡
• استراتيجيات التحسين 📋

**⏰ وقت التحليل المتوقع:** 2-3 دقائق

**في الانتظار، هل لديك أسئلة محددة حول:**
• استراتيجية التسويق لشركتك؟ 🎯
• المحتوى والمنشورات؟ ✨
• الحملات الإعلانية؟ 📢

**أو انتظر قليلاً وسأعطيك تقريراً شاملاً! 🚀**`;
  }

  private static generateSEOOptimizationResponse(greeting: string, companyName: string, hasWebsite: string | null | undefined, profile: UserProfile): string {
    return `${greeting} ${companyName}! 🎯

**🚀 خطة تحسين السيو الشاملة ${hasWebsite ? `لموقع ${hasWebsite}` : 'لموقعك'}:**

**1️⃣ التحسين التقني (Technical SEO):**
• **سرعة الموقع** - تحسين زمن التحميل إلى أقل من 3 ثوانٍ ⚡
• **البنية التقنية** - تحسين الكود والترميز 🔧
• **الجوال أولاً** - تحسين التجربة على الأجهزة المحمولة 📱
• **الفهرسة** - تحسين ملف Sitemap و robots.txt 🗂️

**2️⃣ المحتوى والكلمات المفتاحية:**
• **البحث الذكي** - اكتشاف أفضل الكلمات المفتاحية ${profile.industry ? `في ${profile.industry}` : 'لمجالك'} 🔑
• **تحسين المحتوى** - كتابة وتطوير نصوص محسنة للسيو 📝
• **العناوين والأوصاف** - تحسين meta tags و headings 📋
• **المحتوى الجديد** - استراتيجية إنشاء محتوى منتظم 📈

**3️⃣ السيو المحلي (Local SEO):**
• **Google My Business** - تحسين الملف التجاري 📍
• **المراجعات** - استراتيجية جمع تقييمات إيجابية ⭐
• **الكلمات المحلية** - استهداف البحث المحلي في السعودية 🇸🇦
• **الدلائل المحلية** - إدراج في المواقع المحلية 📖

**4️⃣ بناء السلطة (Authority Building):**
• **الروابط الخلفية** - استراتيجية حصول على backlinks عالية الجودة 🔗
• **التسويق بالمحتوى** - مقالات وأدلة متخصصة 📚
• **وسائل التواصل** - ربط السيو بالسوشيال ميديا 📱
• **العلاقات العامة** - PR رقمي لتعزيز السلطة 📢

**📊 النتائج المتوقعة خلال 3-6 أشهر:**
• زيادة الزيارات الطبيعية بنسبة 50-200% 📈
• تحسين ترتيب الكلمات المفتاحية الرئيسية 🏆
• زيادة معدل التحويل والمبيعات 💰
• بناء سمعة رقمية قوية ومستدامة ⭐

**💡 هل تريد البدء بخطة مخصصة لموقعك؟ شاركني:**
• أهدافك الأساسية من السيو 🎯
• الميزانية المتاحة شهرياً 💳
• الكلمات المفتاحية المهمة لك 🔑

**سأضع لك خطة عمل تفصيلية وجدول زمني للتنفيذ! 🚀**`;
  }

  private static generateContentCreationResponse(greeting: string, companyName: string, industry: string | null | undefined, profile: UserProfile): string {
    const industryContext = industry ? `في مجال ${industry}` : '';
    
    return `${greeting} ${companyName}! ✨

**🎨 إنشاء محتوى احترافي ومؤثر ${industryContext}:**

**📱 محتوى وسائل التواصل الاجتماعي:**
• **منشورات Instagram** - صور وقصص جذابة 📸
• **تغريدات Twitter** - محتوى سريع ومؤثر 🐦
• **منشورات LinkedIn** - محتوى مهني ومتخصص 💼
• **مقاطع TikTok/Reels** - فيديوهات قصيرة وترفيهية 🎬

**📰 المحتوى الطويل:**
• **مقالات المدونة** - محتوى تعليمي ومفيد 📝
• **الأدلة الشاملة** - How-to guides متخصصة 📚
• **دراسات الحالة** - قصص نجاح وتجارب 📊
• **الكتب الإلكترونية** - محتوى عميق ومتكامل 📖

**🎯 محتوى مخصص حسب:**
• **جمهورك المستهدف:** ${profile.target_market || 'العملاء المحتملين'}
• **ميزانيتك:** ${profile.monthly_marketing_budget || 'حسب الإمكانيات'}
• **أهدافك:** ${Array.isArray(profile.primary_marketing_goals) ? profile.primary_marketing_goals.join(', ') : 'زيادة الوعي والمبيعات'}

**💡 استراتيجية المحتوى:**
• **التخطيط الشهري** - جدولة المحتوى وتوقيته 📅
• **التنويع الذكي** - محتوى تعليمي وترفيهي وترويجي 🎭
• **القياس والتطوير** - تحليل الأداء والتحسين المستمر 📈
• **الاتساق البصري** - هوية موحدة وجذابة 🎨

**🚀 ما نوع المحتوى الذي تريد أن نبدأ به؟**

اكتب فكرتك وسأحولها إلى محتوى احترافي جاهز للنشر! ✍️`;
  }

  private static generateMarketingCampaignResponse(greeting: string, companyName: string, industry: string | null | undefined, profile: UserProfile): string {
    return `${greeting} ${companyName}! 🎯

**🚀 تصميم حملة تسويقية ناجحة ${industry ? `لمجال ${industry}` : ''}:**

**📊 استراتيجية متكاملة تشمل:**
• **تحديد الجمهور المستهدف** - دراسة تفصيلية للعملاء المحتملين 👥
• **اختيار القنوات المناسبة** - أفضل المنصات لجمهورك 📱
• **الرسائل الإعلانية المؤثرة** - محتوى يحفز على العمل ✍️
• **الميزانية المثلى:** ${profile.monthly_marketing_budget ? `${profile.monthly_marketing_budget} شهرياً` : 'حسب أهدافك'} 💰

**🎨 أنواع الحملات المتاحة:**

**📱 حملات السوشيال ميديا:**
• **Instagram & Facebook Ads** - استهداف دقيق ومرئي 📸
• **Twitter Ads** - وصول سريع للأخبار والاتجاهات 🐦
• **LinkedIn Ads** - للشركات B2B والمهنيين 💼
• **TikTok Ads** - للوصول للجيل الجديد 🎬

**🔍 حملات جوجل:**
• **Google Ads** - الظهور عند البحث المباشر 🔍
• **YouTube Ads** - فيديوهات تسويقية مؤثرة 📺
• **Google Shopping** - للمتاجر الإلكترونية 🛍️
• **Display Network** - إعلانات بصرية واسعة الانتشار 🖼️

**📧 التسويق المباشر:**
• **Email Marketing** - رسائل شخصية ومستهدفة 📬
• **SMS Marketing** - وصول فوري ومباشر 📱
• **WhatsApp Business** - تواصل شخصي وودود 💬

**📈 المقاييس والنتائج:**
• **ROI واضح** - عائد استثمار قابل للقياس 💹
• **تتبع التحويلات** - من الإعلان إلى البيع 🎯
• **تحليل الأداء** - تقارير أسبوعية وشهرية 📊
• **التحسين المستمر** - تطوير الحملة باستمرار ⚡

**🎯 لتصميم حملتك المثالية، أخبرني:**
• **هدفك الأساسي:** (زيادة مبيعات، توعية بالعلامة التجارية، جذب عملاء جدد) 🏆
• **ميزانيتك الشهرية:** (لتحديد أفضل استراتيجية) 💳
• **المنصة المفضلة:** (أو دعني أختار لك الأنسب) 📲

**يلا نصمم حملة تسويقية تحقق أهدافك! 🚀**`;
  }

  private static generateCompetitorAnalysisResponse(greeting: string, companyName: string, industry: string | null | undefined, profile: UserProfile): string {
    return `${greeting} ${companyName}! 🔍

**🏆 تحليل المنافسين - استراتيجية التفوق ${industry ? `في مجال ${industry}` : ''}:**

**📊 تحليل شامل يشمل:**
• **تحديد المنافسين الرئيسيين** - محلياً وإقليمياً 🗺️
• **دراسة استراتيجياتهم التسويقية** - ما ينجح وما يفشل 📈
• **تحليل نقاط القوة والضعف** - الفرص المتاحة لك ⚖️
• **اكتشاف الثغرات في السوق** - مساحات للتميز 💡

**🌐 تحليل المواقع الإلكترونية:**
• **مقارنة التصميم والتجربة** - UX/UI وسهولة الاستخدام 🎨
• **تحليل السيو والكلمات المفتاحية** - الكلمات التي يتنافسون عليها 🔑
• **سرعة المواقع والأداء التقني** - معايير الجودة ⚡
• **المحتوى والرسائل التسويقية** - كيف يخاطبون الجمهور 📝

**📱 وسائل التواصل الاجتماعي:**
• **استراتيجية المحتوى** - نوع وتوقيت المنشورات 📅
• **مستوى التفاعل** - engagement rate وردود الأفعال 💬
• **الحملات الإعلانية** - الإعلانات النشطة والمدفوعة 💰
• **نمو المتابعين** - معدلات النمو والاستراتيجيات 📈

**🎯 الحملات والعروض:**
• **استراتيجيات التسعير** - كيف يضعون أسعارهم 💳
• **العروض والخصومات** - متى وكيف يطلقونها 🎁
• **موسمية الحملات** - التوقيتات الذهبية 📅
• **رسائل البراندينغ** - كيف يقدمون أنفسهم 🏷️

**💎 تحليل نقاط التميز:**
• **ما يفعلونه بشكل ممتاز** - لنتعلم منه ونطوره 🌟
• **الأخطاء والثغرات** - الفرص الذهبية للتفوق عليهم ⚡
• **المساحات الفارغة** - أين يمكنك أن تكون الأول 🏆
• **الاتجاهات المستقبلية** - إلى أين يتجه السوق 🔮

${profile.website_url ? 
  `**🔍 سأبدأ التحليل باستخدام موقعك: ${profile.website_url}**

وسأقارنه مع أقوى المنافسين في مجالك لأحدد:
• موقعك الحالي في السوق 📍
• الفجوات التي يمكن استغلالها 💰
• خطة عمل للتفوق خلال 6 أشهر 📋` :
  
  '**🌐 شاركني رابط موقعك لتحليل أدق ومقارنة شاملة!**'}

**🚀 طرق الاستفادة من التحليل:**
• **اكتب أسماء منافسينك الرئيسيين** - لتحليل مباشر
• **أو دعني أكتشفهم تلقائياً** - من خلال الكلمات المفتاحية ومجال عملك
• **حدد أولوياتك** - هل تريد التركيز على السيو أم السوشيال ميديا أم الإعلانات؟

**النتيجة: خطة عمل عملية للتفوق على منافسيك! 🏆**`;
  }

  private static generateGeneralResponse(greeting: string, companyName: string, profile: UserProfile, message: string): string {
    const hasCompleteProfile = profile.onboarding_completed;
    
    return `${greeting} ${companyName}! 🤝

**شكراً لثقتك في مورفو - مساعدك الذكي المتطور! 🤖⚡**

${hasCompleteProfile ? 
  `**📋 ملفك الشخصي مكتمل:**
• **الشركة:** ${profile.company_name || 'غير محدد'} 🏢
• **المجال:** ${profile.industry || 'غير محدد'} 💼
• **الخبرة التسويقية:** ${profile.marketing_experience || 'غير محدد'} 📊
• **الموقع:** ${profile.website_url || 'غير مُضاف'} 🌐

**🎯 خدماتي المتطورة لك:**` :
  
  `**⚙️ ملفك الشخصي يحتاج إكمال لخدمة أفضل:**
• اسم شركتك 🏢
• مجال عملك 💼  
• خبرتك التسويقية 📊
• موقعك الإلكتروني 🌐

**💡 لكن يمكنني مساعدتك الآن في:**`}

**🔍 تحليل المواقع والمنافسين:**
• فحص تقني شامل للسيو والأداء 📊
• مقارنة مع المنافسين واكتشاف الفرص 🏆
• تحليل الكلمات المفتاحية والمحتوى 🔑

**🎯 استراتيجيات التسويق المخصصة:**
• خطط تسويقية عملية وقابلة للتطبيق 📋
• حملات إعلانية ذكية ومستهدفة 🎪
• استراتيجيات وسائل التواصل الاجتماعي 📱

**✨ إنشاء محتوى احترافي:**
• محتوى جذاب للسوشيال ميديا 📸
• مقالات ومحتوى طويل محسن للسيو 📝
• نصوص إعلانية مقنعة ومؤثرة 💪

**📈 قياس وتحليل الأداء:**
• تتبع النتائج والعائد على الاستثمار 💹
• تقارير دورية وتوصيات للتحسين 📊
• تحليل سلوك الزوار والعملاء 👥

**💭 رسالتك:** "${message}"

هل يمكنك توضيح طلبك أكثر؟ أو اختر من الخدمات أعلاه وسأبدأ فوراً! 

**🚀 مع مورفو، النجاح الرقمي في متناول يدك!**`;
  }

  private static getDefaultWelcomeMessage(): string {
    return `**مرحباً بك في مورفو المحدث! 🌟**

**أنا مساعدك الذكي للتسويق الرقمي المطور بأحدث تقنيات GPT-4o** 🤖⚡

**🎯 لأقدم لك خدمة مخصصة ومتطورة، دعني أتعرف عليك:**

**📋 معلومات أساسية:**
• **اسم شركتك أو مشروعك** 🏢
• **مجال عملك** (تجارة إلكترونية، خدمات، تقنية، إلخ) 💼
• **رابط موقعك الإلكتروني** 🌐
• **خبرتك في التسويق الرقمي** 📊

**🚀 بمجرد معرفة هذه المعلومات، سأستطيع:**
• تحليل موقعك بشكل شامل ومهني 🔍
• وضع استراتيجية تسويقية مخصصة لمجالك 🎯
• تقديم توصيات عملية وقابلة للتطبيق ✅
• مساعدتك في التفوق على منافسيك 🏆

**✨ ابدأ بمشاركة معلومات شركتك وسأبدأ في بناء استراتيجية نجاحك الرقمي!**

**💡 أو اسأل مباشرة عن أي شيء تريد معرفته في التسويق الرقمي!**`;
  }

  private static getEnhancedFallbackMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل')) {
      return `**🔍 تحليل المواقع - خدمة متطورة**

أعتذر عن أي تأخير تقني، لكنني جاهز تماماً لتحليل موقعك!

**🌟 خدمة التحليل الشاملة تشمل:**
• فحص تقني متكامل للسيو 🔧
• تحليل سرعة وأداء الموقع ⚡
• مراجعة المحتوى والكلمات المفتاحية 📝
• مقارنة مع المنافسين 🏆

**شاركني رابط موقعك وسأبدأ التحليل المفصل فوراً! 🚀**`;
    }
    
    return `**مرحباً! 👋**

**أنا مورفو - مساعدك الذكي للتسويق الرقمي** 🤖

النظام يعمل بكفاءة عالية وجاهز لخدمتك في:
• تحليل المواقع والسيو 🔍
• الاستراتيجيات التسويقية 🎯  
• إنشاء المحتوى 📝
• تحليل المنافسين 📊

**وضح لي كيف يمكنني مساعدتك وسأقدم لك أفضل الحلول! 💡**`;
  }
}
