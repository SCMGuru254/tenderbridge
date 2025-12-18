
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supply chain and logistics specific keywords
const SUPPLY_CHAIN_KEYWORDS = [
  'supply chain', 'logistics', 'procurement', 'inventory management', 'warehouse management',
  'distribution', 'transportation', 'vendor management', 'sourcing', 'demand planning',
  'forecasting', 'ERP', 'SAP', 'lean manufacturing', 'six sigma', 'kanban',
  'just-in-time', 'jit', 'quality control', 'compliance', 'risk management',
  'cost reduction', 'process improvement', 'kpi', 'analytics', 'data analysis'
];

const analyzeATSCompatibility = (text: string, jobDescription?: string): any => {
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  
  // Calculate keyword score
  const foundKeywords = SUPPLY_CHAIN_KEYWORDS.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  const keywordScore = Math.min((foundKeywords.length / SUPPLY_CHAIN_KEYWORDS.length) * 100, 100);
  
  // Analyze job description keywords if provided
  let jobSpecificKeywords: string[] = [];
  let jobKeywordScore = 0;
  
  if (jobDescription) {
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    jobSpecificKeywords = jobWords.filter(word => 
      word.length > 3 && uniqueWords.has(word)
    ).slice(0, 10);
    jobKeywordScore = jobSpecificKeywords.length > 0 ? 
      (jobSpecificKeywords.length / Math.min(jobWords.length / 10, 20)) * 100 : 0;
  }
  
  // Formatting analysis
  const hasContactInfo = /email|phone|linkedin|address/i.test(text);
  const hasEducation = /education|degree|university|college|bachelor|master|phd/i.test(text);
  const hasExperience = /experience|work|employment|position|role|job/i.test(text);
  const hasSkills = /skills|competencies|abilities|proficient|experienced/i.test(text);
  
  const sectionScore = [hasContactInfo, hasEducation, hasExperience, hasSkills]
    .filter(Boolean).length * 25;
  
  // Formatting score
  const hasBulletPoints = text.includes('•') || text.includes('-') || text.includes('*');
  const hasProperSpacing = text.includes('\n\n');
  const formattingScore = [hasBulletPoints, hasProperSpacing].filter(Boolean).length * 50;
  
  // Readability score (simplified)
  const avgWordsPerSentence = words.length / (text.split(/[.!?]+/).length || 1);
  const readabilityScore = avgWordsPerSentence < 20 && avgWordsPerSentence > 8 ? 90 : 60;
  
  // Overall score
  const overall = Math.round(
    (keywordScore * 0.3 + sectionScore * 0.25 + formattingScore * 0.25 + readabilityScore * 0.2)
  );
  
  // Generate suggestions
  const suggestions = [];
  if (foundKeywords.length < 5) {
    suggestions.push("Include more supply chain and logistics keywords relevant to your experience");
  }
  if (!hasContactInfo) {
    suggestions.push("Ensure your contact information (email, phone, LinkedIn) is clearly visible");
  }
  if (!hasBulletPoints) {
    suggestions.push("Use bullet points to improve readability and ATS parsing");
  }
  if (avgWordsPerSentence > 20) {
    suggestions.push("Use shorter, clearer sentences for better ATS compatibility");
  }
  
  // Missing keywords
  const missingKeywords = SUPPLY_CHAIN_KEYWORDS
    .filter(keyword => !text.toLowerCase().includes(keyword.toLowerCase()))
    .slice(0, 8);
  
  // Issues
  const issues = [];
  if (text.length < 500) {
    issues.push("CV appears too short - consider adding more detail about your experience");
  }
  if (!/\d{4}/.test(text)) {
    issues.push("No dates found - include employment dates and education years");
  }
  if (words.length < 100) {
    issues.push("CV content seems insufficient for proper ATS analysis");
  }
  
  return {
    score: {
      overall,
      keywords: Math.round(keywordScore),
      formatting: formattingScore,
      sections: sectionScore,
      readability: readabilityScore
    },
    suggestions,
    missingKeywords,
    issues
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, jobDescription } = await req.json();
    
    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath);
    
    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }
    
    // Convert file to text (simplified - in production, use proper PDF/DOC parsing)
    const text = await fileData.text();
    
    // Analyze ATS compatibility
    const analysis = analyzeATSCompatibility(text, jobDescription);
    
    // Store analysis result in database for future reference
    const { error: insertError } = await supabase
      .from('ats_analyses')
      .insert({
        file_path: filePath,
        analysis_result: analysis,
        analyzed_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error('Failed to store analysis:', insertError);
      // Continue anyway - don't fail the request
    }
    
    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('ATS analysis error:', error);
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
