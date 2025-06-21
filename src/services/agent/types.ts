
export interface AgentResponse {
  text: string;
  suggested_actions?: Array<{
    action: string;
    urgency: string;
    estimated_impact: string;
  }>;
  processing_time?: number;
  tokens_used?: number;
  personality_traits?: any;
}

export interface AgentRequest {
  message: string;
  context?: any;
  agent_id?: string;
}

export interface CustomerData {
  company_name?: string;
  industry?: string;
  marketing_goals?: string[];
  budget_range?: string;
  urgency_level?: string;
  target_audience?: string;
  preferred_language?: string;
}
