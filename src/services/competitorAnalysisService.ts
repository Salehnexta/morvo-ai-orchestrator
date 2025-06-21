
import { supabase } from "@/integrations/supabase/client";
import { SERankingService } from "./seRankingService";
import { UserProfileService } from "./userProfileService";

export interface BasicCompetitorInfo {
  name: string;
  website?: string;
  industry?: string;
  notes?: string;
}

export interface EnhancedCompetitorData {
  basic_info: BasicCompetitorInfo;
  se_ranking_data?: {
    domain_analysis: {
      traffic_estimate: number;
      visibility_score: number;
      keyword_count: number;
      top_keywords: string[];
    };
    backlink_profile: {
      total_backlinks: number;
      referring_domains: number;
      authority_score: number;
      anchor_text_distribution: Record<string, number>;
    };
    technical_seo: {
      crawl_issues: number;
      page_speed_score: number;
      mobile_friendly: boolean;
      technical_errors: string[];
    };
  };
  analysis_date?: string;
  competitive_gaps?: string[];
  opportunities?: string[];
}

export class CompetitorAnalysisService {
  // Save basic competitor info during profile setup
  static async saveBasicCompetitors(userId: string, competitors: string[]): Promise<boolean> {
    try {
      const basicCompetitorData = competitors.map(name => ({
        name: name.trim(),
        website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`, // Smart guess
        industry: 'unknown',
        notes: 'Added during initial profile setup'
      }));

      return await UserProfileService.saveUserProfile(userId, {
        main_competitors: competitors,
        competitor_analysis: {
          basic_competitors: basicCompetitorData,
          analysis_phase: 'basic',
          last_updated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error saving basic competitors:', error);
      return false;
    }
  }

  // Enhance competitor analysis with SE Ranking data
  static async enhanceWithSERanking(userId: string): Promise<boolean> {
    try {
      console.log('🔍 Starting SE Ranking competitor enhancement for user:', userId);
      
      const profile = await UserProfileService.getUserProfile(userId);
      if (!profile?.main_competitors?.length) {
        console.log('⚠️ No competitors found to analyze');
        return false;
      }

      const userDomain = this.extractDomain(profile.website_url || '');
      const enhancedCompetitors: EnhancedCompetitorData[] = [];

      for (const competitor of profile.main_competitors) {
        try {
          const competitorDomain = this.guessCompetitorDomain(competitor);
          console.log(`🔍 Analyzing competitor: ${competitor} (${competitorDomain})`);

          // Get SE Ranking data for competitor
          const seRankingData = await SERankingService.getFullSEOAnalysis(competitorDomain);
          
          // Perform competitive gap analysis
          const gaps = await this.identifyCompetitiveGaps(userDomain, competitorDomain, seRankingData);
          
          const enhancedData: EnhancedCompetitorData = {
            basic_info: {
              name: competitor,
              website: `https://${competitorDomain}`,
              industry: profile.industry || 'unknown'
            },
            se_ranking_data: {
              domain_analysis: {
                traffic_estimate: this.estimateTraffic(seRankingData),
                visibility_score: this.calculateVisibility(seRankingData),
                keyword_count: seRankingData.keywords?.length || 0,
                top_keywords: seRankingData.keywords?.slice(0, 10).map(k => k.keyword) || []
              },
              backlink_profile: {
                total_backlinks: seRankingData.backlinks?.total_backlinks || 0,
                referring_domains: seRankingData.backlinks?.referring_domains || 0,
                authority_score: seRankingData.backlinks?.domain_authority || 0,
                anchor_text_distribution: this.analyzeAnchorText(seRankingData)
              },
              technical_seo: {
                crawl_issues: seRankingData.site_audit?.errors || 0,
                page_speed_score: seRankingData.site_audit?.overall_score || 0,
                mobile_friendly: seRankingData.site_audit?.overall_score > 70,
                technical_errors: seRankingData.site_audit?.issues?.map(i => i.type) || []
              }
            },
            analysis_date: new Date().toISOString(),
            competitive_gaps: gaps.gaps,
            opportunities: gaps.opportunities
          };

          enhancedCompetitors.push(enhancedData);
        } catch (error) {
          console.error(`❌ Failed to analyze competitor ${competitor}:`, error);
        }
      }

      // Save enhanced competitor analysis
      const success = await UserProfileService.saveUserProfile(userId, {
        competitor_analysis: {
          ...profile.competitor_analysis,
          enhanced_competitors: enhancedCompetitors,
          analysis_phase: 'enhanced',
          se_ranking_enhanced_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        }
      });

      console.log(`✅ Enhanced competitor analysis complete. Analyzed ${enhancedCompetitors.length} competitors`);
      return success;

    } catch (error) {
      console.error('❌ Error enhancing competitor analysis:', error);
      return false;
    }
  }

  // Get enhanced competitor analysis
  static async getEnhancedCompetitorAnalysis(userId: string): Promise<EnhancedCompetitorData[] | null> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      return profile?.competitor_analysis?.enhanced_competitors || null;
    } catch (error) {
      console.error('Error getting enhanced competitor analysis:', error);
      return null;
    }
  }

  // Check if competitor analysis needs enhancement
  static async needsEnhancement(userId: string): Promise<boolean> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      const analysis = profile?.competitor_analysis;
      
      if (!analysis || analysis.analysis_phase !== 'enhanced') {
        return true;
      }

      // Check if analysis is older than 30 days
      const lastEnhanced = new Date(analysis.se_ranking_enhanced_at || 0);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return lastEnhanced < thirtyDaysAgo;
    } catch (error) {
      console.error('Error checking enhancement needs:', error);
      return true;
    }
  }

  // Helper methods
  private static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0];
    }
  }

  private static guessCompetitorDomain(competitorName: string): string {
    // Smart domain guessing logic
    const cleaned = competitorName.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
    return `${cleaned}.com`;
  }

  private static estimateTraffic(seData: any): number {
    // Estimate traffic based on keywords and positions
    if (!seData.keywords) return 0;
    
    return seData.keywords.reduce((total: number, keyword: any) => {
      const positionMultiplier = keyword.position <= 3 ? 0.3 : 
                               keyword.position <= 10 ? 0.1 : 0.02;
      return total + (keyword.volume * positionMultiplier);
    }, 0);
  }

  private static calculateVisibility(seData: any): number {
    // Calculate visibility score based on keyword positions
    if (!seData.keywords?.length) return 0;
    
    const totalKeywords = seData.keywords.length;
    const topPositions = seData.keywords.filter((k: any) => k.position <= 10).length;
    
    return Math.round((topPositions / totalKeywords) * 100);
  }

  private static analyzeAnchorText(seData: any): Record<string, number> {
    // Mock anchor text analysis - would come from actual SE Ranking data
    return {
      'brand': 40,
      'generic': 30,
      'exact_match': 20,
      'partial_match': 10
    };
  }

  private static async identifyCompetitiveGaps(userDomain: string, competitorDomain: string, competitorData: any): Promise<{gaps: string[], opportunities: string[]}> {
    const gaps: string[] = [];
    const opportunities: string[] = [];

    // Analyze keyword gaps
    if (competitorData.keywords?.length > 0) {
      const topCompetitorKeywords = competitorData.keywords.filter((k: any) => k.position <= 10);
      if (topCompetitorKeywords.length > 5) {
        gaps.push(`Competitor ranks for ${topCompetitorKeywords.length} top keywords`);
        opportunities.push('Target competitor\'s top-ranking keywords');
      }
    }

    // Analyze backlink gaps
    if (competitorData.backlinks?.referring_domains > 100) {
      gaps.push(`Competitor has ${competitorData.backlinks.referring_domains} referring domains`);
      opportunities.push('Build authority through strategic link building');
    }

    // Technical SEO gaps
    if (competitorData.site_audit?.overall_score > 80) {
      gaps.push('Competitor has superior technical SEO');
      opportunities.push('Improve site technical performance');
    }

    return { gaps, opportunities };
  }
}
