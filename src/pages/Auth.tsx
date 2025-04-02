
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle } from "lucide-react";
import { validateInput, secureValidate } from "@/utils/inputValidation";
import { checkRateLimit, resetRateLimiter } from "@/utils/rateLimiter";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [inputErrors, setInputErrors] = useState<{[key: string]: string}>({});
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Clean up errors when switching between sign in and sign up
    setInputErrors({});
    setAttemptsLeft(null);
    setBlockedUntil(null);
  }, [isSignUp]);

  // Check password strength when it changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    
    // Character type checks
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    
    // Variety check (unique characters)
    const uniqueChars = new Set(password).size;
    score += Math.min(10, uniqueChars / 2);
    
    setPasswordStrength(score);
  }, [password]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Validate email
    if (!validateInput(email, "email")) {
      errors.email = "Please enter a valid email address";
    }
    
    // Validate password
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    // Additional validation for sign up
    if (isSignUp) {
      // Check password strength
      if (passwordStrength < 60) {
        errors.password = "Please use a stronger password with letters, numbers, and symbols";
      }
      
      // Validate full name
      if (!validateInput(fullName, "name")) {
        errors.fullName = "Please enter a valid name (2-50 characters)";
      }
    }
    
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for security issues in inputs
    const emailCheck = secureValidate(email, "email");
    const nameCheck = isSignUp ? secureValidate(fullName, "name") : { securityIssues: [] };
    
    if (emailCheck.securityIssues.length > 0 || nameCheck.securityIssues.length > 0) {
      toast({
        title: "Security Warning",
        description: "Potentially malicious input detected. Please check your entries.",
        variant: "destructive",
      });
      return;
    }
    
    // Check rate limiting
    // In production, you'd use the user's IP address as an identifier
    const rateKey = `auth_${email}`;
    const rateCheck = checkRateLimit(rateKey);
    
    if (rateCheck.blocked) {
      setAttemptsLeft(0);
      setBlockedUntil(rateCheck.blockExpires || null);
      toast({
        title: "Too many attempts",
        description: `Please try again later${rateCheck.blockExpires ? ` (after ${rateCheck.blockExpires.toLocaleTimeString()})` : ''}`,
        variant: "destructive",
      });
      return;
    }
    
    // Update attempts left for display
    setAttemptsLeft(rateCheck.attemptsLeft);
    
    // Form validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        
        // Reset rate limiter on success
        resetRateLimiter(rateKey);
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Reset rate limiter on success
        resetRateLimiter(rateKey);
        
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format the strength message
  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  // Get the progress bar color
  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-center">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
        </div>
        
        {/* Rate limit warning */}
        {attemptsLeft !== null && attemptsLeft < 3 && !blockedUntil && (
          <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Login attempt {6 - attemptsLeft} of 5</AlertTitle>
            <AlertDescription>
              {attemptsLeft === 0 
                ? "Final attempt before temporary lockout" 
                : `${attemptsLeft} attempts remaining before temporary lockout`}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Blocked message */}
        {blockedUntil && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Account temporarily locked</AlertTitle>
            <AlertDescription>
              Too many failed attempts. Please try again after {blockedUntil.toLocaleTimeString()}.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
                className={inputErrors.fullName ? "border-red-500" : ""}
              />
              {inputErrors.fullName && (
                <p className="text-sm text-red-500">{inputErrors.fullName}</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputErrors.email ? "border-red-500" : ""}
            />
            {inputErrors.email && (
              <p className="text-sm text-red-500">{inputErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputErrors.password ? "border-red-500" : ""}
            />
            {inputErrors.password && (
              <p className="text-sm text-red-500">{inputErrors.password}</p>
            )}
            
            {/* Password strength meter (only on sign up) */}
            {isSignUp && password && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Password Strength:</span>
                  <span>{getStrengthText()}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isLoading || !!blockedUntil}>
            {isLoading
              ? "Loading..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
