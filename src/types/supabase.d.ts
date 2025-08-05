import type { Database } from '@/integrations/supabase/types'

declare module '@supabase/supabase-js' {
  export * from '@supabase/gotrue-js'
  export * from '@supabase/postgrest-js'
  export * from '@supabase/realtime-js'
  export * from '@supabase/storage-js'
  export * from '@supabase/functions-js'
  
  export interface SupabaseClient<
    DatabaseGeneric = any,
    SchemaName = "public"
  > {
    from: any
    auth: any
    storage: any
    rpc: any
    functions: any
    channel: any
  }

  export function createClient<
    Database = any,
    SchemaName extends string & keyof Database = "public" extends keyof Database
      ? "public"
      : string & keyof Database
  >(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): SupabaseClient<Database, SchemaName>

  export interface User {
    id: string
    email?: string
    user_metadata?: any
    [key: string]: any
  }

  export interface Session {
    access_token: string
    refresh_token: string
    user: User
    [key: string]: any
  }
}
