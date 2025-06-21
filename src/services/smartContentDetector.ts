
import { MorvoAIService } from './morvoAIService';

export interface DetectionResult {
  primary: {
    type: 'analytics' | 'content-creator' | 'calendar' | 'campaign' | 'chart' | 'plan' | 'seo' | 'default';
    confidence: number;
  };
  contextData?: {
    metrics?: any[];
    content?: any[];
    timeframe?: string;
    keywords?: string[];
    domain?: string;
  };
}

export class SmartContentDetector {
  private static readonly INTENT_PATTERNS = {
    analytics: [
      /analyt/i, /metric/i, /performance/i, /data/i, /stats/i, /report/i,
      /dashboard/i, /kpi/i, /roi/i, /conversion/i, /traffic/i, /revenue/i
    ],
    'content-creator': [
      /content/i, /post/i, /write/i, /create/i, /publish/i, /social/i,
      /blog/i, /article/i, /copy/i, /text/i, /draft/i, /generate/i
    ],
    calendar: [
      /schedule/i, /calendar/i, /plan/i, /time/i, /date/i, /event/i,
      /appointment/i, /meeting/i, /agenda/i, /timeline/i
    ],
    campaign: [
      /campaign/i, /advertis/i, /market/i, /promotion/i, /launch/i,
      /target/i, /audience/i, /budget/i, /ads/i, /strategy/i
    ],
    chart: [
      /chart/i, /graph/i, /visual/i, /plot/i, /diagram/i, /trend/i,
      /line chart/i, /bar chart/i, /pie chart/i, /visualization/i
    ],
    plan: [
      /plan/i, /strategy/i, /roadmap/i, /goal/i, /objective/i, /step/i,
      /phase/i, /milestone/i, /action plan/i, /next steps/i
    ],
    seo: [
      /seo/i, /search engine/i, /keyword/i, /ranking/i, /backlink/i, /serp/i,
      /organic/i, /google/i, /site audit/i, /competitor/i, /domain authority/i,
      /se ranking/i, /seranking/i, /تحسين محركات البحث/i, /كلمات مفتاحية/i,
      /ترتيب/i, /جوجل/i, /بحث/i, /منافس/i, /روابط خلفية/i
    ]
  };

  static detectIntent(message: string, conversationHistory: string[] = []): DetectionResult {
    const text = message.toLowerCase();
    const recentContext = conversationHistory.slice(-3).join(' ').toLowerCase();
    const fullContext = `${recentContext} ${text}`;

    // Calculate scores for each intent
    const scores: Record<string, number> = {};
    
    Object.entries(this.INTENT_PATTERNS).forEach(([intent, patterns]) => {
      let score = 0;
      
      patterns.forEach(pattern => {
        // Direct message matches get higher weight
        if (pattern.test(text)) {
          score += 3;
        }
        // Context matches get lower weight
        if (pattern.test(recentContext)) {
          score += 1;
        }
      });
      
      scores[intent] = score;
    });

    // Find the highest scoring intent
    const maxScore = Math.max(...Object.values(scores));
    const detectedIntent = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];

    // If no clear intent or score is too low, default to 'default'
    if (!detectedIntent || maxScore < 2) {
      return {
        primary: {
          type: 'default',
          confidence: 0.3
        }
      };
    }

    // Extract context data based on detected intent
    const contextData = this.extractContextData(detectedIntent, fullContext);

    return {
      primary: {
        type: detectedIntent as DetectionResult['primary']['type'],
        confidence: Math.min(maxScore / 5, 1) // Normalize to 0-1
      },
      contextData
    };
  }

  private static extractContextData(intent: string, context: string): any {
    const data: any = {};

    // Extract keywords for all intents
    const keywords = context.match(/\b\w{4,}\b/g)?.slice(0, 5) || [];
    data.keywords = keywords;

    // Extract domain if mentioned
    const domainMatch = context.match(/\b(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})\b/);
    if (domainMatch) {
      data.domain = domainMatch[1];
    }

    // Intent-specific context extraction
    switch (intent) {
      case 'analytics':
        data.metrics = this.extractMetrics(context);
        data.timeframe = this.extractTimeframe(context);
        break;
      case 'content-creator':
        data.contentType = this.extractContentType(context);
        data.platform = this.extractPlatform(context);
        break;
      case 'calendar':
        data.timeframe = this.extractTimeframe(context);
        data.eventType = this.extractEventType(context);
        break;
      case 'campaign':
        data.campaignType = this.extractCampaignType(context);
        data.budget = this.extractBudget(context);
        break;
      case 'seo':
        data.seoType = this.extractSEOType(context);
        data.keywords = this.extractSEOKeywords(context);
        break;
    }

    return data;
  }

  private static extractMetrics(context: string): string[] {
    const metricKeywords = ['revenue', 'traffic', 'conversion', 'clicks', 'impressions', 'ctr', 'roi'];
    return metricKeywords.filter(metric => context.includes(metric));
  }

  private static extractTimeframe(context: string): string {
    if (context.includes('today') || context.includes('daily')) return 'today';
    if (context.includes('week') || context.includes('weekly')) return 'week';
    if (context.includes('month') || context.includes('monthly')) return 'month';
    if (context.includes('year') || context.includes('annual')) return 'year';
    return 'week';
  }

  private static extractContentType(context: string): string {
    if (context.includes('blog') || context.includes('article')) return 'blog';
    if (context.includes('social') || context.includes('post')) return 'social';
    if (context.includes('email')) return 'email';
    if (context.includes('ad') || context.includes('advertisement')) return 'ad';
    return 'general';
  }

  private static extractPlatform(context: string): string {
    if (context.includes('linkedin')) return 'linkedin';
    if (context.includes('twitter') || context.includes('x.com')) return 'twitter';
    if (context.includes('instagram')) return 'instagram';
    if (context.includes('facebook')) return 'facebook';
    return 'general';
  }

  private static extractEventType(context: string): string {
    if (context.includes('meeting')) return 'meeting';
    if (context.includes('post') || context.includes('publish')) return 'content';
    if (context.includes('campaign') || context.includes('launch')) return 'campaign';
    return 'general';
  }

  private static extractCampaignType(context: string): string {
    if (context.includes('email')) return 'email';
    if (context.includes('social')) return 'social';
    if (context.includes('search') || context.includes('google')) return 'search';
    if (context.includes('display') || context.includes('banner')) return 'display';
    return 'general';
  }

  private static extractBudget(context: string): string | null {
    const budgetMatch = context.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    return budgetMatch ? budgetMatch[0] : null;
  }

  private static extractSEOType(context: string): string {
    if (context.includes('keyword') || context.includes('كلمات مفتاحية')) return 'keywords';
    if (context.includes('backlink') || context.includes('روابط خلفية')) return 'backlinks';
    if (context.includes('audit') || context.includes('تدقيق')) return 'audit';
    if (context.includes('competitor') || context.includes('منافس')) return 'competitors';
    if (context.includes('ranking') || context.includes('ترتيب')) return 'rankings';
    return 'general';
  }

  private static extractSEOKeywords(context: string): string[] {
    const seoKeywords = ['ranking', 'backlinks', 'audit', 'competitors', 'keywords', 'serp', 'organic'];
    const arabicSeoKeywords = ['ترتيب', 'روابط', 'تدقيق', 'منافسين', 'كلمات', 'بحث'];
    return [...seoKeywords, ...arabicSeoKeywords].filter(keyword => context.includes(keyword));
  }

  // Enhanced detection with AI assistance (when available)
  static async detectIntentWithAI(message: string, context: string[] = []): Promise<DetectionResult> {
    try {
      // Try AI-enhanced detection first
      const aiResponse = await MorvoAIService.processMessage(
        `Analyze this message for intent: "${message}". Return intent type (analytics, content-creator, calendar, campaign, chart, plan, seo, or default) and confidence (0-1).`,
        { type: 'intent_detection', conversation_history: context }
      );

      // Parse AI response if available
      if (aiResponse.response) {
        const aiResult = this.parseAIIntentResponse(aiResponse.response);
        if (aiResult) {
          return aiResult;
        }
      }
    } catch (error) {
      console.warn('AI intent detection failed, using pattern matching:', error);
    }

    // Fallback to pattern matching
    return this.detectIntent(message, context);
  }

  private static parseAIIntentResponse(response: string): DetectionResult | null {
    try {
      // Simple parsing - look for intent keywords in AI response
      const intentMatch = response.match(/(analytics|content-creator|calendar|campaign|chart|plan|seo|default)/i);
      const confidenceMatch = response.match(/confidence[:\s]+([0-9.]+)/i);

      if (intentMatch) {
        return {
          primary: {
            type: intentMatch[1].toLowerCase() as DetectionResult['primary']['type'],
            confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.7
          }
        };
      }
    } catch (error) {
      console.warn('Failed to parse AI intent response:', error);
    }
    
    return null;
  }
}
