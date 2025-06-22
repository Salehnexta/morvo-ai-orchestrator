
import { UserProfileService } from './userProfileService';

export interface JourneyPhase {
  id: string;
  title: string;
  description: string;
  requiredData: string[];
  estimatedTime: number;
  order: number;
}

export interface JourneyFlowState {
  currentPhase: string;
  completedPhases: string[];
  blockers: string[];
  nextPhase?: string;
  estimatedTimeRemaining: number;
}

export interface PhaseTransition {
  from_phase: string;
  to_phase: string;
  user_id: string;
  transition_data?: any;
  timestamp: string;
}

export class JourneyFlowService {
  private static phases: JourneyPhase[] = [
    {
      id: 'welcome',
      title: 'المرحبة والترحيب',
      description: 'نرحب بالمستخدم ونشرح له الرحلة',
      requiredData: [],
      estimatedTime: 2,
      order: 1
    },
    {
      id: 'greeting_preference',
      title: 'تحديد طريقة المخاطبة',
      description: 'اختيار كيفية مناداة المستخدم',
      requiredData: ['greeting_preference'],
      estimatedTime: 1,
      order: 2
    },
    {
      id: 'website_analysis',
      title: 'تحليل الموقع الإلكتروني',
      description: 'تحليل موقع المستخدم أو نشاطه',
      requiredData: ['website_url'],
      estimatedTime: 5,
      order: 3
    },
    {
      id: 'analysis_review',
      title: 'مراجعة نتائج التحليل',
      description: 'عرض ومراجعة نتائج تحليل الموقع',
      requiredData: ['website_analysis_complete'],
      estimatedTime: 3,
      order: 4
    },
    {
      id: 'profile_completion',
      title: 'إكمال الملف التجاري',
      description: 'جمع معلومات الأعمال الأساسية',
      requiredData: ['company_name', 'industry', 'business_type'],
      estimatedTime: 8,
      order: 5
    },
    {
      id: 'professional_analysis',
      title: 'التحليل التسويقي المتقدم',
      description: 'تحليل شامل للوضع التسويقي',
      requiredData: ['marketing_goals', 'target_audience', 'budget'],
      estimatedTime: 10,
      order: 6
    },
    {
      id: 'strategy_generation',
      title: 'توليد الاستراتيجية',
      description: 'إنشاء استراتيجية تسويقية مخصصة',
      requiredData: ['all_data_collected'],
      estimatedTime: 15,
      order: 7
    },
    {
      id: 'commitment_activation',
      title: 'تفعيل الالتزام',
      description: 'الحصول على التزام المستخدم بالتنفيذ',
      requiredData: ['strategy_approved'],
      estimatedTime: 5,
      order: 8
    }
  ];

  static getPhase(phaseId: string): JourneyPhase | undefined {
    return this.phases.find(phase => phase.id === phaseId);
  }

  static getAllPhases(): JourneyPhase[] {
    return this.phases.sort((a, b) => a.order - b.order);
  }

  static getNextPhase(currentPhase: string): string | null {
    const currentPhaseObj = this.getPhase(currentPhase);
    if (!currentPhaseObj) return null;

    const nextPhaseObj = this.phases.find(phase => phase.order === currentPhaseObj.order + 1);
    return nextPhaseObj ? nextPhaseObj.id : null;
  }

  static async getJourneyFlowState(journeyId: string, clientId: string): Promise<JourneyFlowState> {
    try {
      // Since we don't have journey_phase_transitions table, we'll work with user_profiles
      const profile = await UserProfileService.getUserProfile(clientId);
      
      if (!profile) {
        return {
          currentPhase: 'welcome',
          completedPhases: [],
          blockers: [],
          nextPhase: 'greeting_preference',
          estimatedTimeRemaining: this.calculateTotalTime()
        };
      }

      const completedPhases = this.determineCompletedPhases(profile);
      const currentPhase = this.determineCurrentPhase(completedPhases);
      const blockers = this.identifyBlockers(profile, currentPhase);
      const nextPhase = blockers.length === 0 ? this.getNextPhase(currentPhase) : null;

      return {
        currentPhase,
        completedPhases,
        blockers,
        nextPhase: nextPhase || undefined,
        estimatedTimeRemaining: this.calculateRemainingTime(completedPhases)
      };
    } catch (error) {
      console.error('Error getting journey flow state:', error);
      return {
        currentPhase: 'welcome',
        completedPhases: [],
        blockers: ['Error loading journey state'],
        estimatedTimeRemaining: this.calculateTotalTime()
      };
    }
  }

  static async recordPhaseTransition(
    journeyId: string, 
    clientId: string, 
    fromPhase: string, 
    toPhase: string, 
    transitionData?: any
  ): Promise<boolean> {
    try {
      // Since we don't have journey_phase_transitions table, we'll track progress in user_profiles
      const updateData = {
        [`phase_${toPhase}_completed`]: true,
        [`phase_${toPhase}_completed_at`]: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (transitionData) {
        Object.keys(transitionData).forEach(key => {
          updateData[key] = transitionData[key];
        });
      }

      await UserProfileService.saveUserProfile(clientId, updateData);
      return true;
    } catch (error) {
      console.error('Error recording phase transition:', error);
      return false;
    }
  }

  private static determineCompletedPhases(profile: any): string[] {
    const completed = [];
    
    if (profile.greeting_preference) completed.push('welcome', 'greeting_preference');
    if (profile.website_url) completed.push('website_analysis');
    if (profile.website_analysis_complete) completed.push('analysis_review');
    if (profile.company_name && profile.industry) completed.push('profile_completion');
    if (profile.primary_marketing_goals && profile.target_audience) completed.push('professional_analysis');
    if (profile.strategy_generated) completed.push('strategy_generation');
    if (profile.commitment_confirmed) completed.push('commitment_activation');

    return completed;
  }

  private static determineCurrentPhase(completedPhases: string[]): string {
    const allPhases = this.getAllPhases();
    
    for (const phase of allPhases) {
      if (!completedPhases.includes(phase.id)) {
        return phase.id;
      }
    }
    
    return 'commitment_activation'; // Final phase
  }

  private static identifyBlockers(profile: any, currentPhase: string): string[] {
    const blockers = [];
    const phase = this.getPhase(currentPhase);
    
    if (!phase) return blockers;

    phase.requiredData.forEach(requirement => {
      if (!profile[requirement]) {
        blockers.push(`Missing: ${requirement}`);
      }
    });

    return blockers;
  }

  private static calculateTotalTime(): number {
    return this.phases.reduce((total, phase) => total + phase.estimatedTime, 0);
  }

  private static calculateRemainingTime(completedPhases: string[]): number {
    return this.phases
      .filter(phase => !completedPhases.includes(phase.id))
      .reduce((total, phase) => total + phase.estimatedTime, 0);
  }

  static calculateEstimatedTimeRemaining(currentPhase: string, completedPhases: string[]): number {
    return this.calculateRemainingTime(completedPhases);
  }
}
