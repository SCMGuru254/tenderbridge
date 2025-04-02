
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useUser = () => {
  const [user, setUser] = useState<null | any>(null);
  const [session, setSession] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Use setTimeout to avoid potential deadlocks
        setTimeout(() => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Signed in successfully",
              description: "Welcome back!"
            });
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out successfully",
              description: "You have been signed out."
            });
          }
        }, 0);
      }
    );

    // Then check for existing session
    const getCurrentUser = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching user:', error);
          setUser(null);
          setSession(null);
        } else {
          setSession(currentSession);
          setUser(currentSession?.user || null);
        }
      } catch (error) {
        console.error('Error in useUser hook:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in signOut function:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { 
    user, 
    session,
    loading, 
    signOut,
    isAuthenticated: !!user
  };
};
