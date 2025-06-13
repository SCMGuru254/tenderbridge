
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/");
    }
  };
  const handleSignIn = async () => {
    if (isBlocked) {
      toast.error("Too many failed attempts. Please try again later.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          password,
          action: 'signin'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          setIsBlocked(true);
          const retryAfter = response.headers.get('Retry-After');
          toast.error(`Too many attempts. Please try again in ${retryAfter} seconds.`);
        } else if (response.status === 423) {
          // Account locked
          setIsBlocked(true);
          toast.error(`Account temporarily locked. ${data.error}`);
        } else if (response.status === 401) {
          const newAttemptsLeft = attemptsLeft - 1;
          setAttemptsLeft(newAttemptsLeft);
          
          if (newAttemptsLeft <= 0) {
            setIsBlocked(true);
            toast.error("Account temporarily blocked due to too many failed attempts.");
          } else {
            toast.error(`Invalid credentials. ${newAttemptsLeft} attempts remaining.`);
          }
        } else {
          toast.error(data.error || 'Sign in failed');
        }
        return;
      }

      if (data.user) {
        // Update the Supabase session
        const { data: sessionData } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (sessionData.session) {
          toast.success("Successfully signed in!");
          navigate("/");
        }
      }
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
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          action: 'signup'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          setIsBlocked(true);
          const retryAfter = response.headers.get('Retry-After');
          toast.error(`Too many attempts. Please try again in ${retryAfter} seconds.`);
        } else if (response.status === 400) {
          // Validation error
          toast.error(data.error);
        } else {
          toast.error(data.error || 'Sign up failed');
        }
        return;
      }

      if (data.user) {
        toast.success("Account created! Please check your email to verify your account.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          {isBlocked && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Account temporarily blocked. Please try again later.
              </AlertDescription>
            </Alert>
          )}

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
                  disabled={loading || isBlocked}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || isBlocked}
                />
              </div>
              <Button 
                onClick={handleSignIn} 
                className="w-full" 
                disabled={loading || isBlocked}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              {attemptsLeft < 5 && attemptsLeft > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  {attemptsLeft} attempts remaining
                </p>
              )}
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button onClick={handleSignUp} className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
