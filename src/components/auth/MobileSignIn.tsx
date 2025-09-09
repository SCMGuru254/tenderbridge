import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface MobileSignInProps {
  onBack?: () => void;
}

export const MobileSignIn = ({ onBack }: MobileSignInProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        toast.success('Check your email for confirmation link!');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success('Signed in successfully!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/lovable-uploads/e1d28f69-6e57-4858-8cb9-13fe4c196e80.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            SupplyChain_KE
          </h1>
          <p className="text-white/80 text-lg">
            Connect. Learn. Grow.
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="w-full max-w-sm bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white text-xl">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
              )}
              
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-white/80 hover:text-white underline text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center space-x-6 text-white/80 text-sm">
            <span>✓ Job Opportunities</span>
            <span>✓ Professional Network</span>
            <span>✓ Career Growth</span>
          </div>
        </div>
      </div>
    </div>
  );
};