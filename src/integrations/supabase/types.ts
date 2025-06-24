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
          id: string
          message: string
          source_agent_id: string
          target_agent_id: string
          timestamp: string
        }
        Insert: {
          id?: string
          message: string
          source_agent_id: string
          target_agent_id: string
          timestamp?: string
        }
        Update: {
          id?: string
          message?: string
          source_agent_id?: string
          target_agent_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      agent_metrics: {
        Row: {
          agent_id: string
          id: string
          metric_name: string
          metric_value: number
          timestamp: string
        }
        Insert: {
          agent_id: string
          id?: string
          metric_name: string
          metric_value: number
          timestamp?: string
        }
        Update: {
          agent_id?: string
          id?: string
          metric_name?: string
          metric_value?: number
          timestamp?: string
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
      clients: {
        Row: {
          active: boolean | null
          api_key: string | null
          created_at: string | null
          email: string | null
          id: string
          metadata: Json | null
          name: string
          quota_limit: number | null
          quota_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          api_key?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name: string
          quota_limit?: number | null
          quota_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          api_key?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          quota_limit?: number | null
          quota_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          last_message_at: string | null
          metadata: Json | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
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
      messages: {
        Row: {
          client_id: string
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          client_id: string
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          client_id?: string
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
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
            foreignKeyName: "optimization_recommendations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      seo_data: {
        Row: {
          collected_at: string | null
          created_at: string | null
          data_snapshot: Json
          data_type: string | null
          id: string
          user_id: string
          website_url: string
        }
        Insert: {
          collected_at?: string | null
          created_at?: string | null
          data_snapshot: Json
          data_type?: string | null
          id?: string
          user_id: string
          website_url: string
        }
        Update: {
          collected_at?: string | null
          created_at?: string | null
          data_snapshot?: Json
          data_type?: string | null
          id?: string
          user_id?: string
          website_url?: string
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          limits: Json | null
          plan_code: string
          plan_name: string
          price_monthly: number | null
          price_yearly: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          plan_code: string
          plan_name: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          plan_code?: string
          plan_name?: string
          price_monthly?: number | null
          price_yearly?: number | null
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      user_profiles: {
        Row: {
          average_order_value: number | null
          biggest_marketing_challenge: string | null
          branch_locations: string[] | null
          business_model: string | null
          business_type: string | null
          case_studies: string[] | null
          company_name: string | null
          company_overview: string | null
          company_size: string | null
          contact_info: Json | null
          created_at: string | null
          current_monthly_revenue: string | null
          customer_acquisition_cost: number | null
          data_completeness_score: number | null
          expansion_plans: string[] | null
          first_time_setup_completed: boolean | null
          full_name: string | null
          greeting_preference: string | null
          id: string
          industry: string | null
          key_team_members: Json | null
          last_seo_update: string | null
          marketing_experience: string | null
          monthly_marketing_budget: string | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          preferred_language: string | null
          primary_marketing_goals: string[] | null
          products_services: Json | null
          profile_setup_completed: boolean | null
          profile_setup_completed_at: string | null
          recent_news: string[] | null
          revenue_target: string | null
          seasonal_peaks: string[] | null
          seo_analysis_completed_at: string | null
          seo_analysis_triggered: boolean | null
          seo_data: Json | null
          service_areas: string[] | null
          target_audience: Json | null
          target_market: string | null
          unique_selling_points: string[] | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          average_order_value?: number | null
          biggest_marketing_challenge?: string | null
          branch_locations?: string[] | null
          business_model?: string | null
          business_type?: string | null
          case_studies?: string[] | null
          company_name?: string | null
          company_overview?: string | null
          company_size?: string | null
          contact_info?: Json | null
          created_at?: string | null
          current_monthly_revenue?: string | null
          customer_acquisition_cost?: number | null
          data_completeness_score?: number | null
          expansion_plans?: string[] | null
          first_time_setup_completed?: boolean | null
          full_name?: string | null
          greeting_preference?: string | null
          id?: string
          industry?: string | null
          key_team_members?: Json | null
          last_seo_update?: string | null
          marketing_experience?: string | null
          monthly_marketing_budget?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          preferred_language?: string | null
          primary_marketing_goals?: string[] | null
          products_services?: Json | null
          profile_setup_completed?: boolean | null
          profile_setup_completed_at?: string | null
          recent_news?: string[] | null
          revenue_target?: string | null
          seasonal_peaks?: string[] | null
          seo_analysis_completed_at?: string | null
          seo_analysis_triggered?: boolean | null
          seo_data?: Json | null
          service_areas?: string[] | null
          target_audience?: Json | null
          target_market?: string | null
          unique_selling_points?: string[] | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          average_order_value?: number | null
          biggest_marketing_challenge?: string | null
          branch_locations?: string[] | null
          business_model?: string | null
          business_type?: string | null
          case_studies?: string[] | null
          company_name?: string | null
          company_overview?: string | null
          company_size?: string | null
          contact_info?: Json | null
          created_at?: string | null
          current_monthly_revenue?: string | null
          customer_acquisition_cost?: number | null
          data_completeness_score?: number | null
          expansion_plans?: string[] | null
          first_time_setup_completed?: boolean | null
          full_name?: string | null
          greeting_preference?: string | null
          id?: string
          industry?: string | null
          key_team_members?: Json | null
          last_seo_update?: string | null
          marketing_experience?: string | null
          monthly_marketing_budget?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          preferred_language?: string | null
          primary_marketing_goals?: string[] | null
          products_services?: Json | null
          profile_setup_completed?: boolean | null
          profile_setup_completed_at?: string | null
          recent_news?: string[] | null
          revenue_target?: string | null
          seasonal_peaks?: string[] | null
          seo_analysis_completed_at?: string | null
          seo_analysis_triggered?: boolean | null
          seo_data?: Json | null
          service_areas?: string[] | null
          target_audience?: Json | null
          target_market?: string | null
          unique_selling_points?: string[] | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          client_id: string
          created_at: string | null
          end_date: string | null
          id: string
          plan_id: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id?: string
          start_date?: string | null
          status?: string | null
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
        Relationships: []
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
          | Record<PropertyKey, never>
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
        Args:
          | { _user_id: string; _role: Database["public"]["Enums"]["app_role"] }
          | { user_id: string; required_role: string }
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
      app_role: "admin" | "user" | "premium"
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
      app_role: ["admin", "user", "premium"],
    },
  },
} as const
