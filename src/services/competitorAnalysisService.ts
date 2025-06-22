
import { supabase } from "@/integrations/supabase/client";
import { UserProfileService, UserProfile } from "./userProfileService";

export interface CompetitorProfile {
  name: string;
  domain?: string;
  industry?: string;
  strengths?: string[];
  weaknesses?: string[];
  marketShare?: number;
  keyProducts?: string[];
}

export interface CompetitorAnalysis {
  competitors: CompetitorProfile[];
  marketPosition: string;
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  lastUpdated: string;
}

export class CompetitorAnalysisService {
  static async saveBasicCompetitors(userId: string, competitors: string[]): Promise<boolean> {
    try {
      const competitorProfiles: CompetitorProfile[] = competitors.map(name => ({
        name: name.trim(),
        strengths: [],
        weaknesses: [],
        keyProducts: []
      }));

      const analysisData: CompetitorAnalysis = {
        competitors: competitorProfiles,
        marketPosition: 'analysis_pending',
        opportunities: [],
        threats: [],
        recommendations: [],
        lastUpdated: new Date().toISOString()
      };

      const success = await UserProfileService.saveUserProfile(userId, {
        main_competitors: competitors,
        competitor_analysis: analysisData
      });

      return success;
    } catch (error) {
      console.error('Error saving basic competitors:', error);
      return false;
    }
  }

  static async getCompetitorAnalysis(userId: string): Promise<CompetitorAnalysis | null> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      if (!profile) return null;

      return profile.competitor_analysis || null;
    } catch (error) {
      console.error('Error getting competitor analysis:', error);
      return null;
    }
  }

  static async getBasicCompetitors(userId: string): Promise<string[]> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      return profile?.main_competitors || [];
    } catch (error) {
      console.error('Error getting basic competitors:', error);
      return [];
    }
  }

  static async analyzeCompetitors(userId: string, businessContext?: any): Promise<CompetitorAnalysis | null> {
    try {
      const profile = await UserProfileService.getUserProfile(userId);
      if (!profile || !profile.main_competitors || profile.main_competitors.length === 0) {
        return null;
      }

      // Enhanced analysis with business context
      const enhancedAnalysis: CompetitorAnalysis = {
        competitors: profile.main_competitors.map(name => ({
          name,
          domain: `${name.toLowerCase().replace(/\s+/g, '')}.com`,
          industry: profile.industry || 'Unknown',
          strengths: ['Market presence', 'Brand recognition'],
          weaknesses: ['Analysis pending'],
          marketShare: 0,
          keyProducts: []
        })),
        marketPosition: this.determineMarketPosition(profile),
        opportunities: this.generateOpportunities(profile),
        threats: this.generateThreats(profile),
        recommendations: this.generateRecommendations(profile),
        lastUpdated: new Date().toISOString()
      };

      // Save enhanced analysis
      await UserProfileService.saveUserProfile(userId, {
        competitor_analysis: enhancedAnalysis
      });

      return enhancedAnalysis;
    } catch (error) {
      console.error('Error analyzing competitors:', error);
      return null;
    }
  }

  private static determineMarketPosition(profile: UserProfile): string {
    if (profile.company_size === '1-10') return 'startup';
    if (profile.company_size === '11-50') return 'small_business';
    if (profile.company_size === '51-200') return 'mid_market';
    return 'enterprise';
  }

  private static generateOpportunities(profile: UserProfile): string[] {
    const opportunities = [];
    
    if (profile.marketing_experience === 'beginner') {
      opportunities.push('Digital marketing automation opportunities');
    }
    
    if (profile.primary_marketing_goals?.includes('brand_awareness')) {
      opportunities.push('Content marketing expansion');
    }
    
    if (!profile.website_url) {
      opportunities.push('Establish strong online presence');
    }

    return opportunities;
  }

  private static generateThreats(profile: UserProfile): string[] {
    const threats = [];
    
    if (profile.marketing_budget === 'less_than_1000') {
      threats.push('Limited marketing budget vs competitors');
    }
    
    threats.push('Competitive market positioning');
    threats.push('Digital marketing gaps');

    return threats;
  }

  private static generateRecommendations(profile: UserProfile): string[] {
    const recommendations = [];
    
    if (profile.marketing_experience === 'beginner') {
      recommendations.push('Focus on fundamental digital marketing strategies');
    }
    
    if (!profile.website_url) {
      recommendations.push('Develop professional website presence');
    }
    
    recommendations.push('Monitor competitor marketing activities');
    recommendations.push('Identify unique value propositions');

    return recommendations;
  }
}
