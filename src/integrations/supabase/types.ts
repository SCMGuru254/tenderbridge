export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
          referral_type: string
          referred_user_id: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_earned?: number | null
          conversion_amount?: number | null
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referral_type: string
          referred_user_id?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_earned?: number | null
          conversion_amount?: number | null
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referral_type?: string
          referred_user_id?: string | null
          status?: string
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
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
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
          previous_job: string | null
          role: string | null
          tagline: string | null
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
          previous_job?: string | null
          role?: string | null
          tagline?: string | null
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
          previous_job?: string | null
          role?: string | null
          tagline?: string | null
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
      increment_vote_count: {
        Args: { application_id: string }
        Returns: undefined
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
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
