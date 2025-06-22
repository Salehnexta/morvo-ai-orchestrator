
import { supabase } from "@/integrations/supabase/client";
import { UserProfileService } from "./userProfileService";

export interface SeoDataSnapshot {
  domain_analysis: {
    domain_authority: number;
    trust_score: number;
    domain_age: string;
    alexa_rank: number;
  };
  organic_metrics: {
    total_keywords: number;
    top_10_keywords: number;
    organic_traffic: number;
    traffic_value: number;
    visibility_score: number;
  };
  keyword_analysis: {
    branded_keywords: string[];
    non_branded_keywords: string[];
    keyword_gaps: string[];
    trending_keywords: string[];
  };
  competitors: any[];
  backlink_metrics: {
    total_backlinks: number;
    referring_domains: number;
    dofollow_ratio: number;
    anchor_text_distribution: any;
  };
  technical_audit: {
    page_speed_score: number;
    mobile_friendly: boolean;
    ssl_certificate: boolean;
    sitemap_status: string;
  };
  serp_features: {
    featured_snippets: string[];
    local_pack_presence: boolean;
    knowledge_panel: boolean;
  };
}

export class SEOAnalysisService {
  static async analyzeDomain(websiteUrl: string): Promise<SeoDataSnapshot | null> {
    try {
      // TODO: Integrate with SE Ranking API
      // For now, return mock data structure
      const mockData: SeoDataSnapshot = {
        domain_analysis: {
          domain_authority: 45,
          trust_score: 38,
          domain_age: "5 years",
          alexa_rank: 50000
        },
        organic_metrics: {
          total_keywords: 1250,
          top_10_keywords: 45,
          organic_traffic: 12500,
          traffic_value: 8500,
          visibility_score: 65
        },
        keyword_analysis: {
          branded_keywords: ["brand name", "company name"],
          non_branded_keywords: ["service keyword", "industry term"],
          keyword_gaps: ["opportunity keyword"],
          trending_keywords: ["trending term"]
        },
        competitors: [],
        backlink_metrics: {
          total_backlinks: 850,
          referring_domains: 120,
          dofollow_ratio: 0.75,
          anchor_text_distribution: {}
        },
        technical_audit: {
          page_speed_score: 85,
          mobile_friendly: true,
          ssl_certificate: true,
          sitemap_status: "Found"
        },
        serp_features: {
          featured_snippets: [],
          local_pack_presence: false,
          knowledge_panel: false
        }
      };

      return mockData;
    } catch (error) {
      console.error('Error analyzing domain:', error);
      return null;
    }
  }

  static async updateUserSeoData(userId: string, websiteUrl: string): Promise<boolean> {
    try {
      console.log('🔍 Starting SEO analysis for:', websiteUrl);
      
      const seoData = await this.analyzeDomain(websiteUrl);
      if (!seoData) {
        console.error('Failed to get SEO data');
        return false;
      }

      // Update user profile with new SEO data
      const success = await UserProfileService.updateSeoData(userId, seoData);
      if (!success) {
        return false;
      }

      // Store historical data
      await this.storeSeoHistory(userId, websiteUrl, seoData);

      console.log('✅ SEO data updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user SEO data:', error);
      return false;
    }
  }

  static async storeSeoHistory(userId: string, websiteUrl: string, data: SeoDataSnapshot): Promise<void> {
    try {
      await supabase
        .from('seo_data')
        .insert({
          user_id: userId,
          website_url: websiteUrl,
          data_snapshot: data,
          data_type: 'daily_update',
          collected_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error storing SEO history:', error);
    }
  }

  static async getSeoHistory(userId: string, websiteUrl: string, days: number = 30): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('seo_data')
        .select('*')
        .eq('user_id', userId)
        .eq('website_url', websiteUrl)
        .gte('collected_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('collected_at', { ascending: false });

      if (error) {
        console.error('Error getting SEO history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSeoHistory:', error);
      return [];
    }
  }

  static async getLatestSeoData(userId: string): Promise<SeoDataSnapshot | null> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      return profile?.seo_data || null;
    } catch (error) {
      console.error('Error getting latest SEO data:', error);
      return null;
    }
  }
}
