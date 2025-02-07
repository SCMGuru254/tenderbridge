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
      blog_posts: {
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
          id: string
          is_active: boolean | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
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
          id?: string
          is_active?: boolean | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
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
          id?: string
          is_active?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          position: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          position?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          position?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scraped_jobs: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          id: string
          job_type: string | null
          job_url: string | null
          location: string | null
          source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string | null
          job_url?: string | null
          location?: string | null
          source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string | null
          job_url?: string | null
          location?: string | null
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
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
