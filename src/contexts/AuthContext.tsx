import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create a minimal context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAuthenticated: false
});

export const useAuth = () => {
  return useContext(AuthContext);
};

// Temporary minimal provider to avoid React hook issues
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('AuthProvider: Rendering minimal provider');
  
  const value: AuthContextType = {
    user: null,
    session: null,
    loading: false,
    signIn: async (_email: string, _password: string) => {
      console.log('Sign in called');
      return { error: null };
    },
    signUp: async (_email: string, _password: string, _fullName?: string) => {
      console.log('Sign up called');
      return { error: null };
    },
    signOut: async () => {
      console.log('Sign out called');
    },
    isAuthenticated: false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};