import { checkRateLimit, authRateLimit } from '../../utils/rateLimit.ts'
import { addSecurityHeaders } from '../../utils/security.ts'
import { createClient } from '@supabase/supabase-js'

export async function withSecurity(req: Request, handler: (req: Request) => Promise<Response>) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      }
    })
  }

  try {
    // Check rate limit
    const ip = req.headers.get('x-real-ip') || 'unknown'
    const isAuthEndpoint = req.url.includes('/auth/')
    const rateLimiter = isAuthEndpoint ? authRateLimit : checkRateLimit
    const rateLimit = await rateLimiter(ip)

    if (!rateLimit.success) {
      return new Response(JSON.stringify({ 
        error: 'Too many requests' 
      }), { 
        status: 429,
        headers: {
          ...rateLimit.headers,
          'Content-Type': 'application/json'
        }
      })
    }

    // Handle the request
    const response = await handler(req)

    // Add security headers
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Security middleware error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
