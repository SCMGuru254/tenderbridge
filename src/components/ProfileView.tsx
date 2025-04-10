
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Download, Linkedin, Mail, FileText, Eye, MessageCircle, Calendar as CalendarIcon2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile, ProfileView as ProfileViewType, HiringDecision } from "@/types/profiles";

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [message, setMessage] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  
  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        return data as Profile;
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
    }
  });
  
  // Fetch profile views
  const { data: profileViews } = useQuery<ProfileViewType[]>({
    queryKey: ['profile-views', id],
    enabled: !!id && isCurrentUser,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profile_views')
          .select(`
            id,
            profile_id,
            viewer_id,
            viewed_at,
            viewer:profiles(full_name, company, avatar_url)
          `)
          .eq('profile_id', id)
          .order('viewed_at', { ascending: false });
          
        if (error) throw error;
        return data as ProfileViewType[];
      } catch (error) {
        console.error("Error fetching profile views:", error);
        throw error;
      }
    }
  });
  
  // Fetch hiring decisions
  const { data: decisions } = useQuery<HiringDecision[]>({
    queryKey: ['hiring-decisions', id],
    enabled: !!id && isCurrentUser,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('hiring_decisions')
          .select(`
            id,
            employer_id,
            candidate_id,
            decision_date,
            notes,
            created_at,
            employer:profiles(full_name, company, avatar_url)
          `)
          .eq('candidate_id', id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data as HiringDecision[];
      } catch (error) {
        console.error("Error fetching hiring decisions:", error);
        throw error;
      }
    }
  });
  
  // Record profile view
  useEffect(() => {
    const trackProfileView = async () => {
      try {
        if (!id || isCurrentUser) return;
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Don't record duplicate views in the same session
        const viewKey = `profile_view_${id}`;
        const lastView = sessionStorage.getItem(viewKey);
        
        if (lastView) {
          const timeDiff = Date.now() - Number(lastView);
          // If viewed in the last hour, don't record a new view
          if (timeDiff < 3600000) return;
        }
        
        // Record the view
        const { error } = await supabase
          .from('profile_views')
          .insert({
            profile_id: id,
            viewer_id: user.id
          });
          
        if (error) {
          console.error("Error recording profile view:", error);
          return;
        }
        
        // Update session storage
        sessionStorage.setItem(viewKey, Date.now().toString());
        
      } catch (err) {
        console.error("Error recording profile view:", err);
      }
    };
    
    trackProfileView();
  }, [id, isCurrentUser]);
  
  // Check if current user is viewing their own profile
  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && id === user.id) {
        setIsCurrentUser(true);
      }
    };
    
    checkCurrentUser();
  }, [id]);
  
  const handleContact = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to contact this user",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: id,
          subject: "Job Opportunity",
          content: message
        });
        
      if (error) throw error;
      
      toast({
        title: "Message sent",
        description: "Your message has been sent to the candidate"
      });
      
      setContactOpen(false);
      setMessage("");
      
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };
  
  const handleDecision = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to record a decision",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      if (!date) {
        toast({
          title: "Date required",
          description: "Please select a decision date",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('hiring_decisions')
        .insert({
          employer_id: user.id,
          candidate_id: id,
          decision_date: format(date, 'yyyy-MM-dd'),
          notes: message
        });
        
      if (error) throw error;
      
      toast({
        title: "Decision recorded",
        description: "The candidate will be notified about your decision date"
      });
      
      setDecisionOpen(false);
      setMessage("");
      setDate(undefined);
      
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to record decision",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load profile information. The profile may not exist or you may not have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
                ) : (
                  <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                {profile.position && (
                  <CardDescription className="text-lg mt-1">
                    {profile.position}
                    {profile.company && ` at ${profile.company}`}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {profile.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              {profile.linkedin_url && (
                <a 
                  href={profile.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              
              {profile.cv_url && (
                <a 
                  href={profile.cv_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <FileText size={16} />
                  <span>View CV</span>
                </a>
              )}
            </div>
          </CardContent>
          
          {!isCurrentUser && (
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Mail className="mr-2 h-4 w-4" /> Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact {profile.full_name}</DialogTitle>
                    <DialogDescription>
                      Send a message to this candidate about job opportunities.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="message">Your message</Label>
                      <Textarea
                        id="message"
                        placeholder="Write about the job opportunity..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setContactOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleContact} disabled={!message.trim()}>
                      Send Message
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={decisionOpen} onOpenChange={setDecisionOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <CalendarIcon2 className="mr-2 h-4 w-4" /> Set Decision Date
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Decision Date</DialogTitle>
                    <DialogDescription>
                      Let the candidate know when to expect your hiring decision.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Decision Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any notes about the decision process..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDecisionOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleDecision} disabled={!date}>
                      Set Decision Date
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {profile.cv_url && (
                <a 
                  href={profile.cv_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="secondary" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download CV
                  </Button>
                </a>
              )}
            </CardFooter>
          )}
        </Card>
        
        {/* Profile Stats & Activity */}
        {isCurrentUser && (
          <div className="space-y-6">
            {/* Profile Views */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye size={18} /> Profile Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileViews && profileViews.length > 0 ? (
                  <div className="space-y-4">
                    {profileViews.slice(0, 5).map((view) => (
                      <div key={view.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {view.viewer.avatar_url ? (
                            <AvatarImage src={view.viewer.avatar_url} alt={view.viewer.full_name || ''} />
                          ) : (
                            <AvatarFallback>{view.viewer.full_name?.charAt(0) || '?'}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {view.viewer.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {view.viewer.company}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(view.viewed_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No profile views yet. Complete your profile to attract more views.
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Decision Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={18} /> Decision Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {decisions && decisions.length > 0 ? (
                  <div className="space-y-4">
                    {decisions.map((decision) => (
                      <div key={decision.id} className="border rounded-lg p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            {decision.employer.avatar_url ? (
                              <AvatarImage src={decision.employer.avatar_url} alt={decision.employer.full_name || ''} />
                            ) : (
                              <AvatarFallback>{decision.employer.full_name?.charAt(0) || '?'}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{decision.employer.full_name}</p>
                            <p className="text-xs text-muted-foreground">{decision.employer.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm mb-2">
                          <CalendarIcon2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Decision by: <span className="font-medium">{new Date(decision.decision_date).toLocaleDateString()}</span></span>
                        </div>
                        {decision.notes && (
                          <p className="text-sm text-muted-foreground">{decision.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No decision dates yet. Employers will set decision dates after reviewing your profile.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
