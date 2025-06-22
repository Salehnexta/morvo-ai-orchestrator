
import { useJourney } from '@/contexts/JourneyContext';

export const useJourneyMessageHandler = () => {
  const { 
    isOnboardingComplete, 
    currentPhase, 
    setGreeting, 
    analyzeWebsite, 
    saveAnswer, 
    generateStrategy, 
    updateJourneyPhase 
  } = useJourney();

  const extractUrlFromMessage = (message: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;
    const matches = message.match(urlRegex);
    if (matches && matches.length > 0) {
      let url = matches[0];
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      return url;
    }
    return null;
  };

  const handleJourneySpecificMessage = async (message: string): Promise<string | null> => {
    if (isOnboardingComplete) return null;

    const cleanMessage = message.trim();

    switch (currentPhase) {
      case 'welcome':
      case 'greeting_preference':
        if (cleanMessage) {
          console.log('🔄 Saving greeting preference:', cleanMessage);
          const success = await setGreeting(cleanMessage);
          if (success) {
            console.log('✅ Greeting saved successfully, transitioning to website analysis');
            updateJourneyPhase('website_analysis');
            return `شكراً لك! سأناديك ${cleanMessage} من الآن فصاعداً.

الآن، لأتمكن من تقديم أفضل استراتيجية تسويقية لك، أحتاج لتحليل موقعك الإلكتروني أو نشاطك التجاري.

يرجى مشاركة رابط موقعك الإلكتروني معي.`;
          } else {
            return `حدث خطأ في حفظ تفضيلاتك. دعني أحاول مرة أخرى. كيف تفضل أن أناديك؟`;
          }
        }
        break;

      case 'website_analysis':
        if (cleanMessage.includes('http') || cleanMessage.includes('www') || cleanMessage.includes('.com') || cleanMessage.includes('.sa')) {
          const url = extractUrlFromMessage(cleanMessage);
          if (url) {
            console.log('🔄 Starting website analysis for:', url);
            const success = await analyzeWebsite(url);
            if (success) {
              updateJourneyPhase('analysis_review');
              return `ممتاز! بدأت في تحليل موقعك ${url} باستخدام الذكاء الاصطناعي المتقدم. 

سأقوم بتحليل:
• هيكل الموقع والمحتوى
• الكلمات المفتاحية المستخدمة  
• نقاط القوة والضعف
• الفرص التسويقية المتاحة

سيستغرق التحليل بضع دقائق. في غضون ذلك، دعني أسألك بعض الأسئلة الإضافية لأبني لك استراتيجية شاملة.

ما هو هدفك الأساسي من التسويق الرقمي؟
أ) زيادة الوعي بالعلامة التجارية
ب) توليد عملاء محتملين جدد
ج) زيادة المبيعات المباشرة
د) تحسين خدمة العملاء`;
            }
          }
        }
        return `يرجى مشاركة رابط موقعك الإلكتروني معي لأتمكن من تحليله. مثال: https://example.com`;

      case 'analysis_review':
      case 'profile_completion':
        if (cleanMessage) {
          console.log('🔄 Saving profile answer:', cleanMessage);
          const success = await saveAnswer('primary_goal', cleanMessage);
          if (success) {
            updateJourneyPhase('professional_analysis');
            return `شكراً لك على هذه المعلومة المهمة!

سؤال آخر: ما هي الميزانية الشهرية المخصصة للتسويق الرقمي؟
أ) أقل من 5,000 ريال
ب) 5,000 - 15,000 ريال  
ج) 15,000 - 50,000 ريال
د) أكثر من 50,000 ريال`;
          }
        }
        break;

      case 'professional_analysis':
        if (cleanMessage) {
          const success = await saveAnswer('marketing_budget', cleanMessage);
          if (success) {
            updateJourneyPhase('strategy_generation');
            return `ممتاز! الآن لدي فهم شامل عن نشاطك التجاري وأهدافك.

سأبدأ في إنشاء استراتيجية تسويقية مخصصة لك تتضمن:
• خطة المحتوى الشهرية
• استراتيجية السيو المحلي
• حملات التسويق المدفوعة
• جدولة المنشورات

هل تريد أن أبدأ في إنشاء الاستراتيجية الآن؟`;
          }
        }
        break;

      case 'strategy_generation':
        if (cleanMessage.includes('نعم') || cleanMessage.includes('ابدأ') || cleanMessage.includes('موافق')) {
          const strategy = await generateStrategy();
          if (strategy) {
            updateJourneyPhase('commitment_activation');
            return `🎯 تم إنشاء استراتيجيتك التسويقية المخصصة بنجاح!

استراتيجيتك تتضمن:
✅ خطة محتوى شهرية مدروسة
✅ كلمات مفتاحية محلية مستهدفة  
✅ جدولة منشورات أسبوعية
✅ حملات إعلانية محسنة
✅ تقارير أداء شهرية

هل أنت مستعد للالتزام بتنفيذ هذه الاستراتيجية؟`;
          }
        }
        break;
    }

    return null;
  };

  return { handleJourneySpecificMessage };
};
