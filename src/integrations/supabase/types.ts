export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_id: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string
        }
        Relationships: []
      }
      admin_videos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      ads: {
        Row: {
          clicks_count: number | null
          created_at: string
          ends_at: string | null
          id: string
          image_url: string
          position: string
          starts_at: string | null
          status: string | null
          target_url: string
          title: string
          views_count: number | null
        }
        Insert: {
          clicks_count?: number | null
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url: string
          position: string
          starts_at?: string | null
          status?: string | null
          target_url: string
          title: string
          views_count?: number | null
        }
        Update: {
          clicks_count?: number | null
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string
          position?: string
          starts_at?: string | null
          status?: string | null
          target_url?: string
          title?: string
          views_count?: number | null
        }
        Relationships: []
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          id: string
          notes: string | null
          payout_details: Json | null
          payout_method: string
          processed_at: string | null
          requested_at: string
          status: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          id?: string
          notes?: string | null
          payout_details?: Json | null
          payout_method?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          id?: string
          notes?: string | null
          payout_details?: Json | null
          payout_method?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_programs: {
        Row: {
          affiliate_code: string
          commission_rate: number
          created_at: string
          id: string
          pending_payouts: number
          referral_link: string
          status: string
          tier: string | null
          total_earnings: number
          total_paid_out: number
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          commission_rate?: number
          created_at?: string
          id?: string
          pending_payouts?: number
          referral_link: string
          status?: string
          tier?: string | null
          total_earnings?: number
          total_paid_out?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          commission_rate?: number
          created_at?: string
          id?: string
          pending_payouts?: number
          referral_link?: string
          status?: string
          tier?: string | null
          total_earnings?: number
          total_paid_out?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_earned: number | null
          conversion_amount: number | null
          converted_at: string | null
          created_at: string
          id: string
          paid_at: string | null
          referral_status: string | null
          referral_type: string
          referred_user_id: string | null
          status: string
          transaction_reference: string | null
        }
        Insert: {
          affiliate_id: string
          commission_earned?: number | null
          conversion_amount?: number | null
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referral_status?: string | null
          referral_type: string
          referred_user_id?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Update: {
          affiliate_id?: string
          commission_earned?: number | null
          conversion_amount?: number | null
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referral_status?: string | null
          referral_type?: string
          referred_user_id?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_settings: {
        Row: {
          created_at: string | null
          default_anonymous: boolean | null
          id: string
          preferred_anonymous_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          default_anonymous?: boolean | null
          id?: string
          preferred_anonymous_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          default_anonymous?: boolean | null
          id?: string
          preferred_anonymous_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
            referencedRelation: "early_access_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "premium_jobs_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      ats_analyses: {
        Row: {
          analysis_result: Json
          analyzed_at: string
          created_at: string
          file_path: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_result: Json
          analyzed_at?: string
          created_at?: string
          file_path: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_result?: Json
          analyzed_at?: string
          created_at?: string
          file_path?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      career_application_votes: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          voter_id: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          voter_id?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_application_votes_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "career_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      career_applications: {
        Row: {
          applicant_email: string | null
          applicant_name: string | null
          created_at: string | null
          id: string
          proposal_text: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
          votes_count: number | null
        }
        Insert: {
          applicant_email?: string | null
          applicant_name?: string | null
          created_at?: string | null
          id?: string
          proposal_text?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          votes_count?: number | null
        }
        Update: {
          applicant_email?: string | null
          applicant_name?: string | null
          created_at?: string | null
          id?: string
          proposal_text?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          votes_count?: number | null
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
      company_claims: {
        Row: {
          company_id: string
          created_at: string
          id: string
          proof_document: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          proof_document?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          proof_document?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_claims_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_review_replies: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          id: string
          reply_text: string
          review_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          id?: string
          reply_text: string
          review_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          reply_text?: string
          review_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_review_replies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "company_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      company_reviews: {
        Row: {
          anonymous_display_name: string | null
          anonymous_identifier: string | null
          career_growth_rating: number | null
          company_id: string
          compensation_rating: number | null
          cons: string | null
          created_at: string
          culture_rating: number | null
          employment_duration: string | null
          helpful_votes: number | null
          id: string
          is_active: boolean | null
          is_anonymous: boolean
          is_current_employee: boolean
          job_position: string | null
          management_rating: number | null
          pros: string | null
          rating: number
          reported_count: number | null
          review_text: string
          reviewer_id: string | null
          status: string | null
          updated_at: string
          user_id: string
          work_life_balance_rating: number | null
        }
        Insert: {
          anonymous_display_name?: string | null
          anonymous_identifier?: string | null
          career_growth_rating?: number | null
          company_id: string
          compensation_rating?: number | null
          cons?: string | null
          created_at?: string
          culture_rating?: number | null
          employment_duration?: string | null
          helpful_votes?: number | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean
          is_current_employee?: boolean
          job_position?: string | null
          management_rating?: number | null
          pros?: string | null
          rating: number
          reported_count?: number | null
          review_text: string
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          work_life_balance_rating?: number | null
        }
        Update: {
          anonymous_display_name?: string | null
          anonymous_identifier?: string | null
          career_growth_rating?: number | null
          company_id?: string
          compensation_rating?: number | null
          cons?: string | null
          created_at?: string
          culture_rating?: number | null
          employment_duration?: string | null
          helpful_votes?: number | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean
          is_current_employee?: boolean
          job_position?: string | null
          management_rating?: number | null
          pros?: string | null
          rating?: number
          reported_count?: number | null
          review_text?: string
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          work_life_balance_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user_id1: string | null
          user_id2: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id1?: string | null
          user_id2?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id1?: string | null
          user_id2?: string | null
        }
        Relationships: []
      }
      course_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          completion_date: string | null
          course_id: string
          created_at: string | null
          enrollment_date: string | null
          id: string
          payment_status: string | null
          rating: number | null
          review: string | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          completion_date?: string | null
          course_id: string
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          payment_status?: string | null
          rating?: number | null
          review?: string | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          completion_date?: string | null
          course_id?: string
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          payment_status?: string | null
          rating?: number | null
          review?: string | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string | null
          certificate_provided: boolean | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          current_students: number | null
          description: string
          duration_hours: number | null
          end_date: string | null
          format: string | null
          id: string
          image_url: string | null
          instructor_id: string
          level: string | null
          location: string | null
          materials_included: string[] | null
          max_students: number | null
          objectives: string[] | null
          price: number | null
          registration_deadline: string | null
          requirements: string[] | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          certificate_provided?: boolean | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          current_students?: number | null
          description: string
          duration_hours?: number | null
          end_date?: string | null
          format?: string | null
          id?: string
          image_url?: string | null
          instructor_id: string
          level?: string | null
          location?: string | null
          materials_included?: string[] | null
          max_students?: number | null
          objectives?: string[] | null
          price?: number | null
          registration_deadline?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          certificate_provided?: boolean | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          current_students?: number | null
          description?: string
          duration_hours?: number | null
          end_date?: string | null
          format?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string
          level?: string | null
          location?: string | null
          materials_included?: string[] | null
          max_students?: number | null
          objectives?: string[] | null
          price?: number | null
          registration_deadline?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_bookmarks: {
        Row: {
          created_at: string
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_bookmarks_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_comments: {
        Row: {
          anonymous_display_name: string | null
          anonymous_identifier: string | null
          content: string
          created_at: string
          discussion_id: string
          id: string
          is_active: boolean | null
          is_anonymous: boolean | null
          parent_comment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anonymous_display_name?: string | null
          anonymous_identifier?: string | null
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anonymous_display_name?: string | null
          anonymous_identifier?: string | null
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_comments_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "discussion_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_likes: {
        Row: {
          created_at: string
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_shares: {
        Row: {
          created_at: string
          discussion_id: string
          id: string
          platform: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          id?: string
          platform: string
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          id?: string
          platform?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_shares_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          anonymous_display_name: string | null
          anonymous_identifier: string | null
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          is_anonymous: boolean | null
          is_locked: boolean | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          anonymous_display_name?: string | null
          anonymous_identifier?: string | null
          author_id: string
          category?: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          is_locked?: boolean | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          anonymous_display_name?: string | null
          anonymous_identifier?: string | null
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          is_locked?: boolean | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_uploads: {
        Row: {
          created_at: string
          document_type: string
          extracted_text: string | null
          file_path: string
          file_size: number
          filename: string
          id: string
          is_active: boolean
          mime_type: string
          original_name: string
          updated_at: string
          upload_source: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          extracted_text?: string | null
          file_path: string
          file_size: number
          filename: string
          id?: string
          is_active?: boolean
          mime_type: string
          original_name: string
          updated_at?: string
          upload_source?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          extracted_text?: string | null
          file_path?: string
          file_size?: number
          filename?: string
          id?: string
          is_active?: boolean
          mime_type?: string
          original_name?: string
          updated_at?: string
          upload_source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attendance_status: string | null
          event_id: string
          id: string
          payment_status: string | null
          registration_date: string | null
          user_id: string
        }
        Insert: {
          attendance_status?: string | null
          event_id: string
          id?: string
          payment_status?: string | null
          registration_date?: string | null
          user_id: string
        }
        Update: {
          attendance_status?: string | null
          event_id?: string
          id?: string
          payment_status?: string | null
          registration_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "training_events"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_clients: {
        Row: {
          ad_views_purchased: number | null
          ad_views_used: number | null
          budget_range: string
          company_email: string
          company_name: string
          company_website: string | null
          contact_person: string
          created_at: string
          end_date: string | null
          id: string
          intent_type: string
          monthly_fee: number | null
          notes: string | null
          phone_number: string | null
          start_date: string | null
          status: string
          subscription_type: string | null
          updated_at: string
          user_id: string
          yearly_fee: number | null
        }
        Insert: {
          ad_views_purchased?: number | null
          ad_views_used?: number | null
          budget_range: string
          company_email: string
          company_name: string
          company_website?: string | null
          contact_person: string
          created_at?: string
          end_date?: string | null
          id?: string
          intent_type: string
          monthly_fee?: number | null
          notes?: string | null
          phone_number?: string | null
          start_date?: string | null
          status?: string
          subscription_type?: string | null
          updated_at?: string
          user_id: string
          yearly_fee?: number | null
        }
        Update: {
          ad_views_purchased?: number | null
          ad_views_used?: number | null
          budget_range?: string
          company_email?: string
          company_name?: string
          company_website?: string | null
          contact_person?: string
          created_at?: string
          end_date?: string | null
          id?: string
          intent_type?: string
          monthly_fee?: number | null
          notes?: string | null
          phone_number?: string | null
          start_date?: string | null
          status?: string
          subscription_type?: string | null
          updated_at?: string
          user_id?: string
          yearly_fee?: number | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_documents: {
        Row: {
          content: Json | null
          created_at: string
          document_type: string
          expiration_date: string | null
          id: string
          language: string
          status: string | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          document_type: string
          expiration_date?: string | null
          id?: string
          language?: string
          status?: string | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          document_type?: string
          expiration_date?: string | null
          id?: string
          language?: string
          status?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
            foreignKeyName: "hiring_decisions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hiring_decisions_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hiring_decisions_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_profiles: {
        Row: {
          availability_status: string
          bio: string | null
          booking_calendly_url: string | null
          booking_google_url: string | null
          certifications: string[] | null
          company_id: string | null
          created_at: string
          hourly_rate: number | null
          id: string
          is_verified: boolean
          languages_spoken: string[] | null
          preferred_contact_method: string | null
          rating: number | null
          services_offered: string[]
          specializations: string[]
          timezone: string | null
          total_clients: number | null
          updated_at: string
          user_id: string
          years_experience: number
        }
        Insert: {
          availability_status?: string
          bio?: string | null
          booking_calendly_url?: string | null
          booking_google_url?: string | null
          certifications?: string[] | null
          company_id?: string | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean
          languages_spoken?: string[] | null
          preferred_contact_method?: string | null
          rating?: number | null
          services_offered?: string[]
          specializations?: string[]
          timezone?: string | null
          total_clients?: number | null
          updated_at?: string
          user_id: string
          years_experience?: number
        }
        Update: {
          availability_status?: string
          bio?: string | null
          booking_calendly_url?: string | null
          booking_google_url?: string | null
          certifications?: string[] | null
          company_id?: string | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean
          languages_spoken?: string[] | null
          preferred_contact_method?: string | null
          rating?: number | null
          services_offered?: string[]
          specializations?: string[]
          timezone?: string | null
          total_clients?: number | null
          updated_at?: string
          user_id?: string
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "hr_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
      interview_responses: {
        Row: {
          ai_feedback: string | null
          created_at: string | null
          id: string
          question: string
          score: number | null
          session_id: string
          user_answer: string
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string | null
          id?: string
          question: string
          score?: number | null
          session_id: string
          user_answer: string
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string | null
          id?: string
          question?: string
          score?: number | null
          session_id?: string
          user_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
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
      interview_sessions: {
        Row: {
          company: string
          created_at: string | null
          difficulty: string
          id: string
          position: string
          score: number | null
          session_name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string | null
          difficulty: string
          id?: string
          position: string
          score?: number | null
          session_name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string | null
          difficulty?: string
          id?: string
          position?: string
          score?: number | null
          session_name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_application_tracker: {
        Row: {
          applied_at: string | null
          id: string
          job_id: string | null
          notes: string | null
          scraped_job_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          scraped_job_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          scraped_job_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_application_tracker_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "early_access_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_application_tracker_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_application_tracker_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "premium_jobs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_application_tracker_scraped_job_id_fkey"
            columns: ["scraped_job_id"]
            isOneToOne: false
            referencedRelation: "scraped_jobs"
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
            referencedRelation: "early_access_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "premium_jobs_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      job_bookmarks: {
        Row: {
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: []
      }
      job_boost_packages: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price_kes: number
          price_usd: number
          priority_score: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price_kes: number
          price_usd: number
          priority_score: number
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price_kes?: number
          price_usd?: number
          priority_score?: number
        }
        Relationships: []
      }
      job_boost_purchases: {
        Row: {
          amount_paid: number
          boost_end_date: string
          boost_start_date: string
          created_at: string
          currency: string
          id: string
          job_id: string
          package_id: string
          status: string | null
          transaction_reference: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          boost_end_date: string
          boost_start_date?: string
          created_at?: string
          currency: string
          id?: string
          job_id: string
          package_id: string
          status?: string | null
          transaction_reference?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          boost_end_date?: string
          boost_start_date?: string
          created_at?: string
          currency?: string
          id?: string
          job_id?: string
          package_id?: string
          status?: string | null
          transaction_reference?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_boost_purchases_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "early_access_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_boost_purchases_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_boost_purchases_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "premium_jobs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_boost_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "job_boost_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      job_early_access_purchases: {
        Row: {
          access_expires_at: string
          access_granted_at: string
          id: string
          job_id: string
          points_spent: number
          user_id: string
        }
        Insert: {
          access_expires_at: string
          access_granted_at?: string
          id?: string
          job_id: string
          points_spent: number
          user_id: string
        }
        Update: {
          access_expires_at?: string
          access_granted_at?: string
          id?: string
          job_id?: string
          points_spent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_early_access_purchases_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "early_access_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_early_access_purchases_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_early_access_purchases_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "premium_jobs_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      job_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          job_id: string
          reason: string
          report_reason: string | null
          reported_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          job_id: string
          reason: string
          report_reason?: string | null
          reported_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          job_id?: string
          reason?: string
          report_reason?: string | null
          reported_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_reports_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "early_access_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_reports_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_reports_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "premium_jobs_summary"
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
            referencedRelation: "early_access_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "premium_jobs_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          boost_expires_at: string | null
          boost_package_id: string | null
          boosted_until: string | null
          company_id: string | null
          created_at: string
          description: string
          document_url: string | null
          early_access_points_required: number | null
          early_access_until: string | null
          hiring_timeline: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_premium: boolean | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          notify_applicants: boolean | null
          posted_by: string
          priority_score: number | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          boost_expires_at?: string | null
          boost_package_id?: string | null
          boosted_until?: string | null
          company_id?: string | null
          created_at?: string
          description: string
          document_url?: string | null
          early_access_points_required?: number | null
          early_access_until?: string | null
          hiring_timeline?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          notify_applicants?: boolean | null
          posted_by: string
          priority_score?: number | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          boost_expires_at?: string | null
          boost_package_id?: string | null
          boosted_until?: string | null
          company_id?: string | null
          created_at?: string
          description?: string
          document_url?: string | null
          early_access_points_required?: number | null
          early_access_until?: string | null
          hiring_timeline?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string
          notify_applicants?: boolean | null
          posted_by?: string
          priority_score?: number | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_boost_package_id_fkey"
            columns: ["boost_package_id"]
            isOneToOne: false
            referencedRelation: "job_boost_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_payment_claims: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          mpesa_code: string
          payment_purpose: string
          sender_name: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          mpesa_code: string
          payment_purpose: string
          sender_name?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          mpesa_code?: string
          payment_purpose?: string
          sender_name?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      manual_payment_methods: {
        Row: {
          account_name: string | null
          account_number: string
          created_at: string
          id: string
          instructions: string | null
          is_active: boolean | null
          name: string
          type: string
        }
        Insert: {
          account_name?: string | null
          account_number: string
          created_at?: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          name: string
          type: string
        }
        Update: {
          account_name?: string | null
          account_number?: string
          created_at?: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      mentees: {
        Row: {
          areas_of_interest: string[] | null
          career_goals: string | null
          created_at: string | null
          current_level: string
          id: string
          preferred_session_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          areas_of_interest?: string[] | null
          career_goals?: string | null
          created_at?: string | null
          current_level: string
          id?: string
          preferred_session_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          areas_of_interest?: string[] | null
          career_goals?: string | null
          created_at?: string | null
          current_level?: string
          id?: string
          preferred_session_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          availability_hours: number | null
          bio: string | null
          created_at: string | null
          experience_years: number
          expertise_areas: string[]
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          rating: number | null
          total_sessions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability_hours?: number | null
          bio?: string | null
          created_at?: string | null
          experience_years?: number
          expertise_areas?: string[]
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability_hours?: number | null
          bio?: string | null
          created_at?: string | null
          experience_years?: number
          expertise_areas?: string[]
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          mentee_id: string
          mentor_id: string
          notes: string | null
          rating: number | null
          session_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          mentee_id: string
          mentor_id: string
          notes?: string | null
          rating?: number | null
          session_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          notes?: string | null
          rating?: number | null
          session_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "mentees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
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
      news_items: {
        Row: {
          content: string
          created_at: string | null
          guid: string | null
          id: string
          image_url: string | null
          published_at: string | null
          rss_feed_id: string | null
          source: string | null
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          guid?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          rss_feed_id?: string | null
          source?: string | null
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          guid?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          rss_feed_id?: string | null
          source?: string | null
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_items_rss_feed_id_fkey"
            columns: ["rss_feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
        ]
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
      notifications: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          read: boolean
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json
          id?: string
          read?: boolean
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          read?: boolean
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      paypal_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_data: Json | null
          payment_id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_data?: Json | null
          payment_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_data?: Json | null
          payment_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      paypal_payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payout_batch_id: string
          payout_data: Json | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payout_batch_id: string
          payout_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payout_batch_id?: string
          payout_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      paypal_plans: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          plan_data: Json | null
          plan_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          plan_data?: Json | null
          plan_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          plan_data?: Json | null
          plan_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      paypal_subscriptions: {
        Row: {
          created_at: string
          id: string
          plan_id: string
          status: string
          subscription_data: Json | null
          subscription_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id: string
          status?: string
          subscription_data?: Json | null
          subscription_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string
          status?: string
          subscription_data?: Json | null
          subscription_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      paypal_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          metadata: Json | null
          order_id: string
          payer_email: string | null
          payment_purpose: string
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          payer_email?: string | null
          payment_purpose: string
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          payer_email?: string | null
          payment_purpose?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      paystack_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          email: string
          id: string
          last_verified_at: string | null
          metadata: Json | null
          payment_purpose: string
          paystack_response: Json | null
          reference: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          email: string
          id?: string
          last_verified_at?: string | null
          metadata?: Json | null
          payment_purpose: string
          paystack_response?: Json | null
          reference: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          email?: string
          id?: string
          last_verified_at?: string | null
          metadata?: Json | null
          payment_purpose?: string
          paystack_response?: Json | null
          reference?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          created_at: string | null
          id: string
          option_text: string
          poll_id: string
          votes_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_text: string
          poll_id: string
          votes_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          option_text?: string
          poll_id?: string
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          id: string
          option_id: string
          poll_id: string
          user_id: string
          voted_at: string | null
        }
        Insert: {
          id?: string
          option_id: string
          poll_id: string
          user_id: string
          voted_at?: string | null
        }
        Update: {
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string
          voted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string | null
          created_by: string
          discussion_id: string
          expires_at: string | null
          id: string
          question: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          discussion_id: string
          expires_at?: string | null
          id?: string
          question: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          discussion_id?: string
          expires_at?: string | null
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          billing_cycle: string | null
          created_at: string
          features: Json
          id: string
          is_active: boolean
          plan_name: string
          plan_type: string
          price_amount: number
          updated_at: string
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          plan_name: string
          plan_type: string
          price_amount: number
          updated_at?: string
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          plan_name?: string
          plan_type?: string
          price_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      professional_profiles: {
        Row: {
          availability: string | null
          certifications: string[] | null
          created_at: string | null
          education: string | null
          experience_years: number | null
          github_url: string | null
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          linkedin_url: string | null
          portfolio_url: string | null
          summary: string | null
          title: string
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          availability?: string | null
          certifications?: string[] | null
          created_at?: string | null
          education?: string | null
          experience_years?: number | null
          github_url?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          availability?: string | null
          certifications?: string[] | null
          created_at?: string | null
          education?: string | null
          experience_years?: number | null
          github_url?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      professional_skills: {
        Row: {
          created_at: string | null
          id: string
          proficiency_level: string
          profile_id: string
          skill_id: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          proficiency_level: string
          profile_id: string
          skill_id: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          proficiency_level?: string
          profile_id?: string
          skill_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allowed_roles: string[]
          anonymous_display_name: string | null
          anonymous_identifier: string | null
          avatar_url: string | null
          bio: string | null
          career_goals: string | null
          company: string | null
          created_at: string
          cv_filename: string | null
          cv_url: string | null
          email: string
          experience_level: string | null
          full_name: string | null
          id: string
          is_anonymous_allowed: boolean | null
          linkedin_url: string | null
          location: string | null
          notify_on_view: boolean | null
          position: string | null
          previous_job: string | null
          role: string | null
          skills: string | null
          tagline: string | null
          updated_at: string
          visibility: string
          visible_fields: Json
        }
        Insert: {
          allowed_roles?: string[]
          anonymous_display_name?: string | null
          anonymous_identifier?: string | null
          avatar_url?: string | null
          bio?: string | null
          career_goals?: string | null
          company?: string | null
          created_at?: string
          cv_filename?: string | null
          cv_url?: string | null
          email: string
          experience_level?: string | null
          full_name?: string | null
          id: string
          is_anonymous_allowed?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          notify_on_view?: boolean | null
          position?: string | null
          previous_job?: string | null
          role?: string | null
          skills?: string | null
          tagline?: string | null
          updated_at?: string
          visibility?: string
          visible_fields?: Json
        }
        Update: {
          allowed_roles?: string[]
          anonymous_display_name?: string | null
          anonymous_identifier?: string | null
          avatar_url?: string | null
          bio?: string | null
          career_goals?: string | null
          company?: string | null
          created_at?: string
          cv_filename?: string | null
          cv_url?: string | null
          email?: string
          experience_level?: string | null
          full_name?: string | null
          id?: string
          is_anonymous_allowed?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          notify_on_view?: boolean | null
          position?: string | null
          previous_job?: string | null
          role?: string | null
          skills?: string | null
          tagline?: string | null
          updated_at?: string
          visibility?: string
          visible_fields?: Json
        }
        Relationships: []
      }
      project_contracts: {
        Row: {
          agreed_rate: number
          client_id: string
          created_at: string | null
          end_date: string | null
          id: string
          payment_terms: string | null
          professional_id: string
          project_id: string
          proposal_id: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          agreed_rate: number
          client_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_terms?: string | null
          professional_id: string
          project_id: string
          proposal_id: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          agreed_rate?: number
          client_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_terms?: string | null
          professional_id?: string
          project_id?: string
          proposal_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_contracts_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_contracts_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "project_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      project_proposals: {
        Row: {
          availability_start: string | null
          cover_letter: string
          created_at: string | null
          estimated_hours: number | null
          id: string
          professional_id: string
          project_id: string
          proposed_rate: number
          status: string
          updated_at: string | null
        }
        Insert: {
          availability_start?: string | null
          cover_letter: string
          created_at?: string | null
          estimated_hours?: number | null
          id?: string
          professional_id: string
          project_id: string
          proposed_rate: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          availability_start?: string | null
          cover_letter?: string
          created_at?: string | null
          estimated_hours?: number | null
          id?: string
          professional_id?: string
          project_id?: string
          proposed_rate?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_proposals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reviews: {
        Row: {
          communication_rating: number | null
          contract_id: string
          created_at: string | null
          id: string
          quality_rating: number | null
          rating: number
          review_text: string | null
          reviewee_id: string
          reviewer_id: string
          timeliness_rating: number | null
        }
        Insert: {
          communication_rating?: number | null
          contract_id: string
          created_at?: string | null
          id?: string
          quality_rating?: number | null
          rating: number
          review_text?: string | null
          reviewee_id: string
          reviewer_id: string
          timeliness_rating?: number | null
        }
        Update: {
          communication_rating?: number | null
          contract_id?: string
          created_at?: string | null
          id?: string
          quality_rating?: number | null
          rating?: number
          review_text?: string | null
          reviewee_id?: string
          reviewer_id?: string
          timeliness_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_reviews_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "project_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      project_skills: {
        Row: {
          created_at: string | null
          id: string
          minimum_proficiency: string
          project_id: string
          skill_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          minimum_proficiency: string
          project_id: string
          skill_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          minimum_proficiency?: string
          project_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          client_id: string
          created_at: string | null
          description: string
          duration_estimate: string | null
          id: string
          requirements: string[] | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          client_id: string
          created_at?: string | null
          description: string
          duration_estimate?: string | null
          id?: string
          requirements?: string[] | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          client_id?: string
          created_at?: string | null
          description?: string
          duration_estimate?: string | null
          id?: string
          requirements?: string[] | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      redemption_requests: {
        Row: {
          admin_notes: string | null
          catalog_item_id: string
          created_at: string
          expires_at: string
          id: string
          points_spent: number
          processed_at: string | null
          request_data: Json
          requested_at: string
          reward_type: string
          status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          catalog_item_id: string
          created_at?: string
          expires_at?: string
          id?: string
          points_spent: number
          processed_at?: string | null
          request_data?: Json
          requested_at?: string
          reward_type: string
          status?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          catalog_item_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          points_spent?: number
          processed_at?: string | null
          request_data?: Json
          requested_at?: string
          reward_type?: string
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
      review_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          parent_comment_id: string | null
          review_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          review_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          parent_comment_id?: string | null
          review_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "review_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_comments_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "company_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_helpful_votes: {
        Row: {
          created_at: string | null
          helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "company_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_likes: {
        Row: {
          created_at: string | null
          id: string
          liked: boolean | null
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          liked?: boolean | null
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          liked?: boolean | null
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "company_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_reports: {
        Row: {
          created_at: string | null
          details: string | null
          id: string
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          review_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          review_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          review_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_reports_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "company_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_responses: {
        Row: {
          amount_paid: number
          created_at: string
          id: string
          payment_date: string | null
          payment_status: string
          payment_type: string
          provider_id: string
          response_text: string
          review_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_status?: string
          payment_type: string
          provider_id: string
          response_text: string
          review_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_status?: string
          payment_type?: string
          provider_id?: string
          response_text?: string
          review_id?: string
        }
        Relationships: []
      }
      reward_admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          notes: string | null
          redemption_id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          notes?: string | null
          redemption_id: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          redemption_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_admin_logs_redemption_id_fkey"
            columns: ["redemption_id"]
            isOneToOne: false
            referencedRelation: "redemption_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
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
      rss_feeds: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          fetch_error: string | null
          id: string
          last_fetched_at: string | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          fetch_error?: string | null
          id?: string
          last_fetched_at?: string | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          fetch_error?: string | null
          id?: string
          last_fetched_at?: string | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      salary_submissions: {
        Row: {
          benefits: string[] | null
          bonus_amount: number | null
          company_name: string | null
          created_at: string | null
          department: string | null
          employment_type: string | null
          experience_level: string | null
          id: string
          industry: string | null
          is_anonymous: boolean | null
          job_title: string
          location: string | null
          salary_amount: number
          salary_currency: string | null
          salary_period: string | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          benefits?: string[] | null
          bonus_amount?: number | null
          company_name?: string | null
          created_at?: string | null
          department?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          industry?: string | null
          is_anonymous?: boolean | null
          job_title: string
          location?: string | null
          salary_amount: number
          salary_currency?: string | null
          salary_period?: string | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          benefits?: string[] | null
          bonus_amount?: number | null
          company_name?: string | null
          created_at?: string | null
          department?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          industry?: string | null
          is_anonymous?: boolean | null
          job_title?: string
          location?: string | null
          salary_amount?: number
          salary_currency?: string | null
          salary_period?: string | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
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
          {
            foreignKeyName: "saved_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "visible_profiles"
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
          source_posted_at: string | null
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
          source_posted_at?: string | null
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
          source_posted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_poll_votes: {
        Row: {
          created_at: string | null
          id: string
          poll_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          poll_id: string
          user_id: string
          vote_type?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          poll_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "skill_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_polls: {
        Row: {
          budget_range: string | null
          created_at: string | null
          demand_level: string
          description: string | null
          employer_id: string
          expires_at: string | null
          id: string
          poll_type: string
          skill_name: string
          updated_at: string | null
          urgency_days: number | null
          votes_count: number | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string | null
          demand_level?: string
          description?: string | null
          employer_id: string
          expires_at?: string | null
          id?: string
          poll_type?: string
          skill_name: string
          updated_at?: string | null
          urgency_days?: number | null
          votes_count?: number | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string | null
          demand_level?: string
          description?: string | null
          employer_id?: string
          expires_at?: string | null
          id?: string
          poll_type?: string
          skill_name?: string
          updated_at?: string | null
          urgency_days?: number | null
          votes_count?: number | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
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
      team_applications: {
        Row: {
          availability: string | null
          cover_letter: string | null
          created_at: string | null
          email: string
          experience_years: number | null
          full_name: string
          id: string
          phone: string | null
          portfolio_url: string | null
          position_applied: string
          resume_url: string | null
          salary_expectation: string | null
          skills: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          availability?: string | null
          cover_letter?: string | null
          created_at?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          phone?: string | null
          portfolio_url?: string | null
          position_applied: string
          resume_url?: string | null
          salary_expectation?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          availability?: string | null
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          phone?: string | null
          portfolio_url?: string | null
          position_applied?: string
          resume_url?: string | null
          salary_expectation?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      training_events: {
        Row: {
          category_id: string | null
          created_at: string | null
          current_attendees: number | null
          description: string
          end_date: string
          event_type: string
          id: string
          image_url: string | null
          is_online: boolean | null
          location: string | null
          max_attendees: number | null
          meeting_url: string | null
          organizer_id: string | null
          price: number | null
          registration_deadline: string | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          current_attendees?: number | null
          description: string
          end_date: string
          event_type: string
          id?: string
          image_url?: string | null
          is_online?: boolean | null
          location?: string | null
          max_attendees?: number | null
          meeting_url?: string | null
          organizer_id?: string | null
          price?: number | null
          registration_deadline?: string | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string
          end_date?: string
          event_type?: string
          id?: string
          image_url?: string | null
          is_online?: boolean | null
          location?: string | null
          max_attendees?: number | null
          meeting_url?: string | null
          organizer_id?: string | null
          price?: number | null
          registration_deadline?: string | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
        ]
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
      user_rewards: {
        Row: {
          current_points: number | null
          lifetime_earned: number | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          current_points?: number | null
          lifetime_earned?: number | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          current_points?: number | null
          lifetime_earned?: number | null
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_affiliate_stats: {
        Row: {
          affiliate_code: string | null
          tier: string | null
          total_commission_owed: number | null
          total_sales: number | null
          total_signups: number | null
          user_id: string | null
        }
        Relationships: []
      }
      admin_pending_tasks: {
        Row: {
          description: string | null
          priority: string | null
          reference_id: string | null
          task_type: string | null
          urgency_timestamp: string | null
        }
        Relationships: []
      }
      early_access_jobs: {
        Row: {
          company_id: string | null
          company_name: string | null
          early_access_points_required: number | null
          early_access_status: string | null
          early_access_until: string | null
          id: string | null
          title: string | null
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
      premium_jobs_summary: {
        Row: {
          boost_expires_at: string | null
          boost_status: string | null
          company_id: string | null
          company_name: string | null
          id: string | null
          is_featured: boolean | null
          is_premium: boolean | null
          priority_score: number | null
          title: string | null
          views_count: number | null
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
      visible_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          career_goals: string | null
          company: string | null
          created_at: string | null
          email: string | null
          experience_level: string | null
          full_name: string | null
          id: string | null
          linkedin_url: string | null
          location: string | null
          position: string | null
          role: string | null
          skills: string | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          career_goals?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string | null
          linkedin_url?: string | null
          location?: string | null
          position?: string | null
          role?: string | null
          skills?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          career_goals?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string | null
          linkedin_url?: string | null
          location?: string | null
          position?: string | null
          role?: string | null
          skills?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_job_boost:
        | { Args: { p_job_id: string; p_package_id: string }; Returns: Json }
        | {
            Args: {
              p_job_id: string
              p_package_id: string
              p_transaction_ref?: string
            }
            Returns: Json
          }
      approve_company_claim: {
        Args: { p_claim_id: string }
        Returns: undefined
      }
      award_daily_login: { Args: never; Returns: Json }
      award_points: {
        Args: {
          p_description: string
          p_points: number
          p_reference_id?: string
          p_source: string
          p_user_id: string
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          action_type: string
          max_actions: number
          user_id: string
          window_minutes: number
        }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_link?: string
          p_message: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      create_unclaimed_company: {
        Args: {
          p_description: string
          p_location: string
          p_name: string
          p_website?: string
        }
        Returns: string
      }
      expire_premium_jobs: { Args: never; Returns: undefined }
      get_hiring_decisions: {
        Args: { candidate_id_param: string }
        Returns: {
          candidate_id: string
          created_at: string
          decision_date: string
          employer: Json
          employer_id: string
          id: string
          notes: string
        }[]
      }
      get_paginated_jobs: {
        Args: {
          p_job_type?: string
          p_limit?: number
          p_location?: string
          p_offset?: number
          p_search_term?: string
        }
        Returns: {
          company_name: string
          created_at: string
          description: string
          id: string
          job_type: string
          location: string
          title: string
          total_count: number
        }[]
      }
      get_profile_views: {
        Args: { profile_id_param: string }
        Returns: {
          id: string
          profile_id: string
          viewed_at: string
          viewer: Json
          viewer_id: string
        }[]
      }
      get_visible_profile_fields: {
        Args: {
          connection_status?: string
          profile_record: Database["public"]["Tables"]["profiles"]["Row"]
          viewer_id: string
        }
        Returns: Json
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      increment_vote_count: {
        Args: { application_id: string }
        Returns: undefined
      }
      process_redemption: {
        Args: {
          p_catalog_item_id: string
          p_request_data?: Json
          p_user_id: string
        }
        Returns: string
      }
      record_ad_view: { Args: { ad_id: string }; Returns: Json }
      record_hiring_decision: {
        Args: {
          candidate_id_param: string
          decision_date_param: string
          employer_id_param: string
          notes_param?: string
        }
        Returns: undefined
      }
      record_profile_view: {
        Args: { profile_id_param: string; viewer_id_param: string }
        Returns: undefined
      }
      redeem_early_job_access: {
        Args: { p_job_id: string; p_points_to_spend?: number }
        Returns: Json
      }
      redeem_reward: {
        Args: { amount_to_spend: number; reward_type: string }
        Returns: Json
      }
      send_notification: {
        Args: { p_data: Json; p_type: string; p_user_id: string }
        Returns: string
      }
      user_can_view_job: {
        Args: { p_job_id: string; p_user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      job_type: "full_time" | "part_time" | "contract" | "internship"
      verification_status: "pending" | "verified" | "rejected" | "unclaimed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      job_type: ["full_time", "part_time", "contract", "internship"],
      verification_status: ["pending", "verified", "rejected", "unclaimed"],
    },
  },
} as const
