
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
    const { 
      documentType, 
      language, 
      templateId, 
      jobTitle, 
      experience, 
      skills, 
      jobDescription 
    } = await req.json();
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // Validate the required inputs
    if (!documentType || !language || (documentType === 'cv' && !templateId) || !experience || !skills) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, this would connect to an AI service
    // like OpenAI or a similar service to generate the document
    
    // For demonstration, we'll simulate document generation
    const content = await simulateDocumentGeneration(
      documentType,
      language,
      templateId,
      jobTitle,
      experience,
      skills,
      jobDescription
    );
    
    // For a real implementation, this would use a PDF generation service
    // to create a downloadable document from the content
    
    // Record the generated document in the database (for auditing and cleanup)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // 24 hours from now
    
    const { data, error } = await supabaseClient
      .from('generated_documents')
      .insert({
        document_type: documentType,
        language,
        template_id: templateId,
        content: JSON.stringify(content),
        expiration_date: expirationDate.toISOString(),
      })
      .select('id')
      .single();
      
    if (error) {
      console.error("Error recording document:", error);
      // Non-critical error, so continue
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        documentUrl: `https://example.com/documents/${data?.id || 'demo'}.pdf`,
        content
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in document-generator function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Simulate document generation - in a real implementation, this would be an AI service
async function simulateDocumentGeneration(
  documentType: string,
  language: string,
  templateId: string,
  jobTitle: string,
  experience: string,
  skills: string,
  jobDescription: string
): Promise<any> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a mock document structure
  return {
    documentType,
    language,
    templateId,
    sections: {
      header: {
        title: jobTitle || "Professional CV",
        subtitle: language === "en" ? "Supply Chain Professional" : "Profesional de la Cadena de Suministro"
      },
      experience: {
        title: language === "en" ? "Professional Experience" : "Experiencia Profesional",
        content: experience
      },
      skills: {
        title: language === "en" ? "Key Skills" : "Habilidades Clave",
        items: skills.split(",").map(skill => skill.trim())
      },
      // Additional sections would be included in a real implementation
    }
  };
}
