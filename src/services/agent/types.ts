
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

export interface AgentCommand {
  id: string;
  type: 'button' | 'form' | 'save_data' | 'info_request';
  data: {
    buttons?: Array<{
      text: string;
      action: string;
      variant: string;
    }>;
    title?: string;
    fields?: Array<{
      name: string;
      label: string;
      type: 'text' | 'email' | 'tel' | 'number';
      required: boolean;
      placeholder: string;
    }>;
    message?: string;
  };
}
