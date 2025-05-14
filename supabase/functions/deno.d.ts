// Type declarations for Deno standard library and third-party modules

declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts" {
  export class DOMParser {
    parseFromString(text: string, type: string): Document;
  }

  export interface Document {
    querySelectorAll(selectors: string): Element[];
    querySelector(selectors: string): Element | null;
  }

  export interface Element {
    querySelectorAll(selectors: string): Element[];
    querySelector(selectors: string): Element | null;
    getAttribute(name: string): string | null;
    hasAttribute(name: string): boolean;
    closest(selectors: string): Element | null;
    textContent: string | null;
  }
}

declare module "https://deno.land/std@0.167.0/node/crypto.ts" {
  export function createHmac(algorithm: string, key: string): Hmac;
  
  interface Hmac {
    update(data: string): Hmac;
    digest(encoding: string): string;
  }
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string): SupabaseClient;
  
  interface SupabaseClient {
    from: (table: string) => SupabaseQueryBuilder;
    auth: SupabaseAuth;
  }
  
  interface SupabaseAuth {
    // Add auth methods as needed
  }
  
  interface SupabaseQueryBuilder {
    select: (columns?: string) => SupabaseQueryBuilder;
    insert: (data: any) => SupabaseQueryBuilder;
    update: (data: any) => SupabaseQueryBuilder;
    delete: () => SupabaseQueryBuilder;
    eq: (column: string, value: any) => SupabaseQueryBuilder;
    neq: (column: string, value: any) => SupabaseQueryBuilder;
    gt: (column: string, value: any) => SupabaseQueryBuilder;
    lt: (column: string, value: any) => SupabaseQueryBuilder;
    gte: (column: string, value: any) => SupabaseQueryBuilder;
    lte: (column: string, value: any) => SupabaseQueryBuilder;
    order: (column: string, options?: { ascending?: boolean }) => SupabaseQueryBuilder;
    limit: (count: number) => SupabaseQueryBuilder;
    single: () => Promise<{ data: any; error: any }>;
    then: (callback: (result: { data: any; error: any }) => any) => Promise<any>;
    distinct: () => SupabaseQueryBuilder;
  }
}

declare module "https://esm.sh/@supabase/supabase-js@2.7.1" {
  export * from "https://esm.sh/@supabase/supabase-js@2";
}