
import { useEffect, useState } from "react";
import { Check, Download, Vote } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { fetchCareerApplications, getUserVotes, voteForApplication, isDueDate, getDueDate } from "@/services/careersService";
import { CareerApplication } from "@/types/careers";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export function CareerApplicationsList() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<string[]>([]);
  const [votingUser, setVotingUser] = useState<{ id: string; email: string } | null>(null);
  const [pastDueDate, setPastDueDate] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check if past due date
        const dueDatePassed = await isDueDate();
        setPastDueDate(dueDatePassed);
        
        // Get the due date for display
        const dueDateValue = await getDueDate();
        setDueDate(dueDateValue);
        
        // Get applications
        const apps = await fetchCareerApplications();
        setApplications(apps);
        
        // Check user auth status
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setVotingUser({ id: user.id, email: user.email || "" });
          
          // Get user votes if authenticated
          const votes = await getUserVotes(user.id);
          setUserVotes(votes);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleVote = async (applicationId: string) => {
    if (!votingUser) {
      toast.error("Please sign in to vote");
      return;
    }
    
    try {
      await voteForApplication(applicationId, votingUser.id);
      
      // Update local state
      setUserVotes([...userVotes, applicationId]);
      setApplications(applications.map(app => 
        app.id === applicationId 
          ? { ...app, votes_count: app.votes_count + 1 } 
          : app
      ));
      
      toast.success("Vote recorded successfully!");
    } catch (error: any) {
      if (error.message === "You have already voted for this application") {
        toast.error(error.message);
      } else {
        toast.error("Failed to record your vote");
        console.error("Error voting:", error);
      }
    }
  };
  
  const handleDownload = (application: CareerApplication) => {
    // Create a text file with the proposal
    const element = document.createElement("a");
    const file = new Blob([`
Name: ${application.applicant_name}
Email: ${application.applicant_email}
Submitted: ${format(new Date(application.submitted_at), "PPP")}
Votes: ${application.votes_count}

VISION PROPOSAL:
${application.proposal_text}
    `], { type: "text/plain" });
    
    element.href = URL.createObjectURL(file);
    element.download = `vision_proposal_${application.applicant_name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  if (applications.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No vision proposals have been submitted yet.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8 mt-6">
      {dueDate && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-amber-800">
            {pastDueDate 
              ? "The submission deadline has passed. Proposals can now be downloaded."
              : `Submission deadline: ${format(new Date(dueDate), "PPP")}`
            }
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Community Voting</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 border-purple-300 text-purple-800">
            Total Submissions: {applications.length}
          </Badge>
          <Badge variant="outline" className="bg-green-50 border-green-300 text-green-800">
            Total Votes: {applications.reduce((sum, app) => sum + app.votes_count, 0)}
          </Badge>
        </div>
      </div>
      
      {!votingUser && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <p className="text-slate-800">
            <Link to="/auth" className="text-purple-600 hover:underline font-medium">Sign in</Link> to vote for your favorite vision proposals.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {applications.map((application, index) => (
          <Card key={application.id} className={index === 0 && application.votes_count > 0 ? "border-2 border-yellow-400" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {application.applicant_name}
                    {index === 0 && application.votes_count > 0 && (
                      <Badge className="bg-yellow-400 text-yellow-900">Leading</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Submitted {format(new Date(application.submitted_at), "PP")}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Vote className="h-3 w-3" /> {application.votes_count} votes
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="whitespace-pre-line bg-slate-50 p-4 rounded-lg text-sm">
                {application.proposal_text}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-end">
                {pastDueDate && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex gap-1"
                    onClick={() => handleDownload(application)}
                  >
                    <Download className="h-4 w-4" /> Download Proposal
                  </Button>
                )}
                
                <Button
                  variant={userVotes.includes(application.id) ? "secondary" : "default"}
                  size="sm"
                  disabled={!votingUser || userVotes.includes(application.id)}
                  onClick={() => handleVote(application.id)}
                  className={
                    userVotes.includes(application.id) 
                      ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" 
                      : "bg-purple-700 hover:bg-purple-800"
                  }
                >
                  {userVotes.includes(application.id) ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Voted
                    </>
                  ) : (
                    <>
                      <Vote className="h-4 w-4 mr-1" /> Vote
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
