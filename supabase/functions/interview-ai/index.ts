
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { question } = await req.json();
    
    // We're using a simple approach here with predefined responses
    // For a production app, you'd connect to a real model API
    
    const responses = {
      default: `Here's how you might approach this question in an interview:

1. Start by briefly introducing your background relevant to this question.
2. Use the STAR method (Situation, Task, Action, Result) to structure your answer.
3. Be specific about your contributions and quantify results if possible.
4. Keep your answer concise but detailed enough to demonstrate your skills.

Practice this answer out loud a few times to make it sound natural!`,
      
      "Describe a time when you improved a supply chain process": 
      `For this supply chain improvement question:

1. Choose a specific example where you identified and solved a problem.
2. Explain the situation and what inefficiency you noticed.
3. Describe your approach: How did you analyze the problem? Who did you collaborate with?
4. Detail the specific changes you implemented.
5. Quantify the results: reduced costs, improved delivery times, etc.

Example structure: "At [Company], I noticed [problem]. I analyzed [data/process] and identified [cause]. By implementing [solution], we achieved [specific measurable results]."`,
      
      "How do you handle supply chain disruptions?":
      `When discussing supply chain disruptions:

1. Emphasize your proactive approach to risk management.
2. Explain your methodology for identifying potential disruptions before they occur.
3. Describe your communication strategy across departments and with external partners.
4. Provide a specific example where you successfully navigated a disruption.
5. Highlight your ability to create backup plans and alternative sourcing strategies.

Remember to mention how you balance cost considerations with supply chain resilience.`,
      
      "What supply chain software are you familiar with?":
      `When discussing supply chain software experience:

1. List the specific systems you've used (SAP, Oracle SCM, JDA, etc.) and your proficiency level.
2. Describe how you've used these systems to solve real business problems.
3. Explain your role in implementation or optimization if applicable.
4. Highlight your adaptability to learn new systems quickly.
5. Mention any relevant certifications.

Be honest about your experience level with each system rather than overselling your expertise.`
    };

    // Find the best matching response based on the question
    let bestResponse = responses.default;
    let bestMatchScore = 0;
    
    // Very simple matching algorithm - for production you'd use a real NLP approach
    for (const [key, response] of Object.entries(responses)) {
      if (key === 'default') continue;
      
      // Simple word matching - count how many words from the key are in the question
      const keyWords = key.toLowerCase().split(' ');
      const questionLower = question.toLowerCase();
      
      let matchScore = 0;
      keyWords.forEach(word => {
        if (word.length > 3 && questionLower.includes(word)) {
          matchScore++;
        }
      });
      
      // If this is a better match than what we have, use it
      if (matchScore > bestMatchScore) {
        bestMatchScore = matchScore;
        bestResponse = response;
      }
    }

    console.log(`Question: ${question}`);
    console.log(`Matched with score: ${bestMatchScore}`);
    
    // For a real implementation, you would call an AI API here
    return new Response(JSON.stringify({ 
      answer: bestResponse 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in interview-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
