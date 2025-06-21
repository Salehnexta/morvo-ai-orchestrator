
import { MorvoAIService } from './morvoAIService';

export interface KeywordData {
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  cpc: number;
  trend: 'up' | 'down' | 'stable';
  url?: string;
}

export interface CompetitorData {
  domain: string;
  visibility: number;
  keywords: number;
  traffic: number;
  position_change: number;
}

export interface BacklinkData {
  total_backlinks: number;
  referring_domains: number;
  dofollow_links: number;
  domain_authority: number;
  new_links_last_month: number;
}

export interface SiteAuditData {
  overall_score: number;
  errors: number;
  warnings: number;
  notices: number;
  pages_crawled: number;
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    count: number;
  }>;
}

export interface SEORankingData {
  keywords: KeywordData[];
  competitors: CompetitorData[];
  backlinks: BacklinkData;
  site_audit: SiteAuditData;
  local_seo?: {
    local_pack_position: number;
    google_my_business_score: number;
    local_citations: number;
  };
}

export class SERankingService {
  static async getKeywordRankings(domain: string): Promise<KeywordData[]> {
    try {
      const response = await MorvoAIService.processMessage(
        `Get keyword rankings for domain: ${domain}`,
        { 
          tool_request: 'seranking_keywords',
          domain: domain,
          type: 'keyword_analysis'
        }
      );

      // Parse SE Ranking data from backend response
      if (response.seo_data?.keywords) {
        return response.seo_data.keywords;
      }

      // Fallback to mock data if backend doesn't return SE Ranking data yet
      return this.getMockKeywordData();
    } catch (error) {
      console.error('SE Ranking keyword analysis failed:', error);
      return this.getMockKeywordData();
    }
  }

  static async getCompetitorAnalysis(domain: string): Promise<CompetitorData[]> {
    try {
      const response = await MorvoAIService.processMessage(
        `Analyze competitors for domain: ${domain}`,
        { 
          tool_request: 'seranking_competitors',
          domain: domain,
          type: 'competitor_analysis'
        }
      );

      if (response.seo_data?.competitors) {
        return response.seo_data.competitors;
      }

      return this.getMockCompetitorData();
    } catch (error) {
      console.error('SE Ranking competitor analysis failed:', error);
      return this.getMockCompetitorData();
    }
  }

  static async getBacklinkAnalysis(domain: string): Promise<BacklinkData> {
    try {
      const response = await MorvoAIService.processMessage(
        `Analyze backlinks for domain: ${domain}`,
        { 
          tool_request: 'seranking_backlinks',
          domain: domain,
          type: 'backlink_analysis'
        }
      );

      if (response.seo_data?.backlinks) {
        return response.seo_data.backlinks;
      }

      return this.getMockBacklinkData();
    } catch (error) {
      console.error('SE Ranking backlink analysis failed:', error);
      return this.getMockBacklinkData();
    }
  }

  static async getSiteAudit(domain: string): Promise<SiteAuditData> {
    try {
      const response = await MorvoAIService.processMessage(
        `Perform site audit for domain: ${domain}`,
        { 
          tool_request: 'seranking_audit',
          domain: domain,
          type: 'site_audit'
        }
      );

      if (response.seo_data?.site_audit) {
        return response.seo_data.site_audit;
      }

      return this.getMockSiteAuditData();
    } catch (error) {
      console.error('SE Ranking site audit failed:', error);
      return this.getMockSiteAuditData();
    }
  }

  static async getFullSEOAnalysis(domain: string): Promise<SEORankingData> {
    try {
      const response = await MorvoAIService.processMessage(
        `Complete SEO analysis for domain: ${domain} using SE Ranking`,
        { 
          tool_request: 'seranking_full_analysis',
          domain: domain,
          type: 'complete_seo_analysis',
          include_local: true
        }
      );

      if (response.seo_data) {
        return {
          keywords: response.seo_data.keywords || this.getMockKeywordData(),
          competitors: response.seo_data.competitors || this.getMockCompetitorData(),
          backlinks: response.seo_data.backlinks || this.getMockBacklinkData(),
          site_audit: response.seo_data.site_audit || this.getMockSiteAuditData(),
          local_seo: response.seo_data.local_seo
        };
      }

      return this.getMockFullAnalysis();
    } catch (error) {
      console.error('SE Ranking full analysis failed:', error);
      return this.getMockFullAnalysis();
    }
  }

  // Mock data methods for fallback
  private static getMockKeywordData(): KeywordData[] {
    return [
      { keyword: 'digital marketing', position: 3, volume: 12000, difficulty: 78, cpc: 4.5, trend: 'up' },
      { keyword: 'seo services', position: 7, volume: 8500, difficulty: 65, cpc: 6.2, trend: 'stable' },
      { keyword: 'ppc advertising', position: 12, volume: 5200, difficulty: 72, cpc: 8.1, trend: 'down' },
      { keyword: 'social media marketing', position: 5, volume: 15000, difficulty: 55, cpc: 3.8, trend: 'up' }
    ];
  }

  private static getMockCompetitorData(): CompetitorData[] {
    return [
      { domain: 'competitor1.com', visibility: 85, keywords: 1250, traffic: 45000, position_change: 2 },
      { domain: 'competitor2.com', visibility: 72, keywords: 980, traffic: 32000, position_change: -1 },
      { domain: 'competitor3.com', visibility: 68, keywords: 850, traffic: 28000, position_change: 0 }
    ];
  }

  private static getMockBacklinkData(): BacklinkData {
    return {
      total_backlinks: 1250,
      referring_domains: 320,
      dofollow_links: 780,
      domain_authority: 65,
      new_links_last_month: 45
    };
  }

  private static getMockSiteAuditData(): SiteAuditData {
    return {
      overall_score: 78,
      errors: 12,
      warnings: 28,
      notices: 45,
      pages_crawled: 156,
      issues: [
        { type: 'Missing meta descriptions', severity: 'high', count: 8 },
        { type: 'Slow loading pages', severity: 'medium', count: 15 },
        { type: 'Missing alt tags', severity: 'medium', count: 23 }
      ]
    };
  }

  private static getMockFullAnalysis(): SEORankingData {
    return {
      keywords: this.getMockKeywordData(),
      competitors: this.getMockCompetitorData(),
      backlinks: this.getMockBacklinkData(),
      site_audit: this.getMockSiteAuditData(),
      local_seo: {
        local_pack_position: 4,
        google_my_business_score: 82,
        local_citations: 156
      }
    };
  }
}
