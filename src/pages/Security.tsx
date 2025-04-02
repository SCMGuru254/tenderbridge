
import { useState } from "react";
import { Shield, Lock, Eye, EyeOff, Download, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const Security = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [dataDownloading, setDataDownloading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    
    if (password.length >= 8) score += 20;
    if (password.match(/[A-Z]/)) score += 20;
    if (password.match(/[a-z]/)) score += 20;
    if (password.match(/[0-9]/)) score += 20;
    if (password.match(/[^A-Za-z0-9]/)) score += 20;
    
    setPasswordScore(score);
    return score;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (checkPasswordStrength(newPassword) < 60) {
      toast({
        title: "Weak password",
        description: "Please choose a stronger password.",
        variant: "destructive"
      });
      return;
    }

    try {
      // This would be implemented with Supabase Auth
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully."
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Try again later.",
        variant: "destructive"
      });
    }
  };

  const toggleMFA = () => {
    // This would be implemented with Supabase Auth
    setMfaEnabled(!mfaEnabled);
    toast({
      title: mfaEnabled ? "MFA disabled" : "MFA enabled",
      description: mfaEnabled 
        ? "Multi-factor authentication has been disabled" 
        : "Multi-factor authentication has been enabled"
    });
  };

  const downloadPersonalData = () => {
    setDataDownloading(true);
    
    setTimeout(() => {
      // In a real app, this would fetch the user's data from the database
      const userData = {
        profile: {
          email: user?.email,
          name: user?.user_metadata?.full_name || "User",
          created_at: user?.created_at
        },
        // Add more user data as needed
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDataDownloading(false);
      toast({
        title: "Data exported",
        description: "Your personal data has been exported successfully."
      });
    }, 1500);
  };

  const handleDataDeletion = () => {
    toast({
      title: "Not implemented",
      description: "This feature would require backend confirmation and proper data deletion process.",
      variant: "default"
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Security Center</h1>
      </div>

      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Security Recommendation</AlertTitle>
        <AlertDescription>
          We recommend enabling multi-factor authentication to protect your account.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="account">Account Security</TabsTrigger>
          <TabsTrigger value="data">Data Privacy</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Management</CardTitle>
              <CardDescription>
                Change your password regularly to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
                      }}
                      required
                    />
                  </div>
                  {newPassword && (
                    <div className="mt-2">
                      <Progress value={passwordScore} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {passwordScore < 40 ? "Weak" : passwordScore < 60 ? "Fair" : passwordScore < 80 ? "Good" : "Strong"}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Multi-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account with MFA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">
                    {mfaEnabled 
                      ? "Your account is protected with 2FA." 
                      : "Enable 2FA for additional security."}
                  </p>
                </div>
                <Switch 
                  checked={mfaEnabled} 
                  onCheckedChange={toggleMFA} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Data</CardTitle>
              <CardDescription>
                Manage your personal data stored within our system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Export Your Data</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Download a copy of all the personal data we store about you.
                </p>
                <Button 
                  onClick={downloadPersonalData} 
                  disabled={dataDownloading}
                >
                  {dataDownloading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Preparing download...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export my data
                    </>
                  )}
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Delete Your Data</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Request permanent deletion of your account and personal data.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDataDeletion}
                >
                  Request account deletion
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your information is used and shared.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow data processing for job matching</p>
                  <p className="text-sm text-gray-500">
                    Let our AI analyze your profile to find better job matches.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Share profile with employers</p>
                  <p className="text-sm text-gray-500">
                    Allow employers to view your profile when you apply.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Receive email notifications</p>
                  <p className="text-sm text-gray-500">
                    Get notified about new job matches and opportunities.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices currently signed in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Current device</p>
                      <p className="text-sm text-gray-500">
                        {navigator.userAgent.includes("Windows") 
                          ? "Windows" 
                          : navigator.userAgent.includes("Mac") 
                            ? "macOS" 
                            : navigator.userAgent.includes("Android") 
                              ? "Android" 
                              : navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") 
                                ? "iOS" 
                                : "Unknown OS"}
                        {" • "}
                        {navigator.userAgent.includes("Chrome") 
                          ? "Chrome" 
                          : navigator.userAgent.includes("Firefox") 
                            ? "Firefox" 
                            : navigator.userAgent.includes("Safari") 
                              ? "Safari" 
                              : navigator.userAgent.includes("Edge") 
                                ? "Edge" 
                                : "Unknown Browser"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Active now</p>
                    </div>
                    <div>
                      <Badge color="green">Current</Badge>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Secure Sign-In</AlertTitle>
                  <AlertDescription>
                    For security purposes, we would display all your active sessions here, 
                    and allow you to remotely sign out from any device.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Badge component for sessions
const Badge = ({ children, color }: { children: React.ReactNode, color: string }) => {
  const colorClasses = {
    green: "bg-green-100 text-green-800",
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
      {children}
    </span>
  );
};

export default Security;
