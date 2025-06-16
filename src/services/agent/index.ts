
export * from "./types";
export { AgentResponseParser } from "./responseParser";
export { AgentCustomerDataService } from "./customerDataService";
export { AgentResponseHandler } from "./responseHandler";

// Main service class that combines all functionality
export class AgentControlService {
  static parseAgentResponse = AgentResponseParser.parseAgentResponse;
  static saveCustomerData = AgentCustomerDataService.saveCustomerData;
  static getCustomerData = AgentCustomerDataService.getCustomerData;
  static enrichAgentContext = AgentCustomerDataService.enrichAgentContext;
  static processUserResponse = AgentResponseHandler.processUserResponse;
}
