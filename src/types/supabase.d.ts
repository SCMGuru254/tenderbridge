declare module '@supabase/supabase-js' {
  export * from '@supabase/gotrue-js'
  export * from '@supabase/postgrest-js'
  export * from '@supabase/realtime-js'
  export * from '@supabase/storage-js'
  export * from '@supabase/functions-js'
  
  export interface SupabaseClient {
    from: any
    auth: any
    storage: any
    rpc: any
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): SupabaseClient
}
