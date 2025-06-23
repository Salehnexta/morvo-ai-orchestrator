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
      console.log('🔍 Starting domain analysis for:', domain);
      
      // Enhanced mock data with more realistic values
      const mockData: SeoDataSnapshot = {
        domain,
        organic_traffic: Math.floor(Math.random() * 15000) + 2000,
        total_keywords: Math.floor(Math.random() * 800) + 200,
        visibility_score: Math.floor(Math.random() * 30) + 65,
        backlinks: Math.floor(Math.random() * 2000) + 150,
        domain_authority: Math.floor(Math.random() * 25) + 45,
        page_speed: Math.floor(Math.random() * 15) + 75,
        mobile_score: Math.floor(Math.random() * 10) + 85,
        technical_score: Math.floor(Math.random() * 20) + 75,
        competitors: [
          {
            domain: this.generateCompetitorDomain(domain),
            similarity_score: 0.82 + Math.random() * 0.15,
            common_keywords: Math.floor(Math.random() * 30) + 35
          },
          {
            domain: this.generateCompetitorDomain(domain, 2),
            similarity_score: 0.70 + Math.random() * 0.20,
            common_keywords: Math.floor(Math.random() * 25) + 25
          }
        ],
        keyword_analysis: {
          top_keywords: [
            {
              keyword: this.generateRelevantKeyword(domain),
              position: Math.floor(Math.random() * 5) + 1,
              search_volume: Math.floor(Math.random() * 800) + 500,
              difficulty: Math.floor(Math.random() * 30) + 50
            },
            {
              keyword: this.generateRelevantKeyword(domain, 'secondary'),
              position: Math.floor(Math.random() * 8) + 3,
              search_volume: Math.floor(Math.random() * 400) + 300,
              difficulty: Math.floor(Math.random() * 25) + 40
            }
          ],
          keyword_gaps: [
            {
              keyword: this.generateRelevantKeyword(domain, 'opportunity'),
              competitor_position: Math.floor(Math.random() * 3) + 1,
              search_volume: Math.floor(Math.random() * 600) + 400
            }
          ]
        },
        technical_issues: this.generateTechnicalIssues(),
        timestamp: new Date().toISOString()
      };

      // Save to user profile and seo_data table if userId provided
      if (userId) {
        console.log('💾 Saving SEO analysis results for user:', userId);
        
        // Update user profile with SEO data using existing field
        await UserProfileService.saveUserProfile(userId, {
          seo_data: mockData as any,
          last_seo_update: new Date().toISOString()
        });

        // Save to seo_data table for historical tracking
        await this.saveSeoDataSnapshot(userId, domain, mockData);
        
        console.log('✅ SEO analysis saved successfully');
      }

      return mockData;
    } catch (error) {
      console.error('❌ Error analyzing domain:', error);
      return null;
    }
  }

  // Generate realistic competitor domains
  private static generateCompetitorDomain(originalDomain: string, index: number = 1): string {
    const baseName = originalDomain.replace(/\.(com|net|org|sa|ae).*/, '');
    const alternatives = ['pro', 'store', 'shop', 'online', 'plus'];
    return `${baseName}${alternatives[index - 1] || 'competitor'}.com`;
  }

  // Generate relevant keywords based on domain
  private static generateRelevantKeyword(domain: string, type: string = 'main'): string {
    const baseName = domain.replace(/\.(com|net|org|sa|ae).*/, '');
    
    const keywordTemplates = {
      main: [`${baseName}`, `${baseName} السعودية`, `شراء من ${baseName}`],
      secondary: [`${baseName} خدمات`, `${baseName} منتجات`, `تقييم ${baseName}`],
      opportunity: [`أفضل ${baseName}`, `${baseName} مجاني`, `${baseName} عروض`]
    };
    
    const templates = keywordTemplates[type as keyof typeof keywordTemplates] || keywordTemplates.main;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Generate realistic technical issues
  private static generateTechnicalIssues(): Array<{
    issue_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }> {
    const possibleIssues = [
      {
        issue_type: 'Page Speed',
        severity: 'medium' as const,
        description: 'بعض الصفحات تحتاج تحسين في السرعة',
        recommendation: 'ضغط الصور وتحسين الكود لتسريع التحميل'
      },
      {
        issue_type: 'Mobile Optimization',
        severity: 'low' as const,
        description: 'تحسينات بسيطة مطلوبة للجوال',
        recommendation: 'تحسين تجربة المستخدم على الأجهزة المحمولة'
      },
      {
        issue_type: 'Meta Tags',
        severity: 'high' as const,
        description: 'بعض الصفحات تفتقر لوصف تعريفي مناسب',
        recommendation: 'إضافة وصف تعريفي وكلمات مفتاحية لكل صفحة'
      }
    ];

    // Return 1-3 random issues
    const numIssues = Math.floor(Math.random() * 3) + 1;
    return possibleIssues.slice(0, numIssues);
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

      // Safe type conversion with proper validation
      const snapshot = data.data_snapshot;
      if (this.isValidSeoDataSnapshot(snapshot)) {
        return snapshot as unknown as SeoDataSnapshot;
      }

      return null;
    } catch (error) {
      console.error('Error getting latest analysis:', error);
      return null;
    }
  }

  // Type guard function to validate SeoDataSnapshot structure
  private static isValidSeoDataSnapshot(obj: any): obj is SeoDataSnapshot {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.domain === 'string' &&
      typeof obj.organic_traffic === 'number' &&
      typeof obj.total_keywords === 'number' &&
      typeof obj.visibility_score === 'number' &&
      typeof obj.backlinks === 'number' &&
      typeof obj.domain_authority === 'number' &&
      typeof obj.page_speed === 'number' &&
      typeof obj.mobile_score === 'number' &&
      typeof obj.technical_score === 'number' &&
      Array.isArray(obj.competitors) &&
      obj.keyword_analysis &&
      Array.isArray(obj.keyword_analysis.top_keywords) &&
      Array.isArray(obj.keyword_analysis.keyword_gaps) &&
      Array.isArray(obj.technical_issues) &&
      typeof obj.timestamp === 'string'
    );
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
