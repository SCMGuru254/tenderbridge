import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import chairsBg from "@/assets/chairs-bg.jpg";
import appLogo from "@/assets/app-icon.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthState();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            // Check user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('position, company, onboarding_completed')
              .eq('id', session.user.id)
              .single();

            toast.success("Successfully signed in!");

            if (profile?.onboarding_completed) {
              // Redirect based on user type
              if (profile.position?.toLowerCase().includes('hr') || 
                  profile.position?.toLowerCase().includes('recruiter')) {
                navigate('/dashboard');
              } else {
                navigate('/dashboard'); // Default to dashboard for all users
              }
            } else {
              // Start onboarding
              navigate('/onboarding');
            }
          } catch (error) {
            console.error('Error handling auth state change:', error);
            navigate('/onboarding'); // Default to onboarding if there's an error
          }
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          navigate('/auth');
        }
        
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.error('Token refresh failed');
          toast.error("Authentication failed. Please try again.");
        }
        
        setSocialLoading(false);
        setLoading(false);
      }
    );

    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      if (error === 'access_denied') {
        toast.error("Authentication was cancelled or denied");
      } else if (error === 'invalid_request') {
        toast.error("OAuth configuration error. Please contact support.");
      } else {
        toast.error(`Authentication error: ${errorDescription || error}`);
      }
      setSocialLoading(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

    const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
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
            navigate('/dashboard'); // Default to dashboard for all users
          }
        } else {
          // Start onboarding
          navigate('/onboarding');
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Don't navigate here, let onAuthStateChange handle it
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created! Please check your email to verify your account.");
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSignIn = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Magic link sent! Check your email.");
    } catch (error) {
      console.error("Magic link error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setSocialLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(`LinkedIn sign-in failed: ${error.message}`);
        setSocialLoading(false);
        return;
      }
    } catch (error) {
      console.error("LinkedIn sign-in error:", error);
      toast.error("An unexpected error occurred with LinkedIn sign-in");
      setSocialLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${chairsBg})`,
          backgroundColor: '#0284c7',
          backgroundBlendMode: 'multiply'
        }}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md px-6 py-12 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl m-4">
        <div className="text-center mb-8">
          <img src={appLogo} alt="SupplyChain KE" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SupplyChain KE</h1>
          <p className="text-gray-600">Your Professional Supply Chain Network</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || socialLoading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || socialLoading}
                className="h-11"
              />
            </div>
            <Button 
              onClick={handleSignIn} 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
              disabled={loading || socialLoading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={handleMagicLinkSignIn}
                className="text-sm text-blue-600"
                disabled={loading || socialLoading}
              >
                Send Magic Link
              </Button>
              <span className="mx-2 text-gray-400">|</span>
              <Button 
                variant="link" 
                onClick={handlePasswordReset}
                className="text-sm text-blue-600"
                disabled={loading || socialLoading}
              >
                Forgot Password?
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLinkedInSignIn}
              className="w-full h-11"
              disabled={loading || socialLoading}
            >
              {socialLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {socialLoading ? 'Connecting...' : 'Continue with LinkedIn'}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading || socialLoading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signupEmail">Email</Label>
              <Input
                id="signupEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || socialLoading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signupPassword">Password</Label>
              <Input
                id="signupPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || socialLoading}
                className="h-11"
              />
            </div>
            <Button 
              onClick={handleSignUp} 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
              disabled={loading || socialLoading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLinkedInSignIn}
              className="w-full h-11"
              disabled={loading || socialLoading}
            >
              {socialLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue with LinkedIn
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Auth;