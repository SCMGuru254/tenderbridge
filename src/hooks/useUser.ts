
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUser = () => {
  const [user, setUser] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user state
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error in useUser hook:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
