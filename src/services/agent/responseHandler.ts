
import { supabase } from "@/integrations/supabase/client";
import { AgentResponse } from "./types";

export class ResponseHandler {
  static async logMessage(
    clientId: string,
    conversationId: string,
    content: string,
    messageType: 'user' | 'assistant'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          client_id: clientId,
          content: content,
          role: messageType,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error logging message:', error);
      }
    } catch (error) {
      console.error('Error in logMessage:', error);
    }
  }

  static async parseAgentResponse(response: string): Promise<AgentResponse> {
    try {
      const parsedResponse = JSON.parse(response);
      return {
        text: parsedResponse.text || parsedResponse.response || 'لا توجد استجابة',
        suggested_actions: parsedResponse.suggested_actions || [],
        processing_time: parsedResponse.processing_time || 0,
        tokens_used: parsedResponse.tokens_used || 0,
        personality_traits: parsedResponse.personality_traits || {}
      };
    } catch (error) {
      console.error('Error parsing agent response:', error);
      return {
        text: response || 'لا توجد استجابة',
        suggested_actions: [],
        processing_time: 0,
        tokens_used: 0,
        personality_traits: {}
      };
    }
  }
}
