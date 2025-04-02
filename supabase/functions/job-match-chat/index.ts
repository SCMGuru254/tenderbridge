
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define question types for different categories
const questionTypes = {
  jobMatching: {
    keywords: ['job', 'position', 'career', 'work', 'employment', 'hiring', 'vacancy'],
    handler: handleJobMatchQuestion,
  },
  interviewPrep: {
    keywords: ['interview', 'question', 'answer', 'prepare', 'skill', 'experience', 'resume', 'cv'],
    handler: handleInterviewQuestion,
  },
  default: {
    handler: handleGeneralQuestion,
  }
};

// Mock database of job listings
const jobListings = [
  {
    id: "1",
    title: "Supply Chain Manager",
    company: "LogiTech Solutions",
    location: "Nairobi, Kenya",
    description: "Managing end-to-end supply chain operations",
    requirements: "5+ years of experience, knowledge of SAP",
    skills: ["inventory management", "procurement", "logistics", "SAP", "team leadership"]
  },
  {
    id: "2",
    title: "Logistics Coordinator",
    company: "Global Freight Kenya",
    location: "Mombasa, Kenya",
    description: "Coordinate shipment logistics and customs clearance",
    requirements: "3+ years in freight forwarding, knowledge of customs regulations",
    skills: ["freight forwarding", "customs clearance", "documentation", "route optimization"]
  },
  {
    id: "3",
    title: "Procurement Officer",
    company: "East Africa Distributors",
    location: "Nairobi, Kenya",
    description: "Handle vendor relationships and purchasing processes",
    requirements: "Bachelor's degree in supply chain, 2+ years in procurement",
    skills: ["vendor management", "negotiation", "contract management", "sourcing"]
  },
  {
    id: "4",
    title: "Inventory Analyst",
    company: "Retail Solutions Kenya",
    location: "Nakuru, Kenya",
    description: "Optimize inventory levels and forecast demand",
    requirements: "Strong analytical skills, experience with inventory management systems",
    skills: ["inventory control", "forecasting", "data analysis", "ERP systems"]
  },
  {
    id: "5",
    title: "Supply Chain Analyst",
    company: "Manufacturing Excellence",
    location: "Nairobi, Kenya",
    description: "Analyze supply chain processes and recommend improvements",
    requirements: "Bachelor's degree, knowledge of lean principles",
    skills: ["process improvement", "data visualization", "cost reduction", "Excel", "Power BI"]
  }
];

// Interview response database - expanded with more detailed answers
const interviewResponses = {
  "supply chain software": `When discussing supply chain software experience:

1. List the specific systems you've used (SAP, Oracle SCM, JDA, etc.) and your proficiency level.
2. Describe how you've used these systems to solve real business problems.
3. Explain your role in implementation or optimization if applicable.
4. Highlight your adaptability to learn new systems quickly.
5. Mention any relevant certifications.

Be honest about your experience level with each system rather than overselling your expertise.`,

  "supply chain disruptions": `When handling supply chain disruptions:

1. Emphasize your proactive approach to risk management.
2. Explain your methodology for identifying potential disruptions before they occur.
3. Describe your communication strategy across departments and with external partners.
4. Provide a specific example where you successfully navigated a disruption.
5. Highlight your ability to create backup plans and alternative sourcing strategies.

Remember to mention how you balance cost considerations with supply chain resilience.`,

  "process improvement": `For process improvement questions:

1. Use the DMAIC framework (Define, Measure, Analyze, Improve, Control) to structure your answer.
2. Start with how you identified the process that needed improvement.
3. Explain the metrics you used to measure the current state.
4. Detail your analysis of root causes.
5. Describe the specific improvements you implemented.
6. Quantify the results achieved (cost savings, time reduction, quality improvement).

Emphasize your collaborative approach and how you managed change resistance.`,

  "team management": `When discussing team management in supply chain:

1. Describe your leadership style and how you adapt it to different team members.
2. Explain how you set clear expectations and measurable goals.
3. Discuss your approach to developing team members' skills.
4. Share an example of how you've resolved conflicts within your team.
5. Highlight your communication strategies for keeping everyone aligned.

Include specific metrics that show how your leadership improved team performance.`,

  "negotiation": `For negotiation skills in supply chain:

1. Outline your preparation process before entering negotiations.
2. Explain how you identify leverage points and areas for mutual benefit.
3. Describe your communication techniques during difficult negotiations.
4. Share an example of a successful negotiation that created value for both parties.
5. Discuss how you maintain relationships after tough negotiations.

Provide concrete examples of cost savings or improved terms you've achieved.`,

  "tell me about yourself": `When answering "Tell me about yourself" in a supply chain interview:

1. Start with your educational background relevant to supply chain.
2. Provide a brief chronological overview of your relevant experience.
3. Highlight 2-3 key achievements that demonstrate your expertise.
4. Mention your specialized skills or knowledge areas in supply chain.
5. Conclude with what you're looking for in your next role and why you're interested in this position.

Keep your answer concise (1-2 minutes) and focused on professional qualifications rather than personal details.`
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log(`Received query: "${query}"`);
    
    // Determine question type
    const questionType = determineQuestionType(query);
    
    // Call appropriate handler based on question type
    const result = await questionType.handler(query);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in job-match-chat function:', error);
    return new Response(JSON.stringify({ 
      message: "Sorry, I encountered an error processing your request. Please try again.",
      matchedJobs: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function determineQuestionType(query: string) {
  const queryLower = query.toLowerCase();
  
  // Check for job matching questions
  for (const keyword of questionTypes.jobMatching.keywords) {
    if (queryLower.includes(keyword)) {
      return questionTypes.jobMatching;
    }
  }
  
  // Check for interview prep questions
  for (const keyword of questionTypes.interviewPrep.keywords) {
    if (queryLower.includes(keyword)) {
      return questionTypes.interviewPrep;
    }
  }
  
  // Default to general question handling
  return questionTypes.default;
}

async function handleJobMatchQuestion(query: string) {
  const queryLower = query.toLowerCase();
  
  // Extract potential skills/keywords from the query
  const keywords = queryLower
    .split(/\s+/)
    .filter(word => word.length > 3)
    .map(word => word.replace(/[^\w]/g, ''));
  
  // Find jobs that match the query based on keywords
  const matchedJobs = jobListings
    .map(job => {
      const jobText = `${job.title} ${job.description} ${job.requirements} ${job.skills.join(' ')}`.toLowerCase();
      
      // Calculate a simple match score based on keyword occurrence
      const score = keywords.reduce((total, keyword) => {
        return jobText.includes(keyword) ? total + 1 : total;
      }, 0);
      
      return { ...job, score };
    })
    .filter(job => job.score > 0) // Only include jobs with matches
    .sort((a, b) => b.score - a.score); // Sort by score, highest first
  
  // Generate response message
  let message;
  if (matchedJobs.length > 0) {
    message = `Based on your query, I found ${matchedJobs.length} supply chain jobs in Kenya that might interest you. Here are the top matches:`;
  } else {
    message = "I couldn't find any exact matches for your query. Try mentioning specific skills or job titles like 'logistics coordinator' or 'procurement specialist'. Here are some available supply chain positions:";
    return {
      message,
      matchedJobs: jobListings.slice(0, 3) // Return some default jobs if no matches
    };
  }
  
  return {
    message,
    matchedJobs
  };
}

async function handleInterviewQuestion(query: string) {
  const queryLower = query.toLowerCase();
  
  // Try to match with predefined interview topics
  let bestMatch = "";
  let bestScore = 0;
  
  for (const topic of Object.keys(interviewResponses)) {
    if (queryLower.includes(topic)) {
      const score = topic.length; // Simple scoring based on length of matching phrase
      if (score > bestScore) {
        bestScore = score;
        bestMatch = topic;
      }
    }
  }
  
  // If we have a match, use the corresponding response
  if (bestMatch && bestScore > 0) {
    return {
      message: interviewResponses[bestMatch as keyof typeof interviewResponses],
      matchedJobs: [] // No job listings for interview questions
    };
  }
  
  // For "tell me about yourself" or similar variations
  if (queryLower.includes("about myself") || queryLower.includes("about me") || queryLower.includes("tell me about")) {
    return {
      message: interviewResponses["tell me about yourself"],
      matchedJobs: []
    };
  }
  
  // Generic interview advice if no specific match
  return {
    message: `For this interview question, remember to:

1. Structure your answer using the STAR method (Situation, Task, Action, Result)
2. Focus on relevant examples from your supply chain experience
3. Quantify your achievements when possible
4. Keep your answer concise and focused on the question
5. Highlight the skills that are most relevant to the job you're applying for

Would you like more specific advice about a particular type of interview question?`,
    matchedJobs: []
  };
}

async function handleGeneralQuestion(query: string) {
  // Handle general questions that don't fit the other categories
  return {
    message: `I'm your job matching assistant focused on helping with supply chain jobs in Kenya and interview preparation. 

I can help you:
1. Find supply chain jobs that match your skills
2. Provide advice for common interview questions
3. Share tips on how to answer specific types of questions

What specific help are you looking for today?`,
    matchedJobs: []
  };
}
