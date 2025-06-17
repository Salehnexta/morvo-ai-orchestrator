import React, { useState, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  User,
  Rocket,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Clock,
  Award,
  Bot,
  Cpu,
  Network,
  Eye,
  CheckCircle,
  Crown,
  Flame,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatInterface } from "@/components/ChatInterface";

/**
 * Enhanced Marketing landing page – Morvo AI
 * --------------------------------------------------
 * ➜ Added modern animations and micro-interactions
 * ➜ Enhanced visual hierarchy and spacing
 * ➜ Added scroll-triggered animations
 * ➜ Improved accessibility and performance
 * ➜ Modern glassmorphism effects
 * ➜ AI-themed animations and particles
 * ➜ AI introduction animation with marketing message
 * ➜ Completely redesigned pricing section
 *
 * Author: Enhanced by Claude (2025)
 */

const content = {
  ar: {
    hero: {
      title: "مورفو إيه آي - مساعدك الذكي للمبيعات",
      subtitle: "احصل على 5 وكلاء ذكيين لزيادة مبيعاتك بنسبة 300% في 30 يوماً",
      description: "استخدم قوة الذكاء الاصطناعي لتحويل عملائك المحتملين إلى عملاء حقيقيين بطريقة آلية ومربحة",
      startButton: "ابدأ الآن - مجاني",
      stats: [
        { number: "300%", label: "زيادة في المبيعات" },
        { number: "24/7", label: "عمل متواصل" },
        { number: "9", label: "وكلاء ذكيين" },
        { number: "30", label: "يوم للنتائج" }
      ]
    },
    agents: {
      title: "وكلاء الذكاء الاصطناعي التسعة",
      subtitle: "كل وكيل متخصص في مجال محدد لضمان أفضل النتائج",
      items: [
        {
          name: "وكيل المبيعات",
          englishName: "Sales Agent",
          description: "يتابع العملاء المحتملين ويحولهم إلى مشترين حقيقيين"
        },
        {
          name: "وكيل التسويق",
          englishName: "Marketing Agent", 
          description: "ينشئ حملات تسويقية مستهدفة وفعالة"
        },
        {
          name: "وكيل خدمة العملاء",
          englishName: "Customer Service Agent",
          description: "يجيب على استفسارات العملاء على مدار الساعة"
        },
        {
          name: "وكيل التحليل",
          englishName: "Analytics Agent",
          description: "يحلل البيانات ويقدم تقارير مفصلة"
        },
        {
          name: "وكيل إدارة المشاريع",
          englishName: "Project Management Agent",
          description: "ينظم ويتابع جميع مشاريعك بكفاءة"
        },
        {
          name: "وكيل إنشاء المحتوى",
          englishName: "Content Creation Agent",
          description: "ينشئ محتوى إبداعي وجذاب لجميع منصاتك"
        },
        {
          name: "وكيل وسائل التواصل",
          englishName: "Social Media Agent",
          description: "يدير حساباتك على وسائل التواصل الاجتماعي"
        },
        {
          name: "وكيل البحث والتطوير",
          englishName: "Research & Development Agent",
          description: "يبحث عن الاتجاهات الجديدة وفرص التطوير"
        },
        {
          name: "وكيل إدارة العلاقات",
          englishName: "CRM Agent",
          description: "يدير علاقات العملاء ويحسن تجربتهم"
        }
      ]
    },
    process: {
      title: "كيف يعمل النظام؟",
      subtitle: "عملية بسيطة من 3 خطوات فقط",
      steps: [
        {
          title: "التسجيل والإعداد",
          description: "سجل حسابك واختر الوكلاء المناسبين لعملك",
          icon: "🚀"
        },
        {
          title: "تخصيص الوكلاء",
          description: "قم بتدريب الوكلاء على بياناتك وأهدافك التجارية",
          icon: "⚙️"
        },
        {
          title: "مراقبة النتائج",
          description: "تابع الأداء والنتائج من خلال لوحة التحكم المتقدمة",
          icon: "📊"
        }
      ]
    },
    dashboard: {
      title: "لوحة تحكم متقدمة",
      subtitle: "مراقبة شاملة لجميع أنشطة الوكلاء",
      features: [
        {
          title: "تقارير لحظية",
          description: "احصل على تقارير مفصلة عن أداء كل وكيل",
          icon: "📈"
        },
        {
          title: "تحليلات ذكية",
          description: "فهم عميق لسلوك العملاء وتوقعات السوق",
          icon: "🧠"
        },
        {
          title: "تنبيهات فورية",
          description: "اشعارات لحظية للفرص الجديدة والمهام المهمة",
          icon: "🔔"
        },
        {
          title: "تكامل سهل",
          description: "ربط سهل مع جميع أدواتك الحالية",
          icon: "🔗"
        }
      ]
    },
    successStory: {
      title: "قصة نجاح حقيقية",
      subtitle: "كيف غيّر مورفو إيه آي حياة أحمد التجارية",
      before: {
        title: "قبل مورفو إيه آي",
        description: "كان أحمد يعمل 12 ساعة يومياً، يتابع العملاء يدوياً، ومبيعاته لا تتجاوز 50,000 ريال شهرياً"
      },
      after: {
        title: "بعد مورفو إيه آي",
        description: "الآن يعمل 4 ساعات فقط، الوكلاء تدير كل شيء، ومبيعاته وصلت إلى 200,000 ريال شهرياً"
      },
      quote: "مورفو إيه آي غيّر حياتي تماماً. الآن لدي وقت لعائلتي ومبيعاتي تضاعفت 4 مرات!",
      author: "أحمد العتيبي، صاحب متجر إلكتروني"
    },
    pricing: {
      title: "عرض خاص - خصم 70%",
      price: "297 ريال/شهر",
      oldPrice: "997 ريال/شهر",
      discount: "وفر 700 ريال!",
      subtitle: "كل ما تحتاجه لبناء إمبراطوريتك التجارية",
      features: [
        "9 وكلاء ذكيين متخصصين",
        "لوحة تحكم متقدمة",
        "تقارير مفصلة يومية",
        "دعم فني 24/7",
        "تدريب مجاني للوكلاء",
        "ضمان استرداد المال 30 يوم"
      ],
      remaining: "متبقي 23 مقعد فقط!",
      urgency: "العرض ينتهي خلال 48 ساعة",
      ctaButton: "احجز مقعدك الآن"
    },
    finalCta: {
      title: "هل أنت مستعد لتغيير حياتك التجارية؟",
      description: "انضم إلى أكثر من 10,000 رائد أعمال يستخدمون مورفو إيه آي لمضاعفة أرباحهم",
      question: "السؤال الوحيد: هل ستكون منهم؟",
      button: "نعم، أريد مضاعفة أرباحي"
    }
  },
  en: {
    hero: {
      title: "Morvo AI - Your Smart Sales Assistant",
      subtitle: "Get 5 intelligent agents to increase your sales by 300% in 30 days",
      description: "Harness the power of AI to automatically convert your leads into real customers profitably",
      startButton: "Start Now - Free",
      stats: [
        { number: "300%", label: "Sales Increase" },
        { number: "24/7", label: "Always Working" },
        { number: "9", label: "Smart Agents" },
        { number: "30", label: "Days to Results" }
      ]
    },
    agents: {
      title: "Nine AI Agents",
      subtitle: "Each agent specializes in a specific area to ensure the best results",
      items: [
        {
          name: "Sales Agent",
          description: "Follows up with prospects and converts them into real buyers"
        },
        {
          name: "Marketing Agent",
          description: "Creates targeted and effective marketing campaigns"
        },
        {
          name: "Customer Service Agent",
          description: "Answers customer inquiries around the clock"
        },
        {
          name: "Analytics Agent",
          description: "Analyzes data and provides detailed reports"
        },
        {
          name: "Project Management Agent",
          description: "Organizes and tracks all your projects efficiently"
        },
        {
          name: "Content Creation Agent",
          description: "Creates engaging and creative content for all your platforms"
        },
        {
          name: "Social Media Agent",
          description: "Manages your social media accounts and engagement"
        },
        {
          name: "Research & Development Agent",
          description: "Researches new trends and development opportunities"
        },
        {
          name: "CRM Agent",
          description: "Manages customer relationships and improves their experience"
        }
      ]
    },
    process: {
      title: "How Does It Work?",
      subtitle: "Simple 3-step process",
      steps: [
        {
          title: "Sign Up & Setup",
          description: "Register your account and choose the right agents for your business",
          icon: "🚀"
        },
        {
          title: "Customize Agents",
          description: "Train the agents on your data and business goals",
          icon: "⚙️"
        },
        {
          title: "Monitor Results",
          description: "Track performance and results through the advanced dashboard",
          icon: "📊"
        }
      ]
    },
    dashboard: {
      title: "Advanced Dashboard",
      subtitle: "Comprehensive monitoring of all agent activities",
      features: [
        {
          title: "Real-time Reports",
          description: "Get detailed reports on each agent's performance",
          icon: "📈"
        },
        {
          title: "Smart Analytics",
          description: "Deep understanding of customer behavior and market predictions",
          icon: "🧠"
        },
        {
          title: "Instant Alerts",
          description: "Real-time notifications for new opportunities and important tasks",
          icon: "🔔"
        },
        {
          title: "Easy Integration",
          description: "Simple connection with all your existing tools",
          icon: "🔗"
        }
      ]
    },
    successStory: {
      title: "Real Success Story",
      subtitle: "How Morvo AI changed Ahmed's business life",
      before: {
        title: "Before Morvo AI",
        description: "Ahmed worked 12 hours daily, followed up with customers manually, and his sales didn't exceed 50,000 SAR monthly"
      },
      after: {
        title: "After Morvo AI", 
        description: "Now he works only 4 hours, agents manage everything, and his sales reached 200,000 SAR monthly"
      },
      quote: "Morvo AI completely changed my life. Now I have time for my family and my sales quadrupled!",
      author: "Ahmed Al-Otaibi, E-commerce Store Owner"
    },
    pricing: {
      title: "Special Offer - 70% Discount",
      price: "$79/month",
      oldPrice: "$267/month", 
      discount: "Save $188!",
      subtitle: "Everything you need to build your business empire",
      features: [
        "9 specialized smart agents",
        "Advanced dashboard",
        "Detailed daily reports",
        "24/7 technical support",
        "Free agent training",
        "30-day money-back guarantee"
      ],
      remaining: "Only 23 seats left!",
      urgency: "Offer ends in 48 hours",
      ctaButton: "Reserve Your Seat Now"
    },
    finalCta: {
      title: "Are You Ready to Transform Your Business Life?",
      description: "Join over 10,000 entrepreneurs using Morvo AI to double their profits",
      question: "The only question: Will you be one of them?",
      button: "Yes, I Want to Double My Profits"
    }
  }
};

// AI Introduction Animation Component
const AIIntroAnimation = memo(({ language }: { language: string }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const messages = {
    ar: [
      "مرحباً، أنا مورفو الذكي 🤖",
      "حان الوقت لتغيير عالم التسويق! 🚀",
      "دعني أريك كيف يمكن للذكاء الاصطناعي مضاعفة أرباحك",
      "9 وكلاء ذكيين في خدمتك 24/7 ⚡",
      "هل أنت مستعد للثورة التسويقية؟ 💎"
    ],
    en: [
      "Hello, I'm Morvo AI 🤖",
      "It's time to change the marketing world! 🚀", 
      "Let me show you how AI can double your profits",
      "9 smart agents at your service 24/7 ⚡",
      "Are you ready for the marketing revolution? 💎"
    ]
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('ai-intro');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < messages[language].length - 1) {
          return prev + 1;
        }
        return 0; // Loop back to start
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, language]);

  return (
    <div id="ai-intro" className="relative py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="relative">
          {/* AI Avatar */}
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <Brain className="w-16 h-16 text-white animate-neural-pulse" />
            </div>
            {/* Floating particles around avatar */}
            <div className="absolute -inset-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-40"
                  style={{
                    top: `${Math.sin(i * 60 * Math.PI / 180) * 50 + 50}%`,
                    left: `${Math.cos(i * 60 * Math.PI / 180) * 50 + 50}%`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Animated Messages */}
          <div className="h-20 flex items-center justify-center">
            <div 
              key={currentMessage}
              className="text-2xl md:text-3xl font-bold text-gradient-ai animate-fade-in-up"
            >
              {messages[language][currentMessage]}
            </div>
          </div>

          {/* Typing indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Animation hook for scroll-triggered effects
const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return scrollY;
};

// Floating AI particles component
const AIParticles = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Neural network connections */}
    <div className="absolute top-20 left-10 w-32 h-32 opacity-10">
      <Network className="w-full h-full text-blue-500 animate-pulse" style={{animationDuration: '4s'}} />
    </div>
    <div className="absolute top-40 right-20 w-24 h-24 opacity-10">
      <Cpu className="w-full h-full text-purple-500 animate-pulse" style={{animationDuration: '3s', animationDelay: '1s'}} />
    </div>
    <div className="absolute bottom-40 left-1/4 w-20 h-20 opacity-10">
      <Bot className="w-full h-full text-pink-500 animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}} />
    </div>
    
    {/* Floating dots */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className={`absolute w-1 h-1 rounded-full animate-ping opacity-20 ${
          i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
        }`}
        style={{
          top: `${20 + (i * 10)}%`,
          left: `${10 + (i * 12)}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + (i % 3)}s`
        }}
      />
    ))}
  </div>
));

// Enhanced gradient background component
const BackgroundGradient = ({ className }: { className: string }) => (
  <div
    className={`pointer-events-none absolute inset-0 ${className}`}
    aria-hidden="true"
  />
);

// Animated counter component
const AnimatedCounter = memo(({ number, label, theme }: { number: string; label: string; theme: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          const finalNumber = parseInt(number.replace(/[^0-9]/g, ''));
          if (!isNaN(finalNumber)) {
            let current = 0;
            const increment = finalNumber / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= finalNumber) {
                setCount(finalNumber);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, 30);
          }
        }
      },
      { threshold: 0.5 }
    );
    
    const element = document.getElementById(`counter-${label}`);
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, [number, label, isVisible]);
  
  return (
    <div id={`counter-${label}`} className="text-center group hover:scale-110 transition-transform duration-300">
      <div className={`text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
        theme === "dark" ? "drop-shadow-lg" : ""
      }`}>
        {number.includes('%') ? `${count}%` : 
         number.includes('/') ? number : 
         count > 0 ? count.toLocaleString() : number}
      </div>
      <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} group-hover:text-blue-500 transition-colors duration-300`}>
        {label}
      </div>
    </div>
  );
});

// Enhanced Pricing Card Component
const PricingCard = memo(({ t, theme, language }: { t: any; theme: string; language: string }) => {
  const isRTL = language === 'ar';
  
  return (
    <div className="relative max-w-md mx-auto">
      {/* Popular badge */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            <span>{language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}</span>
            <Flame className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className={`relative p-8 rounded-3xl backdrop-blur-lg border-2 border-gradient-to-r from-blue-500 to-purple-600 shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gray-900/80 border-blue-500/50' 
          : 'bg-white/90 border-blue-500/30'
      }`}>
        
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Header */}
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-3xl font-bold text-gradient-ai mb-2">
              {t.pricing.title}
            </h3>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.pricing.subtitle}
            </p>
          </div>

          {/* Pricing */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <span className={`text-lg line-through opacity-50 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t.pricing.oldPrice}
                </span>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                  70%
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-green-500 animate-bounce" />
              <span className="text-4xl font-bold text-gradient-ai">
                {t.pricing.price}
              </span>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 animate-pulse">
              <Gift className="w-4 h-4" />
              {t.pricing.discount}
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <ul className="space-y-4">
              {t.pricing.features.map((feature: string, index: number) => (
                <li key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Urgency indicators */}
          <div className="mb-6 space-y-3">
            <div className={`bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>{t.pricing.urgency}</span>
              </div>
            </div>
            
            <div className={`bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-center gap-2 text-orange-500 font-bold">
                <Target className="w-4 h-4 animate-bounce" />
                <span>{t.pricing.remaining}</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link to="/pricing" className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-4 text-lg font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className={`flex items-center justify-center gap-3 relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Rocket className="w-5 h-5 animate-bounce" />
                <span>{t.pricing.ctaButton}</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </Button>
          </Link>

          {/* Guarantee */}
          <div className="mt-6 text-center">
            <div className={`flex items-center justify-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className="w-4 h-4 text-green-500" />
              <span>{language === 'ar' ? 'ضمان استرداد المال 30 يوم' : '30-day money-back guarantee'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const scrollY = useScrollAnimation();
  const t = content[language];

  if (isChatOpen) return <ChatInterface onBack={() => setIsChatOpen(false)} />;

  const pageBG =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-50";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen ${pageBG} ${language === "ar" ? "font-cairo" : ""} relative overflow-hidden`}
    >
      {/* Global AI Particles */}
      <AIParticles />
      
      <Header onStartChat={() => setIsChatOpen(true)} />

      {/* Add top padding to account for fixed header */}
      <div className="pt-20">
        
        {/* ───────────────────────── Enhanced Hero */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Dynamic background effects */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            <BackgroundGradient className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          </div>
          
          {/* Floating AI elements */}
          <div className="absolute top-20 left-1/4 animate-float">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <Brain className="w-10 h-10 text-blue-500 animate-pulse" />
            </div>
          </div>
          
          <div className="absolute top-40 right-1/4 animate-float" style={{animationDelay: '1s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <Zap className="w-8 h-8 text-purple-500 animate-bounce" />
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <h1
                className={`font-bold mb-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight ${
                  language === "ar"
                    ? "text-4xl md:text-5xl lg:text-6xl"
                    : "text-4xl md:text-6xl lg:text-7xl"
                } animate-gradient-x`}
              >
                {t.hero.title}
              </h1>

              <p
                className={`text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                } animate-fade-in-up`}
                style={{animationDelay: '0.2s'}}
              >
                {t.hero.subtitle}
              </p>

              <p
                className={`text-lg mb-12 max-w-3xl mx-auto leading-relaxed ${
                  theme === "dark" ? "text-gray-400" : "text-gray-700"
                } animate-fade-in-up`}
                style={{animationDelay: '0.4s'}}
              >
                {t.hero.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <Link to="/pricing">
                  <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <Brain className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} animate-pulse`} />
                    <span className="relative z-10">{t.hero.startButton}</span>
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform duration-300`} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              {t.hero.stats.map(({ number, label }, index) => (
                <AnimatedCounter key={label} number={number} label={label} theme={theme} />
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── AI Introduction Animation */}
        <AIIntroAnimation language={language} />

        {/* ───────────────────────── Enhanced Agents */}
        <AgentsSection t={t} theme={theme} />

        {/* ───────────────────────── Enhanced Process */}
        <ProcessSection t={t} theme={theme} />

        {/* ───────────────────────── Enhanced Dashboard */}
        <DashboardSection t={t} theme={theme} />

        {/* ───────────────────────── Enhanced Success Story */}
        <SuccessStorySection t={t} theme={theme} isRTL={isRTL} />

        {/* ───────────────────────── Enhanced Pricing */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              title={t.pricing.title} 
              subtitle={language === 'ar' ? 'احصل على أفضل قيمة لاستثمارك' : 'Get the best value for your investment'} 
              theme={theme} 
            />
            <div className="mt-16">
              <PricingCard t={t} theme={theme} language={language} />
            </div>
          </div>
        </section>

        {/* ───────────────────────── Enhanced Final CTA */}
        <FinalCTASection t={t} theme={theme} />

      </div>

      <Footer />
    </div>
  );
};

/*===========================================================================*/
/*==============================  Sub‑components  ============================*/
/*===========================================================================*/

const StatsGrid = memo(({ stats, theme }: { stats: any[]; theme: string }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
    {stats.map(({ number, label }) => (
      <div key={label} className="text-center">
        <div className={`text-2xl md:text-3xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{number}</div>
        <div className={theme === "dark" ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>{label}</div>
      </div>
    ))}
  </div>
));

const AgentsSection = ({ t, theme }: { t: any; theme: string }) => (
  <section className={theme === "dark" ? "py-20 bg-gray-800/50" : "py-20 bg-gray-50/50"}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.agents.title} subtitle={t.agents.subtitle} theme={theme} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.agents.items.map(({ name, englishName, description }: any) => (
          <div
            key={name}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              theme === "dark" ? "bg-gray-900/50 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{name}</h3>
            {content.ar === t && (
              <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{englishName}</p>
            )}
            <p className={theme === "dark" ? "text-gray-300 leading-relaxed text-sm" : "text-gray-700 leading-relaxed text-sm"}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProcessSection = ({ t, theme }: { t: any; theme: string }) => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.process.title} subtitle={t.process.subtitle} theme={theme} />
      <div className="grid md:grid-cols-3 gap-8">
        {t.process.steps.map(({ title, description, icon }: any) => (
          <div
            key={title}
            className={`text-center p-8 rounded-2xl border ${theme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="text-4xl mb-4" aria-hidden="true">{icon}</div>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h3>
            <p className={theme === "dark" ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DashboardSection = ({ t, theme }: { t: any; theme: string }) => (
  <section className={theme === "dark" ? "py-20 bg-gray-800/50" : "py-20 bg-gray-50/50"}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.dashboard.title} subtitle={t.dashboard.subtitle} theme={theme} />
      <div className="grid md:grid-cols-2 gap-8">
        {t.dashboard.features.map(({ title, description, icon }: any) => (
          <div
            key={title}
            className={`p-6 rounded-xl border flex items-start gap-4 ${theme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="text-3xl" aria-hidden="true">{icon}</div>
            <div>
              <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h3>
              <p className={theme === "dark" ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SuccessStorySection = ({ t, theme, isRTL }: { t: any; theme: string; isRTL: boolean }) => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={t.successStory.title} subtitle={t.successStory.subtitle} theme={theme} />
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/** Before */}
        <StoryCard
          icon={<User className="w-8 h-8 text-red-500 flex-shrink-0" />}
          title={t.successStory.before.title}
          description={t.successStory.before.description}
          theme={theme}
          isRTL={isRTL}
        />
        {/** After */}
        <StoryCard
          icon={<Rocket className="w-8 h-8 text-green-500 flex-shrink-0" />}
          title={t.successStory.after.title}
          description={t.successStory.after.description}
          theme={theme}
          isRTL={isRTL}
          success
        />
      </div>
      {/* Quote */}
      <blockquote
        className={`relative p-8 rounded-2xl border text-center ${theme === "dark" ? "bg-gray-900/50 border-yellow-500/30" : "bg-white border-yellow-200"}`}
      >
        <Star className="w-10 h-10 text-yellow-400 absolute -top-5 left-1/2 -translate-x-1/2" aria-hidden="true" />
        <p className={theme === "dark" ? "text-xl italic mb-4 text-gray-300" : "text-xl italic mb-4 text-gray-700"}>
          "{t.successStory.quote}"
        </p>
        <footer className={theme === "dark" ? "font-semibold text-white" : "font-semibold text-gray-900"}>— {t.successStory.author}</footer>
      </blockquote>
    </div>
  </section>
);

const FinalCTASection = ({ t, theme }: { t: any; theme: string }) => (
  <section className="py-20 text-center">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className={`font-bold mb-6 ${theme === "dark" ? "text-3xl md:text-5xl text-white" : "text-3xl md:text-5xl text-gray-900"}`}>{t.finalCta.title}</h2>
      <p className={`text-xl mb-8 leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{t.finalCta.description}</p>
      <p className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{t.finalCta.question}</p>
      <Link to="/pricing">
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200">
          {t.finalCta.button}
        </Button>
      </Link>
    </div>
  </section>
);

/*----------------------------  Helpers  ----------------------------*/

const SectionHeader = ({ title, subtitle, theme }: { title: string; subtitle: string; theme: string }) => (
  <div className="text-center mb-16">
    <h2 className={`font-bold mb-6 ${theme === "dark" ? "text-3xl md:text-5xl text-white" : "text-3xl md:text-5xl text-gray-900"}`}>{title}</h2>
    <p className={`text-xl max-w-4xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{subtitle}</p>
  </div>
);

const StoryCard = ({ icon, title, description, theme, isRTL, success = false }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  theme: string;
  isRTL: boolean;
  success?: boolean;
}) => (
  <div className={`p-8 rounded-2xl border ${success ? "border-green-500/30" : ""} ${theme === "dark" ? success ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gray-900/50 border-gray-700" : success ? "bg-white border-green-200" : "bg-white border-gray-200"}`}>
    <div className={`flex items-center gap-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}> {icon}
      <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h3>
    </div>
    <p className={theme === "dark" ? "text-gray-400 leading-relaxed" : "text-gray-600 leading-relaxed"}>{description}</p>
  </div>
);

export default Index;
