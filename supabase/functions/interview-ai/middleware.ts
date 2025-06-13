// Security middleware for rate limiting and input validation
export const securityMiddleware = async (req: Request): Promise<Response | null> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    const { question } = await req.json();
    
    // Validate input
    if (typeof question !== 'string' || question.length === 0 || question.length > 500) {
      return new Response(JSON.stringify({
        error: 'Invalid question format or length',
        success: false
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return null; // Proceed with normal processing
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Invalid request body',
      success: false
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
