
import { supabase } from "@/integrations/supabase/client";
import { JourneyManager } from "./journeyManager";
import { MorvoAIService } from "./morvoAIService";

export interface JourneyPhase {
  id: string;
  name: string;
  title: string;
  description: string;
  required: boolean;
  estimatedDuration: number; // in minutes
  prerequisites?: string[];
}

export interface JourneyFlowState {
  currentPhase: string;
  completedPhases: string[];
  availablePhases: string[];
  progress: number;
  canProceed: boolean;
  nextPhase?: string;
  blockers?: string[];
}

export class JourneyFlowService {
  private static readonly JOURNEY_PHASES: JourneyPhase[] = [
    {
      id: 'welcome',
      name: 'مرحبا',
      title: 'مرحباً بك في مورفو AI',
      description: 'ابدأ رحلتك التسويقية معنا',
      required: true,
      estimatedDuration: 2
    },
    {
      id: 'greeting_preference',
      name: 'التفضيلات',
      title: 'كيف تفضل أن نخاطبك؟',
      description: 'اختر طريقة التخاطب المناسبة لك',
      required: true,
      estimatedDuration: 1
    },
    {
      id: 'website_analysis',
      name: 'تحليل الموقع',
      title: 'تحليل موقعك الإلكتروني',
      description: 'دعنا نحلل موقعك لفهم أعمالك بشكل أفضل',
      required: false,
      estimatedDuration: 5,
      prerequisites: ['greeting_preference']
    },
    {
      id: 'analysis_review',
      name: 'مراجعة التحليل',
      title: 'مراجعة نتائج التحليل',
      description: 'استعرض النتائج التي توصلنا إليها',
      required: false,
      estimatedDuration: 3,
      prerequisites: ['website_analysis']
    },
    {
      id: 'profile_completion',
      name: 'إكمال الملف',
      title: 'إكمال ملفك التجاري',
      description: 'أخبرنا المزيد عن أعمالك وأهدافك',
      required: true,
      estimatedDuration: 8,
      prerequisites: ['greeting_preference']
    },
    {
      id: 'professional_analysis',
      name: 'التحليل المتقدم',
      title: 'التحليل التسويقي المتقدم',
      description: 'تحليل شامل لوضعك التسويقي الحالي',
      required: true,
      estimatedDuration: 10,
      prerequisites: ['profile_completion']
    },
    {
      id: 'strategy_generation',
      name: 'إنشاء الاستراتيجية',
      title: 'إنشاء استراتيجيتك التسويقية',
      description: 'تطوير استراتيجية تسويقية مخصصة لأعمالك',
      required: true,
      estimatedDuration: 15,
      prerequisites: ['professional_analysis']
    },
    {
      id: 'commitment_activation',
      name: 'تفعيل الخطة',
      title: 'تفعيل خطتك التسويقية',
      description: 'ابدأ تنفيذ استراتيجيتك التسويقية',
      required: true,
      estimatedDuration: 5,
      prerequisites: ['strategy_generation']
    }
  ];

  static getPhase(phaseId: string): JourneyPhase | null {
    return this.JOURNEY_PHASES.find(phase => phase.id === phaseId) || null;
  }

  static getAllPhases(): JourneyPhase[] {
    return [...this.JOURNEY_PHASES];
  }

  static async getJourneyFlowState(journeyId: string, clientId: string): Promise<JourneyFlowState> {
    try {
      // Get journey status from the journey manager
      const journeyStatus = await JourneyManager.getJourneyStatus(journeyId);
      const currentPhase = journeyStatus?.current_phase || 'welcome';
      
      // Get completed phases from database
      const { data: transitions } = await supabase
        .from('journey_phase_transitions')
        .select('to_phase')
        .eq('journey_id', journeyId)
        .order('transition_time', { ascending: true });

      const completedPhases = transitions?.map(t => t.to_phase) || [];
      const currentPhaseIndex = this.JOURNEY_PHASES.findIndex(p => p.id === currentPhase);
      
      // Calculate available phases based on prerequisites
      const availablePhases = this.JOURNEY_PHASES.filter(phase => {
        if (phase.prerequisites && phase.prerequisites.length > 0) {
          return phase.prerequisites.every(prereq => completedPhases.includes(prereq));
        }
        return true;
      }).map(p => p.id);

      // Calculate progress
      const totalRequiredPhases = this.JOURNEY_PHASES.filter(p => p.required).length;
      const completedRequiredPhases = completedPhases.filter(phase => 
        this.JOURNEY_PHASES.find(p => p.id === phase && p.required)
      ).length;
      const progress = Math.round((completedRequiredPhases / totalRequiredPhases) * 100);

      // Determine next phase
      const nextPhaseIndex = currentPhaseIndex + 1;
      const nextPhase = nextPhaseIndex < this.JOURNEY_PHASES.length 
        ? this.JOURNEY_PHASES[nextPhaseIndex].id 
        : undefined;

      // Check for blockers
      const blockers: string[] = [];
      const currentPhaseData = this.getPhase(currentPhase);
      if (currentPhaseData?.prerequisites) {
        const missingPrereqs = currentPhaseData.prerequisites.filter(
          prereq => !completedPhases.includes(prereq)
        );
        if (missingPrereqs.length > 0) {
          blockers.push(`Missing prerequisites: ${missingPrereqs.join(', ')}`);
        }
      }

      return {
        currentPhase,
        completedPhases,
        availablePhases,
        progress,
        canProceed: blockers.length === 0,
        nextPhase,
        blockers: blockers.length > 0 ? blockers : undefined
      };
    } catch (error) {
      console.error('❌ Error getting journey flow state:', error);
      return {
        currentPhase: 'welcome',
        completedPhases: [],
        availablePhases: ['welcome'],
        progress: 0,
        canProceed: true
      };
    }
  }

  static async recordPhaseTransition(
    journeyId: string, 
    clientId: string, 
    fromPhase: string | null, 
    toPhase: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('journey_phase_transitions')
        .insert({
          journey_id: journeyId,
          client_id: clientId,
          from_phase: fromPhase,
          to_phase: toPhase,
          metadata: metadata || {}
        });

      if (error) {
        console.error('❌ Error recording phase transition:', error);
        return false;
      }

      console.log(`✅ Phase transition recorded: ${fromPhase} -> ${toPhase}`);
      return true;
    } catch (error) {
      console.error('❌ Error in recordPhaseTransition:', error);
      return false;
    }
  }

  static calculateEstimatedTimeRemaining(currentPhase: string, completedPhases: string[]): number {
    const currentPhaseIndex = this.JOURNEY_PHASES.findIndex(p => p.id === currentPhase);
    if (currentPhaseIndex === -1) return 0;

    const remainingPhases = this.JOURNEY_PHASES.slice(currentPhaseIndex);
    const incompletePhases = remainingPhases.filter(phase => 
      !completedPhases.includes(phase.id)
    );

    return incompletePhases.reduce((total, phase) => total + phase.estimatedDuration, 0);
  }

  static getPhaseProgress(phaseId: string): number {
    const phaseIndex = this.JOURNEY_PHASES.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return 0;
    return Math.round(((phaseIndex + 1) / this.JOURNEY_PHASES.length) * 100);
  }
}
