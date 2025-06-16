
export interface AgentCommand {
  type: 'button' | 'form' | 'info_request' | 'save_data';
  data: any;
  id: string;
}

export interface AgentResponse {
  type: string;
  data: any;
  timestamp: string;
}
