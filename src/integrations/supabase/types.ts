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
      application_notifications: {
        Row: {
          applicant_id: string | null
          created_at: string
          id: string
          job_id: string | null
          message: string
          notification_type: string
          read: boolean
        }
        Insert: {
          applicant_id?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          message: string
          notification_type: string
          read?: boolean
        }
        Update: {
          applicant_id?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          message?: string
          notification_type?: string
          read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "application_notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          updated_at: string
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          updated_at?: string
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          updated_at?: string
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website?: string | null
        }
        Relationships: []
      }
      discussions: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hiring_decisions: {
        Row: {
          candidate_id: string
          created_at: string
          decision_date: string
          employer_id: string
          id: string
          notes: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string
          decision_date: string
          employer_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string
          decision_date?: string
          employer_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hiring_decisions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hiring_decisions_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_questions: {
        Row: {
          company_name: string
          created_at: string
          difficulty: string
          downvotes: number | null
          id: string
          is_anonymous: boolean | null
          position: string
          question: string
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          difficulty: string
          downvotes?: number | null
          id?: string
          is_anonymous?: boolean | null
          position: string
          question: string
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          difficulty?: string
          downvotes?: number | null
          id?: string
          is_anonymous?: boolean | null
          position?: string
          question?: string
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      interview_reviews: {
        Row: {
          company_culture: string[] | null
          company_name: string
          created_at: string
          difficulty: string
          id: string
          interview_date: string | null
          interview_process: string | null
          is_anonymous: boolean | null
          position: string
          rating: number | null
          review_text: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_culture?: string[] | null
          company_name: string
          created_at?: string
          difficulty: string
          id?: string
          interview_date?: string | null
          interview_process?: string | null
          is_anonymous?: boolean | null
          position: string
          rating?: number | null
          review_text: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_culture?: string[] | null
          company_name?: string
          created_at?: string
          difficulty?: string
          id?: string
          interview_date?: string | null
          interview_process?: string | null
          is_anonymous?: boolean | null
          position?: string
          rating?: number | null
          review_text?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string | null
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string | null
          resume_url: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          applicant_id?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          applicant_id?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_reports: {
        Row: {
          created_at: string
          id: string
          job_id: string
          reason: string
          reported_by: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          reason: string
          reported_by: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          reason?: string
          reported_by?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_reports_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          created_at: string
          id: string
          job_id: string | null
          skill: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id?: string | null
          skill: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string | null
          skill?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_id: string | null
          created_at: string
          description: string
          hiring_timeline: string | null
          id: string
          is_active: boolean | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          notify_applicants: boolean | null
          posted_by: string
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description: string
          hiring_timeline?: string | null
          id?: string
          is_active?: boolean | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          notify_applicants?: boolean | null
          posted_by: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string
          hiring_timeline?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string
          notify_applicants?: boolean | null
          posted_by?: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          active: boolean
          email: string
          id: string
          subscribed_at: string
        }
        Insert: {
          active?: boolean
          email: string
          id?: string
          subscribed_at?: string
        }
        Update: {
          active?: boolean
          email?: string
          id?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          id?: string
          profile_id: string
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          cv_filename: string | null
          cv_url: string | null
          email: string
          full_name: string | null
          id: string
          linkedin_url: string | null
          notify_on_view: boolean | null
          position: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          cv_filename?: string | null
          cv_url?: string | null
          email: string
          full_name?: string | null
          id: string
          linkedin_url?: string | null
          notify_on_view?: boolean | null
          position?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          cv_filename?: string | null
          cv_url?: string | null
          email?: string
          full_name?: string | null
          id?: string
          linkedin_url?: string | null
          notify_on_view?: boolean | null
          position?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      redemption_requests: {
        Row: {
          admin_notes: string | null
          catalog_item_id: string
          expires_at: string
          id: string
          points_spent: number
          processed_at: string | null
          request_data: Json
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          catalog_item_id: string
          expires_at?: string
          id?: string
          points_spent: number
          processed_at?: string | null
          request_data?: Json
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          catalog_item_id?: string
          expires_at?: string
          id?: string
          points_spent?: number
          processed_at?: string | null
          request_data?: Json
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemption_requests_catalog_item_id_fkey"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "rewards_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards_catalog: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          item_code: string
          max_redemptions_per_user: number | null
          name: string
          points_required: number
          stock_available: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          item_code: string
          max_redemptions_per_user?: number | null
          name: string
          points_required: number
          stock_available?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          item_code?: string
          max_redemptions_per_user?: number | null
          name?: string
          points_required?: number
          stock_available?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      rewards_points: {
        Row: {
          created_at: string
          current_balance: number
          id: string
          lifetime_earned: number
          lifetime_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_balance?: number
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_balance?: number
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rewards_transactions: {
        Row: {
          created_at: string
          description: string
          id: string
          points: number
          reference_id: string | null
          source: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points: number
          reference_id?: string | null
          source: string
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points?: number
          reference_id?: string | null
          source?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string
          id: string
          job_id: string | null
          notes: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_id?: string | null
          notes?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string | null
          notes?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scraped_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scraped_jobs: {
        Row: {
          application_deadline: string | null
          application_url: string | null
          category: string | null
          company: string | null
          created_at: string
          description: string | null
          employment_type: string | null
          experience_level: string | null
          id: string
          is_scam: boolean | null
          job_type: string | null
          job_url: string | null
          location: string | null
          salary_range: string | null
          scam_reports: number | null
          skills: string[] | null
          social_shares: Json | null
          source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          application_url?: string | null
          category?: string | null
          company?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          is_scam?: boolean | null
          job_type?: string | null
          job_url?: string | null
          location?: string | null
          salary_range?: string | null
          scam_reports?: number | null
          skills?: string[] | null
          social_shares?: Json | null
          source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          application_url?: string | null
          category?: string | null
          company?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          is_scam?: boolean | null
          job_type?: string | null
          job_url?: string | null
          location?: string | null
          salary_range?: string | null
          scam_reports?: number | null
          skills?: string[] | null
          social_shares?: Json | null
          source?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      supply_chain_news: {
        Row: {
          content: string
          created_at: string
          id: string
          published_date: string | null
          source_name: string | null
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          published_date?: string | null
          source_name?: string | null
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          published_date?: string | null
          source_name?: string | null
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string
          achievement_data: Json
          achievement_type: string
          id: string
          notified: boolean
          points_awarded: number
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_data?: Json
          achievement_type: string
          id?: string
          notified?: boolean
          points_awarded?: number
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_data?: Json
          achievement_type?: string
          id?: string
          notified?: boolean
          points_awarded?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          p_user_id: string
          p_points: number
          p_description: string
          p_source: string
          p_reference_id?: string
        }
        Returns: boolean
      }
      process_redemption: {
        Args: {
          p_user_id: string
          p_catalog_item_id: string
          p_request_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      job_type: "full_time" | "part_time" | "contract" | "internship"
      verification_status: "pending" | "verified" | "rejected"
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
      job_type: ["full_time", "part_time", "contract", "internship"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
