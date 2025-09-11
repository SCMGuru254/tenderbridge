import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const AuthFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    handleAuthFlow();
  }, []);

  const handleAuthFlow = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        navigate('/auth');
        return;
      }

      if (session?.user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('position, company, onboarding_completed')
          .eq('id', session.user.id)
          .single();

        if (profile?.onboarding_completed) {
          // Redirect based on user type
          if (profile.position?.toLowerCase().includes('hr') || 
              profile.position?.toLowerCase().includes('recruiter')) {
            navigate('/dashboard');
          } else {
            navigate('/jobs');
          }
        } else {
          // Start onboarding
          navigate('/onboarding');
        }
        
        toast.success('Successfully signed in!');
      } else {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Authentication flow error:', error);
      navigate('/auth');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Setting up your account...</p>
      </div>
    </div>
  );
};