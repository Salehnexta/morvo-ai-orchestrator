
import { supabase } from "@/integrations/supabase/client";
import { UserProfileService } from "./userProfileService";

export interface SeoDataSnapshot {
  domain: string;
  organic_traffic: number;
  total_keywords: number;
  visibility_score: number;
  backlinks: number;
  domain_authority: number;
  page_speed: number;
  mobile_score: number;
  technical_score: number;
  competitors: Array<{
    domain: string;
    similarity_score: number;
    common_keywords: number;
  }>;
  keyword_analysis: {
    top_keywords: Array<{
      keyword: string;
      position: number;
      search_volume: number;
      difficulty: number;
    }>;
    keyword_gaps: Array<{
      keyword: string;
      competitor_position: number;
      search_volume: number;
    }>;
  };
  technical_issues: Array<{
    issue_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
  timestamp: string;
}

export class SERankingService {
  private static API_BASE_URL = 'https://api4.seranking.com/';
  
  static async analyzeDomain(domain: string, userId?: string): Promise<SeoDataSnapshot | null> {
    try {
      // Mock data for demonstration since SE Ranking requires API key
      const mockData: SeoDataSnapshot = {
        domain,
        organic_traffic: Math.floor(Math.random() * 10000) + 1000,
        total_keywords: Math.floor(Math.random() * 500) + 100,
        visibility_score: Math.floor(Math.random() * 40) + 60,
        backlinks: Math.floor(Math.random() * 1000) + 100,
        domain_authority: Math.floor(Math.random() * 30) + 40,
        page_speed: Math.floor(Math.random() * 20) + 70,
        mobile_score: Math.floor(Math.random() * 15) + 80,
        technical_score: Math.floor(Math.random() * 25) + 70,
        competitors: [
          {
            domain: 'competitor1.com',
            similarity_score: 0.85,
            common_keywords: 45
          },
          {
            domain: 'competitor2.com',
            similarity_score: 0.72,
            common_keywords: 38
          }
        ],
        keyword_analysis: {
          top_keywords: [
            {
              keyword: 'main keyword',
              position: 3,
              search_volume: 1200,
              difficulty: 65
            },
            {
              keyword: 'secondary keyword',
              position: 7,
              search_volume: 800,
              difficulty: 45
            }
          ],
          keyword_gaps: [
            {
              keyword: 'opportunity keyword',
              competitor_position: 2,
              search_volume: 950
            }
          ]
        },
        technical_issues: [
          {
            issue_type: 'Page Speed',
            severity: 'medium',
            description: 'Some pages load slowly',
            recommendation: 'Optimize images and enable compression'
          }
        ],
        timestamp: new Date().toISOString()
      };

      // Save to user profile if userId provided
      if (userId) {
        await UserProfileService.saveUserProfile(userId, {
          seo_data: mockData as any,
          last_seo_update: new Date().toISOString()
        });

        // Also save to seo_data table
        await this.saveSeoDataSnapshot(userId, domain, mockData);
      }

      return mockData;
    } catch (error) {
      console.error('Error analyzing domain:', error);
      return null;
    }
  }

  private static async saveSeoDataSnapshot(userId: string, domain: string, data: SeoDataSnapshot): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('seo_data')
        .insert({
          user_id: userId,
          website_url: domain,
          data_snapshot: data as any,
          data_type: 'se_ranking_analysis',
          collected_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving SEO data snapshot:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveSeoDataSnapshot:', error);
      return false;
    }
  }

  static async getLatestAnalysis(userId: string, domain: string): Promise<SeoDataSnapshot | null> {
    try {
      const { data, error } = await supabase
        .from('seo_data')
        .select('*')
        .eq('user_id', userId)
        .eq('website_url', domain)
        .eq('data_type', 'se_ranking_analysis')
        .order('collected_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      // Safe type conversion with validation
      const snapshot = data.data_snapshot;
      if (typeof snapshot === 'object' && snapshot !== null && !Array.isArray(snapshot)) {
        return snapshot as SeoDataSnapshot;
      }

      return null;
    } catch (error) {
      console.error('Error getting latest analysis:', error);
      return null;
    }
  }

  static async trackKeywordRankings(keywords: string[], domain: string): Promise<any> {
    // Mock implementation
    return {
      success: true,
      tracking_id: 'mock_tracking_id',
      message: 'Keywords added to tracking'
    };
  }

  static async getCompetitorAnalysis(domain: string): Promise<any> {
    // Mock implementation
    return {
      competitors: [
        { domain: 'competitor1.com', similarity: 0.85 },
        { domain: 'competitor2.com', similarity: 0.72 }
      ]
    };
  }

  static async updateUserSeoData(userId: string, websiteUrl: string): Promise<boolean> {
    try {
      const analysisData = await this.analyzeDomain(websiteUrl, userId);
      return analysisData !== null;
    } catch (error) {
      console.error('Error updating user SEO data:', error);
      return false;
    }
  }
}

// Export alias for backward compatibility
export const SEOAnalysisService = SERankingService;
