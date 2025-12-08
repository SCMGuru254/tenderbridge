import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        setIsChecking(true);
        try {
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
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          navigate('/dashboard');
        } finally {
          setIsChecking(false);
        }
      }
    };

    // Only check onboarding if user is authenticated and auth is not loading
    if (!loading && user) {
      checkOnboardingStatus();
    }
  }, [user, loading, navigate]);

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users immediately
  if (!user) {
    return <>{children}</>;
  }

  // Show loading while checking onboarding/redirecting
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking your account...</p>
        </div>
      </div>
    );
  }

  // Fallback while redirecting (shouldn't show for long)
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};
