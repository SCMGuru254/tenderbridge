
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    console.log("Running document cleaner function");
    
    // Find expired documents
    const now = new Date().toISOString();
    const { data: expiredDocuments, error: fetchError } = await supabaseClient
      .from('generated_documents')
      .select('id, document_url, storage_path')
      .lt('expiration_date', now);
      
    if (fetchError) {
      console.error("Error fetching expired documents:", fetchError);
      throw fetchError;
    }
    
    console.log(`Found ${expiredDocuments?.length || 0} expired documents to clean up`);
    
    // Process each expired document
    const results = [];
    for (const doc of expiredDocuments || []) {
      try {
        // If the document is stored in Supabase Storage, delete it
        if (doc.storage_path) {
          const [bucket, ...pathParts] = doc.storage_path.split('/');
          const path = pathParts.join('/');
          
          if (bucket && path) {
            const { error: storageError } = await supabaseClient
              .storage
              .from(bucket)
              .remove([path]);
              
            if (storageError) {
              console.error(`Error deleting file ${doc.storage_path}:`, storageError);
              results.push({ id: doc.id, success: false, error: storageError.message });
              continue;
            }
          }
        }
        
        // Delete the database record
        const { error: deleteError } = await supabaseClient
          .from('generated_documents')
          .delete()
          .eq('id', doc.id);
          
        if (deleteError) {
          console.error(`Error deleting record ${doc.id}:`, deleteError);
          results.push({ id: doc.id, success: false, error: deleteError.message });
          continue;
        }
        
        results.push({ id: doc.id, success: true });
      } catch (error) {
        console.error(`Error processing document ${doc.id}:`, error);
        results.push({ id: doc.id, success: false, error: error.message });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        cleaned: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in document-cleaner function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
