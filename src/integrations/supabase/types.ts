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
      admin_dashboard_stats: {
        Row: {
          calculated_at: string | null
          created_at: string | null
          id: string
          metric_name: string
          metric_value: Json
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string | null
          id?: string
          metric_name: string
          metric_value?: Json
        }
        Update: {
          calculated_at?: string | null
          created_at?: string | null
          id?: string
          metric_name?: string
          metric_value?: Json
        }
        Relationships: []
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
      agent_memories: {
        Row: {
          access_count: number | null
          agent_id: string
          client_id: string
          content: Json
          created_at: string | null
          id: string
          importance: number | null
          last_accessed_at: string | null
          memory_type: string
          updated_at: string | null
        }
        Insert: {
          access_count?: number | null
          agent_id: string
          client_id: string
          content: Json
          created_at?: string | null
          id?: string
          importance?: number | null
          last_accessed_at?: string | null
          memory_type: string
          updated_at?: string | null
        }
        Update: {
          access_count?: number | null
          agent_id?: string
          client_id?: string
          content?: Json
          created_at?: string | null
          id?: string
          importance?: number | null
          last_accessed_at?: string | null
          memory_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_memories_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_memory: {
        Row: {
          agent_id: string | null
          client_id: string
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          importance_score: number | null
          memory_type: string
          timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          client_id: string
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          importance_score?: number | null
          memory_type: string
          timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          client_id?: string
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          importance_score?: number | null
          memory_type?: string
          timestamp?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      billing_history: {
        Row: {
          amount: number
          billing_period_end: string
          billing_period_start: string
          created_at: string | null
          currency: string | null
          id: string
          invoice_url: string | null
          payment_transaction_id: string | null
          status: string | null
          subscription_id: string
        }
        Insert: {
          amount: number
          billing_period_end: string
          billing_period_start: string
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_transaction_id?: string | null
          status?: string | null
          subscription_id: string
        }
        Update: {
          amount?: number
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_transaction_id?: string | null
          status?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_payment_transaction_id_fkey"
            columns: ["payment_transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
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
      business_impact: {
        Row: {
          attribution_confidence: number | null
          baseline_value: number | null
          client_id: string
          created_at: string
          current_value: number | null
          id: string
          impact_data: Json | null
          impact_type: string
          improvement_percentage: number | null
          measured_at: string
          measurement_period: string
        }
        Insert: {
          attribution_confidence?: number | null
          baseline_value?: number | null
          client_id: string
          created_at?: string
          current_value?: number | null
          id?: string
          impact_data?: Json | null
          impact_type: string
          improvement_percentage?: number | null
          measured_at?: string
          measurement_period: string
        }
        Update: {
          attribution_confidence?: number | null
          baseline_value?: number | null
          client_id?: string
          created_at?: string
          current_value?: number | null
          id?: string
          impact_data?: Json | null
          impact_type?: string
          improvement_percentage?: number | null
          measured_at?: string
          measurement_period?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_impact_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      business_insights: {
        Row: {
          business_profile_id: string
          client_id: string
          confidence_score: number | null
          created_at: string | null
          data_sources: Json | null
          description: string
          id: string
          impact_score: number | null
          insight_category: string
          insight_data: Json | null
          insight_type: string
          metrics: Json | null
          priority_score: number | null
          recommendations: Json | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          business_profile_id: string
          client_id: string
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: Json | null
          description: string
          id?: string
          impact_score?: number | null
          insight_category: string
          insight_data?: Json | null
          insight_type: string
          metrics?: Json | null
          priority_score?: number | null
          recommendations?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          business_profile_id?: string
          client_id?: string
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: Json | null
          description?: string
          id?: string
          impact_score?: number | null
          insight_category?: string
          insight_data?: Json | null
          insight_type?: string
          metrics?: Json | null
          priority_score?: number | null
          recommendations?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_insights_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_insights_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          budget_currency: string | null
          business_maturity_score: number | null
          business_type: string | null
          client_id: string
          company_name: string
          company_size: string | null
          competitive_advantages: string[] | null
          created_at: string | null
          current_marketing_budget: number | null
          current_marketing_channels: Json | null
          founded_year: number | null
          geographic_targets: string[] | null
          id: string
          industry: string | null
          location: string | null
          main_competitors: string[] | null
          market_positioning: string | null
          marketing_experience: string | null
          marketing_readiness_score: number | null
          marketing_tools_used: string[] | null
          monthly_revenue: number | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          previous_marketing_campaigns: Json | null
          pricing_strategy: string | null
          primary_marketing_goals: string[] | null
          products_services: Json | null
          profile_completeness_score: number | null
          target_audience: Json | null
          unique_value_proposition: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          budget_currency?: string | null
          business_maturity_score?: number | null
          business_type?: string | null
          client_id: string
          company_name: string
          company_size?: string | null
          competitive_advantages?: string[] | null
          created_at?: string | null
          current_marketing_budget?: number | null
          current_marketing_channels?: Json | null
          founded_year?: number | null
          geographic_targets?: string[] | null
          id?: string
          industry?: string | null
          location?: string | null
          main_competitors?: string[] | null
          market_positioning?: string | null
          marketing_experience?: string | null
          marketing_readiness_score?: number | null
          marketing_tools_used?: string[] | null
          monthly_revenue?: number | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          previous_marketing_campaigns?: Json | null
          pricing_strategy?: string | null
          primary_marketing_goals?: string[] | null
          products_services?: Json | null
          profile_completeness_score?: number | null
          target_audience?: Json | null
          unique_value_proposition?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          budget_currency?: string | null
          business_maturity_score?: number | null
          business_type?: string | null
          client_id?: string
          company_name?: string
          company_size?: string | null
          competitive_advantages?: string[] | null
          created_at?: string | null
          current_marketing_budget?: number | null
          current_marketing_channels?: Json | null
          founded_year?: number | null
          geographic_targets?: string[] | null
          id?: string
          industry?: string | null
          location?: string | null
          main_competitors?: string[] | null
          market_positioning?: string | null
          marketing_experience?: string | null
          marketing_readiness_score?: number | null
          marketing_tools_used?: string[] | null
          monthly_revenue?: number | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          previous_marketing_campaigns?: Json | null
          pricing_strategy?: string | null
          primary_marketing_goals?: string[] | null
          products_services?: Json | null
          profile_completeness_score?: number | null
          target_audience?: Json | null
          unique_value_proposition?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
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
      client_context: {
        Row: {
          business_type: string | null
          client_id: string
          company_size: string | null
          created_at: string | null
          id: string
          industry: string | null
          marketing_budget: string | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          business_type?: string | null
          client_id: string
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          marketing_budget?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          business_type?: string | null
          client_id?: string
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          marketing_budget?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_context_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_experience: {
        Row: {
          arabic_first: boolean | null
          client_id: string
          communication_style: string | null
          created_at: string
          email_frequency: string | null
          enable_notifications: boolean | null
          formality_level: string | null
          greeting_preference: string | null
          id: string
          preferred_language: string | null
          show_detailed_analytics: boolean | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          arabic_first?: boolean | null
          client_id: string
          communication_style?: string | null
          created_at?: string
          email_frequency?: string | null
          enable_notifications?: boolean | null
          formality_level?: string | null
          greeting_preference?: string | null
          id?: string
          preferred_language?: string | null
          show_detailed_analytics?: boolean | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          arabic_first?: boolean | null
          client_id?: string
          communication_style?: string | null
          created_at?: string
          email_frequency?: string | null
          enable_notifications?: boolean | null
          formality_level?: string | null
          greeting_preference?: string | null
          id?: string
          preferred_language?: string | null
          show_detailed_analytics?: boolean | null
          theme_preference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_experience_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          best_sales_season: string | null
          biggest_challenge: string | null
          client_id: string
          communication_preferences: Json | null
          company_size: string | null
          competitive_advantage: string | null
          completeness_score: number | null
          created_at: string
          current_marketing_tools: Json | null
          current_sales: string | null
          customer_sources: string | null
          id: string
          industry: string | null
          marketing_budget: string | null
          marketing_experience: string | null
          marketing_priority: string | null
          most_profitable_product: string | null
          personality_profile: Json | null
          primary_goal: string | null
          target_region: string | null
          team_size: string | null
          updated_at: string
          years_in_business: number | null
        }
        Insert: {
          best_sales_season?: string | null
          biggest_challenge?: string | null
          client_id: string
          communication_preferences?: Json | null
          company_size?: string | null
          competitive_advantage?: string | null
          completeness_score?: number | null
          created_at?: string
          current_marketing_tools?: Json | null
          current_sales?: string | null
          customer_sources?: string | null
          id?: string
          industry?: string | null
          marketing_budget?: string | null
          marketing_experience?: string | null
          marketing_priority?: string | null
          most_profitable_product?: string | null
          personality_profile?: Json | null
          primary_goal?: string | null
          target_region?: string | null
          team_size?: string | null
          updated_at?: string
          years_in_business?: number | null
        }
        Update: {
          best_sales_season?: string | null
          biggest_challenge?: string | null
          client_id?: string
          communication_preferences?: Json | null
          company_size?: string | null
          competitive_advantage?: string | null
          completeness_score?: number | null
          created_at?: string
          current_marketing_tools?: Json | null
          current_sales?: string | null
          customer_sources?: string | null
          id?: string
          industry?: string | null
          marketing_budget?: string | null
          marketing_experience?: string | null
          marketing_priority?: string | null
          most_profitable_product?: string | null
          personality_profile?: Json | null
          primary_goal?: string | null
          target_region?: string | null
          team_size?: string | null
          updated_at?: string
          years_in_business?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          api_key: string
          business_type: string | null
          company_name: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          metadata: Json | null
          name: string | null
          quota_limit: number
          quota_used: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          api_key?: string
          business_type?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          name?: string | null
          quota_limit?: number
          quota_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          api_key?: string
          business_type?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          name?: string | null
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
      competitive_intelligence: {
        Row: {
          client_id: string
          competitive_advantages: Json | null
          competitor_name: string
          competitor_url: string | null
          created_at: string
          id: string
          intelligence_data: Json
          last_analyzed: string
          opportunity_gaps: Json | null
          threat_level: string | null
        }
        Insert: {
          client_id: string
          competitive_advantages?: Json | null
          competitor_name: string
          competitor_url?: string | null
          created_at?: string
          id?: string
          intelligence_data?: Json
          last_analyzed?: string
          opportunity_gaps?: Json | null
          threat_level?: string | null
        }
        Update: {
          client_id?: string
          competitive_advantages?: Json | null
          competitor_name?: string
          competitor_url?: string | null
          created_at?: string
          id?: string
          intelligence_data?: Json
          last_analyzed?: string
          opportunity_gaps?: Json | null
          threat_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitive_intelligence_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
      content_strategies: {
        Row: {
          client_id: string
          content_calendar: Json | null
          content_types: Json
          created_at: string
          cultural_adaptations: Json | null
          id: string
          performance_metrics: Json | null
          status: string | null
          strategy_name: string
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          client_id: string
          content_calendar?: Json | null
          content_types?: Json
          created_at?: string
          cultural_adaptations?: Json | null
          id?: string
          performance_metrics?: Json | null
          status?: string | null
          strategy_name: string
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          content_calendar?: Json | null
          content_types?: Json
          created_at?: string
          cultural_adaptations?: Json | null
          id?: string
          performance_metrics?: Json | null
          status?: string | null
          strategy_name?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_strategies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          client_id: string
          conversation_id: string
          created_at: string | null
          id: string
          message_content: string
          message_type: string | null
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          conversation_id: string
          created_at?: string | null
          id?: string
          message_content: string
          message_type?: string | null
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          message_content?: string
          message_type?: string | null
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          companion_name: string | null
          created_at: string
          id: string
          last_message_at: string | null
          metadata: Json | null
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          companion_name?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          companion_name?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          status?: string | null
          title?: string | null
          updated_at?: string
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
      cross_agent_context: {
        Row: {
          context_data: Json
          context_key: string
          context_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          shared_with: Json | null
          source_agent_id: string | null
          updated_at: string | null
        }
        Insert: {
          context_data: Json
          context_key: string
          context_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          shared_with?: Json | null
          source_agent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          context_data?: Json
          context_key?: string
          context_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          shared_with?: Json | null
          source_agent_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cultural_calendar: {
        Row: {
          business_impact: Json | null
          created_at: string
          end_date: string | null
          event_name: string
          event_type: string
          id: string
          impact_level: string | null
          marketing_adaptations: Json | null
          start_date: string
        }
        Insert: {
          business_impact?: Json | null
          created_at?: string
          end_date?: string | null
          event_name: string
          event_type: string
          id?: string
          impact_level?: string | null
          marketing_adaptations?: Json | null
          start_date: string
        }
        Update: {
          business_impact?: Json | null
          created_at?: string
          end_date?: string | null
          event_name?: string
          event_type?: string
          id?: string
          impact_level?: string | null
          marketing_adaptations?: Json | null
          start_date?: string
        }
        Relationships: []
      }
      cultural_contexts: {
        Row: {
          adaptation_rules: Json | null
          business_culture: string | null
          client_id: string
          communication_style: string | null
          created_at: string
          cultural_events: Json | null
          cultural_profile: string | null
          id: string
          language_preference: string | null
          location: string
          religious_context: Json | null
          time_preferences: Json | null
          updated_at: string
        }
        Insert: {
          adaptation_rules?: Json | null
          business_culture?: string | null
          client_id: string
          communication_style?: string | null
          created_at?: string
          cultural_events?: Json | null
          cultural_profile?: string | null
          id?: string
          language_preference?: string | null
          location?: string
          religious_context?: Json | null
          time_preferences?: Json | null
          updated_at?: string
        }
        Update: {
          adaptation_rules?: Json | null
          business_culture?: string | null
          client_id?: string
          communication_style?: string | null
          created_at?: string
          cultural_events?: Json | null
          cultural_profile?: string | null
          id?: string
          language_preference?: string | null
          location?: string
          religious_context?: Json | null
          time_preferences?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cultural_contexts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          client_id: string
          created_at: string | null
          customer_id: string | null
          demographics: Json | null
          id: string
          preferences: Json | null
          preferred_language: string | null
          profile_data: Json | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          customer_id?: string | null
          demographics?: Json | null
          id?: string
          preferences?: Json | null
          preferred_language?: string | null
          profile_data?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          customer_id?: string | null
          demographics?: Json | null
          id?: string
          preferences?: Json | null
          preferred_language?: string | null
          profile_data?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
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
      emotional_contexts: {
        Row: {
          active: boolean | null
          adaptation_strategy: string | null
          client_id: string
          confidence: number
          context_data: Json | null
          conversation_id: string | null
          created_at: string
          detected_triggers: string[] | null
          emotional_intensity: number | null
          id: string
          primary_emotion: string
          timestamp: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          adaptation_strategy?: string | null
          client_id: string
          confidence: number
          context_data?: Json | null
          conversation_id?: string | null
          created_at?: string
          detected_triggers?: string[] | null
          emotional_intensity?: number | null
          id?: string
          primary_emotion: string
          timestamp?: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          adaptation_strategy?: string | null
          client_id?: string
          confidence?: number
          context_data?: Json | null
          conversation_id?: string | null
          created_at?: string
          detected_triggers?: string[] | null
          emotional_intensity?: number | null
          id?: string
          primary_emotion?: string
          timestamp?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_contexts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
      feature_usage: {
        Row: {
          client_id: string
          created_at: string | null
          feature_name: string
          id: string
          metadata: Json | null
          subscription_id: string
          usage_count: number | null
          usage_date: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          feature_name: string
          id?: string
          metadata?: Json | null
          subscription_id: string
          usage_count?: number | null
          usage_date?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          feature_name?: string
          id?: string
          metadata?: Json | null
          subscription_id?: string
          usage_count?: number | null
          usage_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_usage_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_content: {
        Row: {
          client_id: string
          content: string
          content_type: string
          created_at: string
          created_by_agent: string | null
          cultural_compliance_score: number | null
          cultural_version: string | null
          id: string
          performance_prediction: Json | null
          seo_keywords: string[] | null
          status: string | null
          target_platform: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content: string
          content_type: string
          created_at?: string
          created_by_agent?: string | null
          cultural_compliance_score?: number | null
          cultural_version?: string | null
          id?: string
          performance_prediction?: Json | null
          seo_keywords?: string[] | null
          status?: string | null
          target_platform?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string
          content_type?: string
          created_at?: string
          created_by_agent?: string | null
          cultural_compliance_score?: number | null
          cultural_version?: string | null
          id?: string
          performance_prediction?: Json | null
          seo_keywords?: string[] | null
          status?: string | null
          target_platform?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_content_client_id_fkey"
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
      journey_phase_transitions: {
        Row: {
          client_id: string
          created_at: string
          duration_seconds: number | null
          from_phase: string | null
          id: string
          journey_id: string
          metadata: Json | null
          to_phase: string
          transition_time: string
        }
        Insert: {
          client_id: string
          created_at?: string
          duration_seconds?: number | null
          from_phase?: string | null
          id?: string
          journey_id: string
          metadata?: Json | null
          to_phase: string
          transition_time?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          duration_seconds?: number | null
          from_phase?: string | null
          id?: string
          journey_id?: string
          metadata?: Json | null
          to_phase?: string
          transition_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_phase_transitions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_insights: {
        Row: {
          actionable_steps: Json | null
          client_id: string
          confidence_score: number | null
          created_at: string
          data_sources: Json | null
          id: string
          insight_description: string
          insight_title: string
          insight_type: string
          is_active: boolean | null
          priority_score: number | null
          updated_at: string
        }
        Insert: {
          actionable_steps?: Json | null
          client_id: string
          confidence_score?: number | null
          created_at?: string
          data_sources?: Json | null
          id?: string
          insight_description: string
          insight_title: string
          insight_type: string
          is_active?: boolean | null
          priority_score?: number | null
          updated_at?: string
        }
        Update: {
          actionable_steps?: Json | null
          client_id?: string
          confidence_score?: number | null
          created_at?: string
          data_sources?: Json | null
          id?: string
          insight_description?: string
          insight_title?: string
          insight_type?: string
          is_active?: boolean | null
          priority_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_insights_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_preferences: {
        Row: {
          channels: Json | null
          client_id: string
          created_at: string | null
          id: string
          preferences: Json | null
          targeting: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          channels?: Json | null
          client_id: string
          created_at?: string | null
          id?: string
          preferences?: Json | null
          targeting?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          channels?: Json | null
          client_id?: string
          created_at?: string | null
          id?: string
          preferences?: Json | null
          targeting?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          agent_id: string | null
          client_id: string | null
          content: string
          conversation_id: string
          created_at: string
          emotion_analysis: Json | null
          id: string
          metadata: Json | null
          role: string
          timestamp: string | null
        }
        Insert: {
          agent_id?: string | null
          client_id?: string | null
          content: string
          conversation_id: string
          created_at?: string
          emotion_analysis?: Json | null
          id?: string
          metadata?: Json | null
          role: string
          timestamp?: string | null
        }
        Update: {
          agent_id?: string | null
          client_id?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          emotion_analysis?: Json | null
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
      onboarding_journeys: {
        Row: {
          analysis_completed_at: string | null
          analysis_error: string | null
          analysis_results: Json | null
          answer_best_season: string | null
          answer_biggest_challenge: string | null
          answer_company_size: string | null
          answer_competitive_advantage: string | null
          answer_current_sales: string | null
          answer_customer_sources: string | null
          answer_experience_level: string | null
          answer_industry: string | null
          answer_marketing_budget: string | null
          answer_marketing_experience: string | null
          answer_marketing_priority: string | null
          answer_monthly_budget: string | null
          answer_monthly_sales: string | null
          answer_most_profitable: string | null
          answer_primary_goal: string | null
          answer_target_region: string | null
          answer_team_size: string | null
          answer_years_in_business: number | null
          business_type: string | null
          client_id: string
          client_name: string | null
          completed_at: string | null
          created_at: string
          current_phase: string
          greeting_preference: string | null
          id: string
          is_completed: boolean | null
          journey_id: string | null
          phase_status: string | null
          phase_updated_at: string | null
          professional_analysis: Json | null
          profile_progress: number | null
          progress_percentage: number | null
          start_time: string
          strategy_90_days: Json | null
          total_tokens_consumed: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          analysis_completed_at?: string | null
          analysis_error?: string | null
          analysis_results?: Json | null
          answer_best_season?: string | null
          answer_biggest_challenge?: string | null
          answer_company_size?: string | null
          answer_competitive_advantage?: string | null
          answer_current_sales?: string | null
          answer_customer_sources?: string | null
          answer_experience_level?: string | null
          answer_industry?: string | null
          answer_marketing_budget?: string | null
          answer_marketing_experience?: string | null
          answer_marketing_priority?: string | null
          answer_monthly_budget?: string | null
          answer_monthly_sales?: string | null
          answer_most_profitable?: string | null
          answer_primary_goal?: string | null
          answer_target_region?: string | null
          answer_team_size?: string | null
          answer_years_in_business?: number | null
          business_type?: string | null
          client_id: string
          client_name?: string | null
          completed_at?: string | null
          created_at?: string
          current_phase?: string
          greeting_preference?: string | null
          id?: string
          is_completed?: boolean | null
          journey_id?: string | null
          phase_status?: string | null
          phase_updated_at?: string | null
          professional_analysis?: Json | null
          profile_progress?: number | null
          progress_percentage?: number | null
          start_time?: string
          strategy_90_days?: Json | null
          total_tokens_consumed?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          analysis_completed_at?: string | null
          analysis_error?: string | null
          analysis_results?: Json | null
          answer_best_season?: string | null
          answer_biggest_challenge?: string | null
          answer_company_size?: string | null
          answer_competitive_advantage?: string | null
          answer_current_sales?: string | null
          answer_customer_sources?: string | null
          answer_experience_level?: string | null
          answer_industry?: string | null
          answer_marketing_budget?: string | null
          answer_marketing_experience?: string | null
          answer_marketing_priority?: string | null
          answer_monthly_budget?: string | null
          answer_monthly_sales?: string | null
          answer_most_profitable?: string | null
          answer_primary_goal?: string | null
          answer_target_region?: string | null
          answer_team_size?: string | null
          answer_years_in_business?: number | null
          business_type?: string | null
          client_id?: string
          client_name?: string | null
          completed_at?: string | null
          created_at?: string
          current_phase?: string
          greeting_preference?: string | null
          id?: string
          is_completed?: boolean | null
          journey_id?: string | null
          phase_status?: string | null
          phase_updated_at?: string | null
          professional_analysis?: Json | null
          profile_progress?: number | null
          progress_percentage?: number | null
          start_time?: string
          strategy_90_days?: Json | null
          total_tokens_consumed?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_journeys_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          client_id: string
          completed_at: string | null
          completed_steps: Json
          completion_percentage: number
          created_at: string
          current_step: number
          id: string
          is_completed: boolean
          step_data: Json
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          completed_steps?: Json
          completion_percentage?: number
          created_at?: string
          current_step?: number
          id?: string
          is_completed?: boolean
          step_data?: Json
          total_steps?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          completed_steps?: Json
          completion_percentage?: number
          created_at?: string
          current_step?: number
          id?: string
          is_completed?: boolean
          step_data?: Json
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_client_id_fkey"
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
      orders: {
        Row: {
          amount: number
          billing_cycle: string | null
          created_at: string
          currency: string | null
          id: string
          plan_id: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          billing_cycle?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          plan_id?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          billing_cycle?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          plan_id?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          client_id: string
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          moyasar_payment_id: string | null
          moyasar_response: Json | null
          payment_method: string | null
          status: string | null
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          moyasar_payment_id?: string | null
          moyasar_response?: Json | null
          payment_method?: string | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          moyasar_payment_id?: string | null
          moyasar_response?: Json | null
          payment_method?: string | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
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
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      roi_predictions: {
        Row: {
          accuracy_score: number | null
          actual_results: Json | null
          baseline_metrics: Json
          client_id: string
          created_at: string
          id: string
          predicted_metrics: Json
          prediction_confidence: number | null
          prediction_type: string
          time_horizon: string
          updated_at: string
        }
        Insert: {
          accuracy_score?: number | null
          actual_results?: Json | null
          baseline_metrics?: Json
          client_id: string
          created_at?: string
          id?: string
          predicted_metrics?: Json
          prediction_confidence?: number | null
          prediction_type: string
          time_horizon: string
          updated_at?: string
        }
        Update: {
          accuracy_score?: number | null
          actual_results?: Json | null
          baseline_metrics?: Json
          client_id?: string
          created_at?: string
          id?: string
          predicted_metrics?: Json
          prediction_confidence?: number | null
          prediction_type?: string
          time_horizon?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roi_predictions_client_id_fkey"
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
      seo_analysis: {
        Row: {
          action_plan: Json | null
          analysis_date: string | null
          analysis_tool: string
          client_id: string
          competitor_analysis: Json | null
          content_gaps: number | null
          created_at: string | null
          domain_authority: number | null
          expected_improvements: Json | null
          google_my_business_status: string | null
          id: string
          immediate_actions: Json | null
          keyword_gaps: number | null
          keyword_opportunities: number | null
          keywords_top_10: number | null
          local_citations: number | null
          local_seo_score: number | null
          mobile_score: number | null
          overall_score: number | null
          page_speed_score: number | null
          referring_domains: number | null
          target_keywords: Json | null
          technical_issues: Json | null
          technical_score: number | null
          total_backlinks: number | null
          total_keywords: number | null
          trust_score: number | null
          updated_at: string | null
          website_url: string
        }
        Insert: {
          action_plan?: Json | null
          analysis_date?: string | null
          analysis_tool?: string
          client_id: string
          competitor_analysis?: Json | null
          content_gaps?: number | null
          created_at?: string | null
          domain_authority?: number | null
          expected_improvements?: Json | null
          google_my_business_status?: string | null
          id?: string
          immediate_actions?: Json | null
          keyword_gaps?: number | null
          keyword_opportunities?: number | null
          keywords_top_10?: number | null
          local_citations?: number | null
          local_seo_score?: number | null
          mobile_score?: number | null
          overall_score?: number | null
          page_speed_score?: number | null
          referring_domains?: number | null
          target_keywords?: Json | null
          technical_issues?: Json | null
          technical_score?: number | null
          total_backlinks?: number | null
          total_keywords?: number | null
          trust_score?: number | null
          updated_at?: string | null
          website_url: string
        }
        Update: {
          action_plan?: Json | null
          analysis_date?: string | null
          analysis_tool?: string
          client_id?: string
          competitor_analysis?: Json | null
          content_gaps?: number | null
          created_at?: string | null
          domain_authority?: number | null
          expected_improvements?: Json | null
          google_my_business_status?: string | null
          id?: string
          immediate_actions?: Json | null
          keyword_gaps?: number | null
          keyword_opportunities?: number | null
          keywords_top_10?: number | null
          local_citations?: number | null
          local_seo_score?: number | null
          mobile_score?: number | null
          overall_score?: number | null
          page_speed_score?: number | null
          referring_domains?: number | null
          target_keywords?: Json | null
          technical_issues?: Json | null
          technical_score?: number | null
          total_backlinks?: number | null
          total_keywords?: number | null
          trust_score?: number | null
          updated_at?: string | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_analysis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      seranking_usage: {
        Row: {
          api_key_hash: string
          client_id: string
          endpoint: string
          error_message: string | null
          id: string
          request_timestamp: string | null
          response_status: number | null
          units_consumed: number | null
        }
        Insert: {
          api_key_hash: string
          client_id: string
          endpoint: string
          error_message?: string | null
          id?: string
          request_timestamp?: string | null
          response_status?: number | null
          units_consumed?: number | null
        }
        Update: {
          api_key_hash?: string
          client_id?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          request_timestamp?: string | null
          response_status?: number | null
          units_consumed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_seranking_usage_client"
            columns: ["client_id"]
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
      subscription_plans: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          limits: Json | null
          plan_code: string
          plan_name: string
          popular: boolean | null
          price_monthly: number
          price_yearly: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          trial_days: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          plan_code: string
          plan_name: string
          popular?: boolean | null
          price_monthly: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          plan_code?: string
          plan_name?: string
          popular?: boolean | null
          price_monthly?: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
      token_packages: {
        Row: {
          bonus_tokens: number | null
          created_at: string
          id: string
          is_active: boolean | null
          package_name: string
          price_sar: number
          token_amount: number
        }
        Insert: {
          bonus_tokens?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          package_name: string
          price_sar: number
          token_amount: number
        }
        Update: {
          bonus_tokens?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          package_name?: string
          price_sar?: number
          token_amount?: number
        }
        Relationships: []
      }
      token_usage: {
        Row: {
          client_id: string
          cost_sar: number | null
          id: string
          operation_description: string | null
          operation_type: string
          timestamp: string
          tokens_remaining: number
          tokens_used: number
          value_delivered: string | null
        }
        Insert: {
          client_id: string
          cost_sar?: number | null
          id?: string
          operation_description?: string | null
          operation_type: string
          timestamp?: string
          tokens_remaining: number
          tokens_used: number
          value_delivered?: string | null
        }
        Update: {
          client_id?: string
          cost_sar?: number | null
          id?: string
          operation_description?: string | null
          operation_type?: string
          timestamp?: string
          tokens_remaining?: number
          tokens_used?: number
          value_delivered?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_client_id_fkey"
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
      user_engagement_metrics: {
        Row: {
          addiction_score: number | null
          client_id: string
          context_data: Json | null
          created_at: string
          engagement_duration: number | null
          engagement_type: string
          engagement_value: number | null
          id: string
          session_id: string | null
          timestamp: string
        }
        Insert: {
          addiction_score?: number | null
          client_id: string
          context_data?: Json | null
          created_at?: string
          engagement_duration?: number | null
          engagement_type: string
          engagement_value?: number | null
          id?: string
          session_id?: string | null
          timestamp?: string
        }
        Update: {
          addiction_score?: number | null
          client_id?: string
          context_data?: Json | null
          created_at?: string
          engagement_duration?: number | null
          engagement_type?: string
          engagement_value?: number | null
          id?: string
          session_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_engagement_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          client_id: string
          id: string
          interaction_data: Json
          interaction_type: string
          page_url: string | null
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          client_id: string
          id?: string
          interaction_data?: Json
          interaction_type: string
          page_url?: string | null
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          client_id?: string
          id?: string
          interaction_data?: Json
          interaction_type?: string
          page_url?: string | null
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_journey_states: {
        Row: {
          client_id: string
          created_at: string
          current_state: string
          device_info: Json | null
          id: string
          journey_type: string
          last_interaction_at: string
          session_id: string | null
          state_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          current_state: string
          device_info?: Json | null
          id?: string
          journey_type?: string
          last_interaction_at?: string
          session_id?: string | null
          state_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          current_state?: string
          device_info?: Json | null
          id?: string
          journey_type?: string
          last_interaction_at?: string
          session_id?: string | null
          state_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_journey_states_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          billing_cycle: string | null
          client_id: string
          created_at: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          payment_method: Json | null
          plan_id: string
          start_date: string | null
          status: string | null
          trial_end_date: string | null
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          billing_cycle?: string | null
          client_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Json | null
          plan_id: string
          start_date?: string | null
          status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          billing_cycle?: string | null
          client_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Json | null
          plan_id?: string
          start_date?: string | null
          status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      web_intelligence: {
        Row: {
          client_id: string
          confidence_score: number | null
          created_at: string
          id: string
          intelligence_type: string
          last_updated: string
          processed_insights: Json | null
          query_used: string
          raw_data: Json
          website_url: string
        }
        Insert: {
          client_id: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          intelligence_type: string
          last_updated?: string
          processed_insights?: Json | null
          query_used: string
          raw_data: Json
          website_url: string
        }
        Update: {
          client_id?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          intelligence_type?: string
          last_updated?: string
          processed_insights?: Json | null
          query_used?: string
          raw_data?: Json
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "web_intelligence_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          moyasar_payment_id: string | null
          payload: Json
          processed: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          moyasar_payment_id?: string | null
          payload: Json
          processed?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          moyasar_payment_id?: string | null
          payload?: Json
          processed?: boolean | null
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
      check_feature_access: {
        Args: { p_client_id: string; p_feature_name: string }
        Returns: boolean
      }
      check_usage_limit: {
        Args:
          | {
              p_client_id: string
              p_feature_name: string
              p_increment?: number
            }
          | { p_client_id: string; p_feature_name: string; p_period?: string }
        Returns: Json
      }
      execute_sql: {
        Args: { sql_statement: string }
        Returns: undefined
      }
      handle_user_onboarding_update: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      initialize_conversation_system: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      link_clients_to_auth: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_seo_data_summary: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_owns_company: {
        Args:
          | { company_id: string }
          | { p_user_id: string; p_company_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
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
    Enums: {
      app_role: ["admin", "user", "moderator"],
    },
  },
} as const
