
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatDataExtraction {
  companyInfo?: {
    name?: string;
    industry?: string;
    size?: string;
    website?: string;
  };
  marketingGoals?: string[];
  targetAudience?: string;
  budget?: string;
  channels?: string[];
  experience?: string;
  painPoints?: string[];
  interests?: string[];
}

export const useSmartChat = () => {
  const { user } = useAuth();
  const [extractedData, setExtractedData] = useState<ChatDataExtraction>({});

  const extractDataFromMessage = (message: string): Partial<ChatDataExtraction> => {
    const lowerMessage = message.toLowerCase();
    const extraction: Partial<ChatDataExtraction> = {};

    // Extract company info
    const companyPatterns = [
      /شركة\s+([^،\n]+)/g,
      /اسم\s+الشركة\s+([^،\n]+)/g,
      /نعمل\s+في\s+([^،\n]+)/g,
      /company\s+([^,\n]+)/gi,
      /work\s+in\s+([^,\n]+)/gi
    ];

    companyPatterns.forEach(pattern => {
      const matches = [...message.matchAll(pattern)];
      if (matches.length > 0) {
        extraction.companyInfo = {
          ...extraction.companyInfo,
          name: matches[0][1].trim()
        };
      }
    });

    // Extract industry
    const industryKeywords = {
      'technology': ['تقنية', 'برمجيات', 'تطبيقات', 'technology', 'software', 'apps'],
      'retail': ['تجارة', 'بيع', 'متجر', 'retail', 'shop', 'store'],
      'healthcare': ['صحة', 'طب', 'مستشفى', 'health', 'medical', 'hospital'],
      'education': ['تعليم', 'مدرسة', 'جامعة', 'education', 'school', 'university'],
      'finance': ['مالي', 'بنك', 'استثمار', 'finance', 'bank', 'investment'],
      'real_estate': ['عقار', 'أراضي', 'real estate', 'property'],
      'food': ['طعام', 'مطعم', 'food', 'restaurant'],
      'manufacturing': ['تصنيع', 'manufacturing', 'factory'],
      'services': ['خدمات', 'services']
    };

    Object.entries(industryKeywords).forEach(([industry, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        extraction.companyInfo = {
          ...extraction.companyInfo,
          industry
        };
      }
    });

    // Extract marketing goals
    const goalKeywords = {
      'increase_sales': ['زيادة المبيعات', 'رفع الإيرادات', 'increase sales', 'boost revenue'],
      'brand_awareness': ['الوعي بالعلامة', 'شهرة العلامة', 'brand awareness', 'brand recognition'],
      'lead_generation': ['جذب العملاء', 'عملاء محتملين', 'lead generation', 'attract customers'],
      'customer_retention': ['الاحتفاظ بالعملاء', 'customer retention', 'retain customers'],
      'market_expansion': ['التوسع', 'أسواق جديدة', 'market expansion', 'new markets'],
      'cost_optimization': ['تحسين التكلفة', 'cost optimization', 'reduce costs']
    };

    const detectedGoals: string[] = [];
    Object.entries(goalKeywords).forEach(([goal, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedGoals.push(goal);
      }
    });
    
    if (detectedGoals.length > 0) {
      extraction.marketingGoals = detectedGoals;
    }

    // Extract budget information
    const budgetPatterns = [
      /ميزانيت[يه]؟\s*([^،\n]+)/g,
      /أنفق\s+([^،\n]+)/g,
      /budget\s+([^,\n]+)/gi,
      /spend\s+([^,\n]+)/gi
    ];

    budgetPatterns.forEach(pattern => {
      const matches = [...message.matchAll(pattern)];
      if (matches.length > 0) {
        const budgetText = matches[0][1].toLowerCase();
        if (budgetText.includes('1000') || budgetText.includes('ألف')) {
          if (budgetText.includes('أقل') || budgetText.includes('less')) {
            extraction.budget = 'less_than_1000';
          } else if (budgetText.includes('5000') || budgetText.includes('خمسة آلاف')) {
            extraction.budget = '1000_5000';
          }
        } else if (budgetText.includes('15000') || budgetText.includes('خمستعشر ألف')) {
          extraction.budget = '5000_15000';
        } else if (budgetText.includes('50000') || budgetText.includes('خمسين ألف')) {
          extraction.budget = '15000_50000';
        } else if (budgetText.includes('أكثر') || budgetText.includes('more')) {
          extraction.budget = 'more_than_50000';
        }
      }
    });

    // Extract target audience
    const audiencePatterns = [
      /جمهور[يه]؟\s+([^،\n]+)/g,
      /عملائ[يه]؟\s+([^،\n]+)/g,
      /target\s+audience\s+([^,\n]+)/gi,
      /customers\s+([^,\n]+)/gi
    ];

    audiencePatterns.forEach(pattern => {
      const matches = [...message.matchAll(pattern)];
      if (matches.length > 0) {
        extraction.targetAudience = matches[0][1].trim();
      }
    });

    return extraction;
  };

  const processMessage = async (message: string) => {
    const newData = extractDataFromMessage(message);
    
    if (Object.keys(newData).length > 0) {
      const updatedData = {
        ...extractedData,
        ...newData,
        companyInfo: {
          ...extractedData.companyInfo,
          ...newData.companyInfo
        },
        marketingGoals: [
          ...(extractedData.marketingGoals || []),
          ...(newData.marketingGoals || [])
        ].filter((goal, index, arr) => arr.indexOf(goal) === index)
      };

      setExtractedData(updatedData);

      // Save to customer profile
      await updateCustomerProfile(updatedData);

      // Log the interaction
      await logInteraction('chat_data_extraction', {
        message,
        extracted_data: newData,
        confidence_score: calculateConfidenceScore(newData)
      });

      return newData;
    }

    return null;
  };

  const updateCustomerProfile = async (data: ChatDataExtraction) => {
    if (!user) return;

    try {
      const updateData: any = {};

      if (data.companyInfo?.name) {
        updateData.company_name = data.companyInfo.name;
      }
      if (data.companyInfo?.industry) {
        updateData.industry = data.companyInfo.industry;
      }
      if (data.companyInfo?.size) {
        updateData.company_size = data.companyInfo.size;
      }
      if (data.marketingGoals && data.marketingGoals.length > 0) {
        updateData.marketing_goals = data.marketingGoals;
      }
      if (data.targetAudience) {
        updateData.target_audience = data.targetAudience;
      }
      if (data.budget) {
        updateData.monthly_marketing_budget = data.budget;
      }
      if (data.channels && data.channels.length > 0) {
        updateData.current_marketing_activities = data.channels;
      }
      if (data.experience) {
        updateData.marketing_experience_level = data.experience;
      }

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('customer_profiles')
          .upsert({
            customer_id: user.id,
            ...updateData,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error updating customer profile:', error);
    }
  };

  const logInteraction = async (interactionType: string, interactionData: any) => {
    if (!user) return;

    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) return;

      await supabase
        .from('user_interactions')
        .insert([{
          user_id: user.id,
          client_id: clientData.id,
          interaction_type: interactionType,
          interaction_data: interactionData,
          page_url: window.location.pathname,
          session_id: sessionStorage.getItem('session_id') || 'unknown'
        }]);
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  const calculateConfidenceScore = (data: Partial<ChatDataExtraction>): number => {
    let score = 0;
    let maxScore = 0;

    if (data.companyInfo) {
      maxScore += 20;
      if (data.companyInfo.name) score += 10;
      if (data.companyInfo.industry) score += 10;
    }

    if (data.marketingGoals) {
      maxScore += 20;
      score += Math.min(data.marketingGoals.length * 5, 20);
    }

    if (data.targetAudience) {
      maxScore += 15;
      score += 15;
    }

    if (data.budget) {
      maxScore += 15;
      score += 15;
    }

    if (data.channels) {
      maxScore += 15;
      score += Math.min(data.channels.length * 3, 15);
    }

    if (data.experience) {
      maxScore += 15;
      score += 15;
    }

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  };

  const getProfileCompleteness = (): number => {
    return calculateConfidenceScore(extractedData);
  };

  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    
    if (!extractedData.companyInfo?.name) missing.push('company_name');
    if (!extractedData.companyInfo?.industry) missing.push('industry');
    if (!extractedData.marketingGoals || extractedData.marketingGoals.length === 0) missing.push('marketing_goals');
    if (!extractedData.targetAudience) missing.push('target_audience');
    if (!extractedData.budget) missing.push('budget');
    
    return missing;
  };

  return {
    extractedData,
    processMessage,
    getProfileCompleteness,
    getMissingFields,
    logInteraction
  };
};
