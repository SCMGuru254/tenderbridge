
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
function validateQuestion(question: string): boolean {
  return typeof question === 'string' && 
         question.length > 0 && 
         question.length <= 500;
}

// Supply chain interview topics and best practices
const SUPPLY_CHAIN_TOPICS = {
  "inventory management": [
    "ABC analysis",
    "EOQ (Economic Order Quantity)",
    "Safety stock calculations",
    "JIT (Just-in-Time)",
    "Inventory turnover metrics"
  ],
  "logistics": [
    "Transportation modes",
    "Route optimization",
    "3PL management",
    "Cross-docking",
    "Last-mile delivery"
  ],
  "procurement": [
    "Strategic sourcing",
    "Vendor management",
    "Contract negotiation",
    "Cost analysis",
    "Supplier relationship management"
  ],
  "supply chain technology": [
    "ERP systems",
    "WMS (Warehouse Management Systems)",
    "TMS (Transportation Management Systems)",
    "Supply chain visibility platforms",
    "Blockchain in supply chain"
  ]
};

const INTERVIEW_BEST_PRACTICES = [
  "Use the STAR method (Situation, Task, Action, Result)",
  "Provide specific metrics and KPIs",
  "Demonstrate problem-solving skills",
  "Show cross-functional collaboration",
  "Highlight process improvement initiatives",
  "Discuss risk management strategies"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    
    // Validate input
    if (!validateQuestion(question)) {
      return new Response(JSON.stringify({
        error: 'Invalid question format or length',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Identify relevant topics from the question
    const relevantTopics = Object.entries(SUPPLY_CHAIN_TOPICS)
      .filter(([topic]) => question.toLowerCase().includes(topic))
      .map(([_, concepts]) => concepts)
      .flat();

    // Use Hugging Face API for open-source model inference
    const response = await fetch("https://api-inference.huggingface.co/models/bigscience/bloomz-560m", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("HUGGINGFACE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `As a supply chain professional, provide a detailed answer to this interview question: ${question}

Consider these relevant concepts: ${relevantTopics.join(", ")}

Best practices to include:
${INTERVIEW_BEST_PRACTICES.join("\n")}

Format the answer professionally and include specific examples.

Answer:`,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      })
    });

    const result = await response.json();
    
    // Post-process the model output
    let answer = result[0]?.generated_text || "";
    
    // Ensure the answer follows STAR method if it's an experience question
    if (question.toLowerCase().includes("tell me about a time") || 
        question.toLowerCase().includes("describe a situation")) {
      answer = `Let me structure this using the STAR method:

${answer}

Key Takeaways:
${INTERVIEW_BEST_PRACTICES.slice(0, 3).map(practice => `- ${practice}`).join("\n")}`;
    }

    // Add relevant supply chain terminology if missing
    if (relevantTopics.length > 0) {
      answer += "\n\nRelevant Supply Chain Concepts:\n" +
        relevantTopics.slice(0, 5).map(topic => `- ${topic}`).join("\n");
    }

    return new Response(JSON.stringify({ 
      answer,
      topics: relevantTopics
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in interview-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: "I apologize, but I'm having trouble connecting to the AI service. " +
                "Please remember to structure your answer using the STAR method and include specific examples from your experience."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
