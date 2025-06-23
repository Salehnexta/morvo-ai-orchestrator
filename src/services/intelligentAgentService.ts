
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

      // Analyze message intent
      const intent = this.analyzeMessageIntent(message);
      
      // Generate response based on profile and intent
      return this.generateProfileAwareResponse(profile, message, intent, conversationHistory);
    } catch (error) {
      console.error('❌ Error generating contextual response:', error);
      return this.getDefaultWelcomeMessage();
    }
  }

  // Analyze what the user is asking about
  private static analyzeMessageIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل') || lowerMessage.includes('سيو')) {
      return 'website_analysis';
    }
    if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشور') || lowerMessage.includes('كتابة')) {
      return 'content_creation';
    }
    if (lowerMessage.includes('حملة') || lowerMessage.includes('إعلان') || lowerMessage.includes('تسويق')) {
      return 'marketing_campaign';
    }
    if (lowerMessage.includes('منافس') || lowerMessage.includes('مقارنة')) {
      return 'competitor_analysis';
    }
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام') || lowerMessage.includes('اهلا')) {
      return 'greeting';
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
    const companyName = profile.company_name || 'صديقي';
    const industry = profile.industry;
    const hasWebsite = profile.website_url;
    const hasAnalysis = profile.seo_data && profile.last_seo_update;

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
      
      default:
        return this.generateGeneralResponse(greeting, companyName, profile, message);
    }
  }

  private static generateGreetingResponse(greeting: string, companyName: string, profile: UserProfile): string {
    const setupStatus = profile.profile_setup_completed ? 'مكتمل' : 'يحتاج تحديث';
    
    return `مرحباً ${greeting} ${companyName}! 🌟

أنا مورفو - مساعدك الذكي للتسويق الرقمي، ومتطور بـ GPT-4o لأخدمك بأفضل طريقة 🤖

**حالة ملفك الشخصي:** ${setupStatus} ✅

${profile.profile_setup_completed ? 
  `**شركتك:** ${profile.company_name || 'غير محدد'}
**المجال:** ${profile.industry || 'غير محدد'}
**الموقع:** ${profile.website_url ? '✅ محلل' : '❌ غير مضاف'}

**كيف يمكنني مساعدتك اليوم؟**
• تحليل أداء موقعك 📊
• استراتيجيات تسويقية مخصصة 🎯
• إنشاء محتوى جذاب ✨
• تحليل المنافسين 🔍` :
  `لإكمال إعداد ملفك الشخصي، أحتاج:
• اسم شركتك 🏢
• مجال عملك 💼
• موقعك الإلكتروني 🌐`}

اكتب لي ما تريد وسأساعدك خطوة بخطوة! 💪`;
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

لم تضع رابط موقعك بعد. شاركني رابط موقعك وسأقوم بتحليل شامل يشمل:

**📊 تحليل تقني متكامل:**
• سرعة الموقع وأداءه ⚡
• تحسين محركات البحث (SEO) 🔍
• تجربة المستخدم على الجوال 📱
• الأمان والشهادات 🔒

**🎯 تحليل تسويقي:**
• الكلمات المفتاحية المناسبة لمجال ${profile.industry || 'عملك'}
• تحليل المنافسين 🏆
• فرص التحسين والنمو 📈

أرسل لي رابط موقعك الآن! 🚀`;
    }

    if (hasAnalysis) {
      return `${greeting} ${companyName}! 📊

لقد حللت موقعك ${hasWebsite} مسبقاً وحفظت النتائج! ✅

**آخر تحليل:** ${profile.last_seo_update ? new Date(profile.last_seo_update).toLocaleDateString('ar-SA') : 'حديث'}

**هل تريد:**
• مراجعة نتائج التحليل الحالي 📋
• تحديث التحليل مع بيانات جديدة 🔄
• خطة عمل مخصصة لتحسين موقعك 📈
• مقارنة مع المنافسين في مجال ${profile.industry} 🔍

اختر ما يناسبك وسأبدأ فوراً! 🚀`;
    }

    return `${greeting} ${companyName}! 🔍

موقعك ${hasWebsite} مُسجل في النظام، لكن التحليل لم يكتمل بعد.

**سأبدأ التحليل الآن ويشمل:**
• الأداء التقني والسرعة ⚡
• تحسين محركات البحث 🔍
• الكلمات المفتاحية لمجال ${profile.industry} 🎯
• تحليل المنافسين 📊

**⏱️ سيستغرق التحليل دقائق قليلة...**

في هذه الأثناء، هل لديك أسئلة حول استراتيجية التسويق لشركتك؟ 💡`;
  }

  private static generateContentCreationResponse(greeting: string, companyName: string, industry: string | null | undefined, profile: UserProfile): string {
    const industryContext = industry ? `في مجال ${industry}` : '';
    
    return `${greeting} ${companyName}! ✨

أقدر أساعدك في إنشاء محتوى جذاب ${industryContext}:

**📝 أنواع المحتوى المتاحة:**
• منشورات وسائل التواصل 📱
• مقالات المدونة المتخصصة 📰
• محتوى إعلاني مقنع 🎯
• رسائل البريد الإلكتروني 📧

**🎨 مميز حسب:**
• جمهورك المستهدف: ${profile.target_market || 'عام'}
• ميزانيتك: ${profile.monthly_marketing_budget || 'حسب الحاجة'}
• أهدافك التسويقية

**ما نوع المحتوى اللي تبي تبدأ فيه؟** 🤔

اكتب لي الفكرة وسأحضر لك محتوى احترافي جاهز للنشر! 🚀`;
  }

  private static generateMarketingCampaignResponse(greeting: string, companyName: string, industry: string | null | undefined, profile: UserProfile): string {
    return `${greeting} ${companyName}! 🎯

سأساعدك في تصميم حملة تسويقية ناجحة ${industry ? `لمجال ${industry}` : ''}:

**📊 استراتيجية مخصصة تشمل:**
• تحديد الجمهور المستهدف 👥
• اختيار القنوات المناسبة 📱
• المحتوى والرسائل الإعلانية ✍️
• الميزانية المثلى: ${profile.monthly_marketing_budget || 'حسب أهدافك'}

**🎨 أنواع الحملات:**
• حملات السوشيال ميديا 📱
• إعلانات جوجل 🔍
• التسويق بالمحتوى 📝
• حملات البريد الإلكتروني 📧

**أخبرني:**
• ما هو هدفك الأساسي؟ (زيادة مبيعات، توعية بالعلامة التجارية، جذب عملاء جدد)
• ما هي ميزانيتك الشهرية؟
• أي منصة تفضل التركيز عليها؟

يلا نبدأ! 🚀`;
  }

  private static generateCompetitorAnalysisResponse(greeting: string, companyName: string, industry: string | null | undefined, profile: UserProfile): string {
    return `${greeting} ${companyName}! 🔍

تحليل المنافسين مهم جداً لنجاح استراتيجيتك ${industry ? `في مجال ${industry}` : ''}!

**📊 سأحلل لك:**
• أقوى منافسينك في السوق 🏆
• استراتيجياتهم التسويقية 📈
• نقاط قوتهم وضعفهم ⚖️
• الفرص المتاحة لك 💡

**🎯 النتائج ستشمل:**
• مقارنة المواقع الإلكترونية 🌐
• تحليل المحتوى والرسائل 📝
• أداء السوشيال ميديا 📱
• الكلمات المفتاحية المشتركة 🔑

${profile.website_url ? 
  `سأبدأ التحليل باستخدام موقعك: ${profile.website_url}` :
  'شاركني رابط موقعك لتحليل أدق'}

**اكتب أسماء منافسينك الرئيسيين أو دعني أكتشفهم تلقائياً! 🚀**`;
  }

  private static generateGeneralResponse(greeting: string, companyName: string, profile: UserProfile, message: string): string {
    return `${greeting} ${companyName}! 🤝

شكراً لثقتك في مورفو! أنا هنا لمساعدتك في كل ما يخص التسويق الرقمي.

**بناءً على ملفك الشخصي:**
• شركتك: ${profile.company_name || 'غير محدد'}
• المجال: ${profile.industry || 'غير محدد'}
• الخبرة التسويقية: ${profile.marketing_experience || 'غير محدد'}

**يمكنني مساعدتك في:**
• تحليل موقعك والمنافسين 📊
• استراتيجيات تسويقية مخصصة 🎯
• إنشاء محتوى احترافي ✨
• حملات إعلانية مدروسة 📱

هل يمكنك توضيح طلبك أكثر؟ أو اختر مما سبق وسأبدأ فوراً! 🚀`;
  }

  private static getDefaultWelcomeMessage(): string {
    return `مرحباً بك في مورفو! 🌟

أنا مساعدك الذكي للتسويق الرقمي المطور بـ GPT-4o 🤖

لأقدم لك خدمة مخصصة، دعني أتعرف عليك أولاً:

**أحتاج معرفة:**
• اسم شركتك أو مشروعك 🏢
• مجال عملك 💼
• رابط موقعك الإلكتروني 🌐

ابدأ بمشاركة هذه المعلومات وسأساعدك في بناء استراتيجية تسويقية ناجحة! 🚀`;
  }
}
