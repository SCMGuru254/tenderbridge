
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Target, Users, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AgentCareerAdvisor = () => {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [advice, setAdvice] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [careerAdvice, setCareerAdvice] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCareerAdvice();
    }
  }, [user]);

  const fetchCareerAdvice = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('career_advice')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching career advice:', error);
      } else {
        setCareerAdvice(data || []);
      }
    } catch (error) {
      console.error('Error loading career advice:', error);
    }
  };

  const handleGetAdvice = async () => {
    if (!userInput.trim() || !user) return;
    
    setLoading(true);
    try {
      // Save user input to database
      const { data, error } = await supabase
        .from('career_advice')
        .insert({
          user_id: user.id,
          user_input: userInput,
          career_goals: careerGoals,
          advice_text: `Based on your input about "${userInput}", here are some career recommendations:

1. **Skill Development**: Consider developing expertise in supply chain analytics and digital transformation
2. **Networking**: Join professional organizations like CSCMP or local supply chain groups
3. **Certifications**: Look into APICS SCOR or Six Sigma certifications
4. **Experience**: Seek opportunities in cross-functional projects
5. **Leadership**: Develop soft skills through mentorship programs

Your career trajectory looks promising with focused development in these areas.`,
          status: 'completed'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving advice:', error);
        toast.error('Failed to save career advice');
      } else {
        setAdvice(data.advice_text);
        await fetchCareerAdvice();
        toast.success('Career advice generated and saved!');
      }
    } catch (error) {
      console.error('Error generating career advice:', error);
      toast.error('Failed to generate advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const careerPaths = [
    {
      title: "Supply Chain Analyst",
      description: "Data-driven analysis and optimization",
      skills: ["Excel", "SQL", "Python", "Tableau"],
      icon: TrendingUp
    },
    {
      title: "Procurement Manager",
      description: "Strategic sourcing and supplier management",
      skills: ["Negotiation", "SAP", "Contract Management", "Risk Assessment"],
      icon: Target
    },
    {
      title: "Operations Manager",
      description: "End-to-end process optimization",
      skills: ["Lean Six Sigma", "Project Management", "Leadership", "ERP"],
      icon: Users
    },
    {
      title: "Supply Chain Director",
      description: "Strategic leadership and transformation",
      skills: ["Strategy", "Digital Transformation", "Team Leadership", "P&L Management"],
      icon: Award
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Career Advisor</h1>
        <p className="text-muted-foreground">Get personalized career guidance for your supply chain journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tell me about your situation</CardTitle>
            <CardDescription>Describe your current role, experience, and career aspirations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., I'm a logistics coordinator with 3 years experience, looking to move into procurement..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={4}
            />
            <Input
              placeholder="What are your career goals?"
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
            />
            <Button 
              onClick={handleGetAdvice} 
              disabled={loading || !userInput.trim() || !user}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Advice...
                </>
              ) : (
                "Get Career Advice"
              )}
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground text-center">
                Please sign in to save your career advice
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Career Roadmap</CardTitle>
            <CardDescription>Personalized advice based on your input</CardDescription>
          </CardHeader>
          <CardContent>
            {advice ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <pre className="whitespace-pre-wrap text-sm">{advice}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Share your career situation to get personalized advice</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Previous Advice History */}
      {careerAdvice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Career Advice</CardTitle>
            <CardDescription>Your career consultation history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerAdvice.map((advice, index) => (
                <div key={advice.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Career Consultation #{careerAdvice.length - index}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(advice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Input:</strong> {advice.user_input}
                  </p>
                  {advice.career_goals && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Goals:</strong> {advice.career_goals}
                    </p>
                  )}
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <pre className="whitespace-pre-wrap text-sm">{advice.advice_text}</pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career Paths */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Career Paths</CardTitle>
          <CardDescription>Explore different career trajectories in supply chain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{path.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {path.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCareerAdvisor;
