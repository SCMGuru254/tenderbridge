import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (profile?.onboarding_completed) {
          // User has completed onboarding, go to dashboard
          navigate('/dashboard');
        } else {
          // User needs to complete onboarding
          navigate('/onboarding');
        }
      }
    };

    checkOnboardingStatus();
  }, [user, navigate]);

  // Show landing page for non-authenticated users
  if (!user) {
    return <>{children}</>;
  }

  // Show loading or nothing while redirecting
  return null;
};
