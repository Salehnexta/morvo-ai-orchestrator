export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      a2a_messages: {
        Row: {
          client_id: string
          context: Json
          correlation_id: string
          created_at: string
          error: string | null
          id: string
          parent_message_id: string | null
          payload: Json
          processing_time_ms: number | null
          project_id: string
          recipient_agent_id: string
          response: Json | null
          sender_agent_id: string
          status: string
          task_type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          context?: Json
          correlation_id: string
          created_at?: string
          error?: string | null
          id?: string
          parent_message_id?: string | null
          payload?: Json
          processing_time_ms?: number | null
          project_id: string
          recipient_agent_id: string
          response?: Json | null
          sender_agent_id: string
          status?: string
          task_type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          context?: Json
          correlation_id?: string
          created_at?: string
          error?: string | null
          id?: string
          parent_message_id?: string | null
          payload?: Json
          processing_time_ms?: number | null
          project_id?: string
          recipient_agent_id?: string
          response?: Json | null
          sender_agent_id?: string
          status?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "a2a_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "a2a_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "a2a_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "a2a_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_performance_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          platform: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          platform: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          platform?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_performance_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_performance_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_activity_log: {
        Row: {
          activity_type: string
          agent_id: string
          client_id: string
          description: string | null
          emotional_tone: string | null
          id: string
          metrics: Json | null
          project_id: string
          timestamp: string
        }
        Insert: {
          activity_type: string
          agent_id: string
          client_id: string
          description?: string | null
          emotional_tone?: string | null
          id?: string
          metrics?: Json | null
          project_id: string
          timestamp?: string
        }
        Update: {
          activity_type?: string
          agent_id?: string
          client_id?: string
          description?: string | null
          emotional_tone?: string | null
          id?: string
          metrics?: Json | null
          project_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_activity_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_memory: {
        Row: {
          agent_id: string
          client_id: string
          content: Json
          conversation_id: string | null
          created_at: string
          embedding: string | null
          expires_at: string | null
          id: string
          importance_score: number | null
          interaction_type: string
          memory_type: string
          metadata: Json | null
          timestamp: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          client_id: string
          content?: Json
          conversation_id?: string | null
          created_at?: string
          embedding?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          interaction_type?: string
          memory_type?: string
          metadata?: Json | null
          timestamp?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          client_id?: string
          content?: Json
          conversation_id?: string | null
          created_at?: string
          embedding?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          interaction_type?: string
          memory_type?: string
          metadata?: Json | null
          timestamp?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_memory_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_metrics: {
        Row: {
          agent_id: string
          id: string
          response_time: number | null
          success_rate: number | null
          task_id: string
          timestamp: string | null
          tokens_used: number | null
        }
        Insert: {
          agent_id: string
          id?: string
          response_time?: number | null
          success_rate?: number | null
          task_id: string
          timestamp?: string | null
          tokens_used?: number | null
        }
        Update: {
          agent_id?: string
          id?: string
          response_time?: number | null
          success_rate?: number | null
          task_id?: string
          timestamp?: string | null
          tokens_used?: number | null
        }
        Relationships: []
      }
      agent_performance: {
        Row: {
          agent_id: string
          client_id: string
          created_at: string
          error_type: string | null
          id: string
          processing_time_ms: number
          project_id: string
          success: boolean
          task_type: string
          tokens_used: number | null
        }
        Insert: {
          agent_id: string
          client_id: string
          created_at?: string
          error_type?: string | null
          id?: string
          processing_time_ms: number
          project_id: string
          success: boolean
          task_type: string
          tokens_used?: number | null
        }
        Update: {
          agent_id?: string
          client_id?: string
          created_at?: string
          error_type?: string | null
          id?: string
          processing_time_ms?: number
          project_id?: string
          success?: boolean
          task_type?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_performance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_performance_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_results: {
        Row: {
          agent_id: string
          chart_configs: Json | null
          company_id: string | null
          created_at: string | null
          execution_time_ms: number | null
          id: string
          input_data: Json | null
          output_data: Json | null
          status: string | null
          task_type: string
          user_id: string | null
        }
        Insert: {
          agent_id: string
          chart_configs?: Json | null
          company_id?: string | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          status?: string | null
          task_type: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string
          chart_configs?: Json | null
          company_id?: string | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          status?: string | null
          task_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          active: boolean
          agent_id: string
          created_at: string
          description: string | null
          goal: string | null
          name: string
          type: string
        }
        Insert: {
          active?: boolean
          agent_id: string
          created_at?: string
          description?: string | null
          goal?: string | null
          name: string
          type: string
        }
        Update: {
          active?: boolean
          agent_id?: string
          created_at?: string
          description?: string | null
          goal?: string | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          client_id: string | null
          content: Json
          created_at: string
          id: string
          insight_type: string
          project_id: string | null
          source_data_ref: string | null
        }
        Insert: {
          client_id?: string | null
          content: Json
          created_at?: string
          id?: string
          insight_type: string
          project_id?: string | null
          source_data_ref?: string | null
        }
        Update: {
          client_id?: string | null
          content?: Json
          created_at?: string
          id?: string
          insight_type?: string
          project_id?: string | null
          source_data_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_usage: {
        Row: {
          client_id: string
          completion_tokens: number
          cost: number
          created_at: string | null
          id: string
          model_name: string
          project_id: string | null
          prompt_tokens: number
          task_id: string | null
          total_tokens: number
        }
        Insert: {
          client_id: string
          completion_tokens: number
          cost: number
          created_at?: string | null
          id?: string
          model_name: string
          project_id?: string | null
          prompt_tokens: number
          task_id?: string | null
          total_tokens: number
        }
        Update: {
          client_id?: string
          completion_tokens?: number
          cost?: number
          created_at?: string | null
          id?: string
          model_name?: string
          project_id?: string | null
          prompt_tokens?: number
          task_id?: string | null
          total_tokens?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_usage_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_model_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          metric_type: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          metric_type: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          metric_type?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage: {
        Row: {
          client_id: string
          cost: number | null
          created_at: string | null
          endpoint: string
          id: string
          latency_ms: number | null
          project_id: string | null
          request_size: number | null
          response_size: number | null
          service_name: string
          status_code: number | null
          success: boolean
        }
        Insert: {
          client_id: string
          cost?: number | null
          created_at?: string | null
          endpoint: string
          id?: string
          latency_ms?: number | null
          project_id?: string | null
          request_size?: number | null
          response_size?: number | null
          service_name: string
          status_code?: number | null
          success: boolean
        }
        Update: {
          client_id?: string
          cost?: number | null
          created_at?: string | null
          endpoint?: string
          id?: string
          latency_ms?: number | null
          project_id?: string | null
          request_size?: number | null
          response_size?: number | null
          service_name?: string
          status_code?: number | null
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      brand24_data: {
        Row: {
          brand_name: string
          competitor_mentions: Json | null
          created_at: string | null
          crisis_alerts: Json | null
          id: string
          influencers: Json | null
          mentions: Json | null
          sentiment_analysis: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand_name: string
          competitor_mentions?: Json | null
          created_at?: string | null
          crisis_alerts?: Json | null
          id?: string
          influencers?: Json | null
          mentions?: Json | null
          sentiment_analysis?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand_name?: string
          competitor_mentions?: Json | null
          created_at?: string | null
          crisis_alerts?: Json | null
          id?: string
          influencers?: Json | null
          mentions?: Json | null
          sentiment_analysis?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand24_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_data: {
        Row: {
          agent_id: string
          chart_type: string
          client_id: string
          created_at: string | null
          data: Json
          id: string
          time_range: string | null
        }
        Insert: {
          agent_id: string
          chart_type: string
          client_id: string
          created_at?: string | null
          data: Json
          id?: string
          time_range?: string | null
        }
        Update: {
          agent_id?: string
          chart_type?: string
          client_id?: string
          created_at?: string | null
          data?: Json
          id?: string
          time_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          api_key: string
          created_at: string
          id: string
          name: string
          quota_limit: number
          quota_used: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          api_key?: string
          created_at?: string
          id?: string
          name: string
          quota_limit?: number
          quota_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          api_key?: string
          created_at?: string
          id?: string
          name?: string
          quota_limit?: number
          quota_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          founded: number | null
          id: string
          industry: string | null
          name: string
          primary_markets: string[] | null
          size: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          founded?: number | null
          id?: string
          industry?: string | null
          name: string
          primary_markets?: string[] | null
          size?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          founded?: number | null
          id?: string
          industry?: string | null
          name?: string
          primary_markets?: string[] | null
          size?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      content_sources_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          project_id: string | null
          source_type: string
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          project_id?: string | null
          source_type: string
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          project_id?: string | null
          source_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_sources_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_sources_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          client_id: string
          content: string
          conversation_id: string | null
          created_at: string
          emotion_analysis: Json | null
          id: string
          metadata: Json | null
          sender_id: string
          sender_type: string
          timestamp: string
        }
        Insert: {
          client_id: string
          content: string
          conversation_id?: string | null
          created_at?: string
          emotion_analysis?: Json | null
          id?: string
          metadata?: Json | null
          sender_id: string
          sender_type: string
          timestamp?: string
        }
        Update: {
          client_id?: string
          content?: string
          conversation_id?: string | null
          created_at?: string
          emotion_analysis?: Json | null
          id?: string
          metadata?: Json | null
          sender_id?: string
          sender_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          budget_range: string | null
          communication_preferences: Json | null
          company_name: string | null
          created_at: string | null
          current_marketing_activities: Json | null
          customer_id: string
          has_marketing_strategy: boolean | null
          id: string
          industry: string | null
          marketing_budget_history: string | null
          marketing_experience_level: string | null
          marketing_knowledge_gaps: Json | null
          marketing_measurement_experience: string | null
          marketing_pain_points: Json | null
          marketing_team_size: string | null
          marketing_tools_used: Json | null
          personality_profile: Json | null
          preferred_marketing_channels: Json | null
          previous_marketing_results: Json | null
          primary_goal: string | null
          session_id: string | null
          social_accounts: Json | null
          status: string | null
          target_customers: string | null
          team_experience: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          budget_range?: string | null
          communication_preferences?: Json | null
          company_name?: string | null
          created_at?: string | null
          current_marketing_activities?: Json | null
          customer_id: string
          has_marketing_strategy?: boolean | null
          id?: string
          industry?: string | null
          marketing_budget_history?: string | null
          marketing_experience_level?: string | null
          marketing_knowledge_gaps?: Json | null
          marketing_measurement_experience?: string | null
          marketing_pain_points?: Json | null
          marketing_team_size?: string | null
          marketing_tools_used?: Json | null
          personality_profile?: Json | null
          preferred_marketing_channels?: Json | null
          previous_marketing_results?: Json | null
          primary_goal?: string | null
          session_id?: string | null
          social_accounts?: Json | null
          status?: string | null
          target_customers?: string | null
          team_experience?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          budget_range?: string | null
          communication_preferences?: Json | null
          company_name?: string | null
          created_at?: string | null
          current_marketing_activities?: Json | null
          customer_id?: string
          has_marketing_strategy?: boolean | null
          id?: string
          industry?: string | null
          marketing_budget_history?: string | null
          marketing_experience_level?: string | null
          marketing_knowledge_gaps?: Json | null
          marketing_measurement_experience?: string | null
          marketing_pain_points?: Json | null
          marketing_team_size?: string | null
          marketing_tools_used?: Json | null
          personality_profile?: Json | null
          preferred_marketing_channels?: Json | null
          previous_marketing_results?: Json | null
          primary_goal?: string | null
          session_id?: string | null
          social_accounts?: Json | null
          status?: string | null
          target_customers?: string | null
          team_experience?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      dashboard_contexts: {
        Row: {
          active_charts: Json | null
          client_id: string
          context_type: string
          id: string
          last_updated: string | null
          metrics_config: Json | null
        }
        Insert: {
          active_charts?: Json | null
          client_id: string
          context_type: string
          id?: string
          last_updated?: string | null
          metrics_config?: Json | null
        }
        Update: {
          active_charts?: Json | null
          client_id?: string
          context_type?: string
          id?: string
          last_updated?: string | null
          metrics_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_contexts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      email_performance_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          metric_type: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          metric_type: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          metric_type?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_performance_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_performance_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      embeddings: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          metadata: Json
          project_id: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          metadata?: Json
          project_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          metadata?: Json
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "embeddings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "embeddings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_journey: {
        Row: {
          adaptation_strategy: string | null
          client_id: string
          emotion_confidence: number | null
          emotional_context: string | null
          engagement_level: string | null
          id: string
          primary_emotion: string | null
          project_id: string
          satisfaction_score: number | null
          stage: string
          timestamp: string
        }
        Insert: {
          adaptation_strategy?: string | null
          client_id: string
          emotion_confidence?: number | null
          emotional_context?: string | null
          engagement_level?: string | null
          id?: string
          primary_emotion?: string | null
          project_id: string
          satisfaction_score?: number | null
          stage: string
          timestamp?: string
        }
        Update: {
          adaptation_strategy?: string | null
          client_id?: string
          emotion_confidence?: number | null
          emotional_context?: string | null
          engagement_level?: string | null
          id?: string
          primary_emotion?: string | null
          project_id?: string
          satisfaction_score?: number | null
          stage?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_journey_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emotional_journey_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_milestones: {
        Row: {
          client_id: string
          description: string | null
          emotion_after: string | null
          emotion_before: string | null
          id: string
          milestone_type: string
          project_id: string
          stage: string
          timestamp: string
        }
        Insert: {
          client_id: string
          description?: string | null
          emotion_after?: string | null
          emotion_before?: string | null
          id?: string
          milestone_type: string
          project_id: string
          stage: string
          timestamp?: string
        }
        Update: {
          client_id?: string
          description?: string | null
          emotion_after?: string | null
          emotion_before?: string | null
          id?: string
          milestone_type?: string
          project_id?: string
          stage?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_milestones_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emotional_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      external_api_configs: {
        Row: {
          api_key_encrypted: string | null
          api_name: string
          config_data: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key_encrypted?: string | null
          api_name: string
          config_data?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key_encrypted?: string | null
          api_name?: string
          config_data?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_api_configs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      external_api_data: {
        Row: {
          api_source: string
          client_id: string
          created_at: string | null
          data_type: string
          id: string
          processed_data: Json | null
          raw_data: Json
        }
        Insert: {
          api_source: string
          client_id: string
          created_at?: string | null
          data_type: string
          id?: string
          processed_data?: Json | null
          raw_data: Json
        }
        Update: {
          api_source?: string
          client_id?: string
          created_at?: string | null
          data_type?: string
          id?: string
          processed_data?: Json | null
          raw_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "external_api_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      integrated_analytics: {
        Row: {
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          data_sources: Json | null
          id: string
          insights: Json
          recommendations: Json | null
          user_id: string
        }
        Insert: {
          analysis_type: string
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: Json | null
          id?: string
          insights?: Json
          recommendations?: Json | null
          user_id: string
        }
        Update: {
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: Json | null
          id?: string
          insights?: Json
          recommendations?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrated_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          client_id: string
          content: string
          conversation_id: string | null
          id: string
          metadata: Json | null
          role: string
          timestamp: string | null
        }
        Insert: {
          client_id: string
          content: string
          conversation_id?: string | null
          id?: string
          metadata?: Json | null
          role: string
          timestamp?: string | null
        }
        Update: {
          client_id?: string
          content?: string
          conversation_id?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          read: boolean | null
          title: string
          type: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          title: string
          type: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      optimization_recommendations: {
        Row: {
          client_id: string | null
          content: Json
          created_at: string
          id: string
          project_id: string | null
          recommendation_type: string
        }
        Insert: {
          client_id?: string | null
          content: Json
          created_at?: string
          id?: string
          project_id?: string | null
          recommendation_type: string
        }
        Update: {
          client_id?: string | null
          content?: Json
          created_at?: string
          id?: string
          project_id?: string | null
          recommendation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimization_recommendations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_recommendations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_analytics: {
        Row: {
          client_id: string | null
          content: Json
          created_at: string
          forecast_type: string
          id: string
          project_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: Json
          created_at?: string
          forecast_type: string
          id?: string
          project_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: Json
          created_at?: string
          forecast_type?: string
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictive_analytics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictive_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          active: boolean
          client_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      semrush_data: {
        Row: {
          backlink_data: Json | null
          competitor_data: Json | null
          created_at: string | null
          domain: string
          id: string
          keyword_rankings: Json | null
          organic_keywords: Json | null
          organic_traffic: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backlink_data?: Json | null
          competitor_data?: Json | null
          created_at?: string | null
          domain: string
          id?: string
          keyword_rankings?: Json | null
          organic_keywords?: Json | null
          organic_traffic?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backlink_data?: Json | null
          competitor_data?: Json | null
          created_at?: string | null
          domain?: string
          id?: string
          keyword_rankings?: Json | null
          organic_keywords?: Json | null
          organic_traffic?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "semrush_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_analytics: {
        Row: {
          audience_insights: Json | null
          content_performance: Json | null
          created_at: string | null
          engagement_data: Json | null
          id: string
          metrics: Json
          platform: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audience_insights?: Json | null
          content_performance?: Json | null
          created_at?: string | null
          engagement_data?: Json | null
          id?: string
          metrics?: Json
          platform: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audience_insights?: Json | null
          content_performance?: Json | null
          created_at?: string | null
          engagement_data?: Json | null
          id?: string
          metrics?: Json
          platform?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_media_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          platform: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          platform: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          platform?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_media_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_media_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          cpu_load: number | null
          created_at: string
          id: string
          memory_usage: number | null
        }
        Insert: {
          cpu_load?: number | null
          created_at?: string
          id?: string
          memory_usage?: number | null
        }
        Update: {
          cpu_load?: number | null
          created_at?: string
          id?: string
          memory_usage?: number | null
        }
        Relationships: []
      }
      system_prompts: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          prompt_content: string
          prompt_type: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          prompt_content: string
          prompt_type: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          prompt_content?: string
          prompt_type?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      task_results: {
        Row: {
          client_id: string
          completed_at: string | null
          correlation_id: string
          created_at: string
          error: string | null
          id: string
          project_id: string
          request: Json
          result: Json | null
          status: string
          task_type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          correlation_id: string
          created_at?: string
          error?: string | null
          id?: string
          project_id: string
          request?: Json
          result?: Json | null
          status?: string
          task_type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          correlation_id?: string
          created_at?: string
          error?: string | null
          id?: string
          project_id?: string
          request?: Json
          result?: Json | null
          status?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_results_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          agent_id: string
          client_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          payload: Json | null
          result: Json | null
          status: string | null
          task_type: string
        }
        Insert: {
          agent_id: string
          client_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          payload?: Json | null
          result?: Json | null
          status?: string | null
          task_type: string
        }
        Update: {
          agent_id?: string
          client_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          payload?: Json | null
          result?: Json | null
          status?: string | null
          task_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_contexts: {
        Row: {
          context_data: Json
          context_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_data?: Json
          context_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_data?: Json
          context_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      website_intel_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          metric_type: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          metric_type: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          metric_type?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_intel_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_intel_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_user_onboarding_update: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      initialize_conversation_system: {
        Args: Record<PropertyKey, never>
        Returns: {
          client_id: string
          conversation_id: string
          client_name: string
        }[]
      }
      link_clients_to_auth: {
        Args: Record<PropertyKey, never>
        Returns: {
          client_id: string
          auth_user_id: string
          client_name: string
        }[]
      }
      user_owns_company: {
        Args:
          | { company_id: string }
          | { p_user_id: string; p_company_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
