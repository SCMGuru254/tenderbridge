
import { supabase } from '@/integrations/supabase/client';

export interface SecurityResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const validateInput = (input: string, maxLength: number = 1000): boolean => {
  return input.length <= maxLength && !/<script|javascript:|data:/i.test(input);
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const checkRateLimit = async (userId: string, action: string): Promise<boolean> => {
  // Simple rate limiting check - in production, use Redis or similar
  const key = `${userId}_${action}`;
  const lastAction = localStorage.getItem(key);
  const now = Date.now();
  
  if (lastAction && (now - parseInt(lastAction)) < 1000) {
    return false; // Rate limited
  }
  
  localStorage.setItem(key, now.toString());
  return true;
};

export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch {
    return false;
  }
};
