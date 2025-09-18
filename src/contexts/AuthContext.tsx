import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  signInWithMagicLink: (email: string, redirectTo?: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: Provider, redirectTo?: string) => Promise<{ error: any }>;
  resetPassword: (email: string, redirectTo?: string) => Promise<{ error: any }>;
  checkOAuthError: (error?: string | null, errorDescription?: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAuthenticated: false,
  signInWithMagicLink: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  checkOAuthError: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        toast.success('Successfully signed out!');
      } else if (event === 'TOKEN_REFRESHED' && !session) {
        console.error('Token refresh failed');
        toast.error('Authentication failed. Please try again.');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (!error) {
        toast.success('Account created! Please check your email to verify your account.');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error signing out');
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const signInWithMagicLink = async (email: string, redirectTo?: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo || `${window.location.origin}/dashboard`,
        },
      });

      if (!error) {
        toast.success('Magic link sent! Check your email.');
      }

      return { error };
    } catch (error) {
      console.error('Magic link error:', error);
      return { error };
    }
  };

  const signInWithOAuth = async (provider: Provider, redirectTo?: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      return { error };
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      return { error };
    }
  };

  const resetPassword = async (email: string, redirectTo?: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${window.location.origin}/auth`,
      });

      if (!error) {
        toast.success('Password reset email sent! Check your inbox.');
      }

      return { error };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error };
    }
  };

  const checkOAuthError = (error?: string | null, errorDescription?: string | null) => {
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      if (error === 'access_denied') {
        toast.error('Authentication was cancelled or denied');
      } else if (error === 'invalid_request') {
        toast.error('OAuth configuration error. Please contact support.');
      } else {
        toast.error(`Authentication error: ${errorDescription || error}`);
      }
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session,
    signInWithMagicLink,
    signInWithOAuth,
    resetPassword,
    checkOAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};