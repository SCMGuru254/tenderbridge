export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      supply_chain_jobs: {
        Row: {
          id: string
          title: string
          company: string
          location: string
          description: string
          url: string
          posted_at: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          description: string
          url: string
          posted_at: string
          created_at: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          description?: string
          url?: string
          posted_at?: string
          created_at?: string
        }
      }
      job_fetch_log: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id?: string
          created_at: string
        }
        Update: {
          id?: string
          created_at?: string
        }
      }
      service_metrics: {
        Row: {
          id: string
          operation: string
          duration_ms: number
          success: boolean
          timestamp: string
        }
        Insert: {
          id?: string
          operation: string
          duration_ms: number
          success: boolean
          timestamp: string
        }
        Update: {
          id?: string
          operation?: string
          duration_ms?: number
          success?: boolean
          timestamp?: string
        }
      }
    }
  }
} 