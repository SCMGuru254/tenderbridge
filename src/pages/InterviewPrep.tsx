
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Briefcase, Star, Building, HelpCircle, ThumbsUp, ThumbsDown, Plus, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const InterviewPrep = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // AI Assistant state
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponses, setAiResponses] = useState<{question: string, answer: string}[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Interview questions state
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    company_name: "",
    position: "",
    question: "",
    difficulty: "Medium",
    is_anonymous: false
  });

  // Interview reviews state 
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    company_name: "",
    position: "",
    review_text: "",
    difficulty: "Medium",
    interview_process: "",
    company_culture: [] as string[],
    rating: 4.0,
    is_anonymous: false
  });

  // Fetch session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  // Fetch interview questions
  const { data: interviewQuestions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['interview-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch company reviews
  const { data: companyReviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['company-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interview_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Add interview question mutation
  const addQuestionMutation = useMutation({
    mutationFn: async (questionData: typeof newQuestion) => {
      if (!session?.user) {
        navigate("/auth");
        throw new Error("You must be logged in to add a question");
      }
      
      const { data, error } = await supabase
        .from('interview_questions')
        .insert([
          {
            ...questionData,
            user_id: session.user.id
          }
        ]);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-questions'] });
      setIsAddingQuestion(false);
      setNewQuestion({
        company_name: "",
        position: "",
        question: "",
        difficulty: "Medium",
        is_anonymous: false
      });
      toast.success("Question added successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add question: ${error.message}`);
    }
  });

  // Add company review mutation
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: typeof newReview) => {
      if (!session?.user) {
        navigate("/auth");
        throw new Error("You must be logged in to add a review");
      }
      
      const { data, error } = await supabase
        .from('interview_reviews')
        .insert([
          {
            ...reviewData,
            user_id: session.user.id
          }
        ]);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-reviews'] });
      setIsAddingReview(false);
      setNewReview({
        company_name: "",
        position: "",
        review_text: "",
        difficulty: "Medium",
        interview_process: "",
        company_culture: [],
        rating: 4.0,
        is_anonymous: false
      });
      toast.success("Review added successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add review: ${error.message}`);
    }
  });

  // Vote on a question mutation
  const voteQuestionMutation = useMutation({
    mutationFn: async ({ id, voteType }: { id: string, voteType: 'upvote' | 'downvote' }) => {
      if (!session?.user) {
        navigate("/auth");
        throw new Error("You must be logged in to vote");
      }
      
      const questionToUpdate = interviewQuestions.find(q => q.id === id);
      if (!questionToUpdate) throw new Error("Question not found");
      
      const updates = voteType === 'upvote' 
        ? { upvotes: (questionToUpdate.upvotes || 0) + 1 } 
        : { downvotes: (questionToUpdate.downvotes || 0) + 1 };
      
      const { data, error } = await supabase
        .from('interview_questions')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-questions'] });
    },
    onError: (error) => {
      toast.error(`Failed to vote: ${error.message}`);
    }
  });

  // Handle AI question
  const handleAiQuestion = async () => {
    if (!aiQuestion.trim()) return;
    
    try {
      setAiLoading(true);
      
      // Call our edge function
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: { question: aiQuestion }
      });
      
      if (error) throw error;
      
      setAiResponses([
        ...aiResponses,
        {
          question: aiQuestion,
          answer: data.answer
        }
      ]);
      
      setAiQuestion("");
    } catch (error) {
      console.error("Error calling AI assistant:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Handle form submissions
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.company_name || !newQuestion.position || !newQuestion.question) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    addQuestionMutation.mutate(newQuestion);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.company_name || !newReview.position || !newReview.review_text) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    addReviewMutation.mutate(newReview);
  };

  // Handle culture trait toggling
  const toggleCultureTrait = (trait: string) => {
    setNewReview(prev => {
      const traits = [...prev.company_culture];
      const index = traits.indexOf(trait);
      
      if (index >= 0) {
        traits.splice(index, 1);
      } else {
        traits.push(trait);
      }
      
      return { ...prev, company_culture: traits };
    });
  };

  // Filter questions and reviews based on search term
  const filteredQuestions = interviewQuestions.filter(q => 
    q.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = companyReviews.filter(r => 
    r.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Interview Preparation Center</h1>
      
      <Tabs defaultValue="assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="coaches">HR Coaches</TabsTrigger>
          <TabsTrigger value="questions">Interview Questions</TabsTrigger>
          <TabsTrigger value="companies">Company Reviews</TabsTrigger>
        </TabsList>
        
        {/* AI Assistant Tab */}
        <TabsContent value="assistant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Interview AI Assistant
              </CardTitle>
              <CardDescription>
                Get personalized guidance for common interview questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Ask about a specific interview question..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiQuestion()}
                    className="flex-1"
                  />
                  <Button onClick={handleAiQuestion} disabled={aiLoading}>
                    {aiLoading ? (
                      <>Getting Answer...</>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Get Guidance
                      </>
                    )}
                  </Button>
                </div>
                
                {/* AI Conversation History */}
                <div className="space-y-4 mt-6">
                  {aiResponses.map((response, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="bg-muted p-3 rounded-lg font-medium">
                        {response.question}
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg whitespace-pre-line">
                        {response.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Common Questions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Common Supply Chain Interview Questions</CardTitle>
              <CardDescription>
                Click on any question to get AI guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Describe a time when you improved a supply chain process",
                  "How do you handle supply chain disruptions?",
                  "Explain your experience with inventory management",
                  "What supply chain software are you familiar with?",
                  "How do you prioritize tasks when facing tight deadlines?",
                  "Describe your experience with vendor negotiations"
                ].map((q, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="justify-start text-left h-auto py-3"
                    onClick={() => {
                      setAiQuestion(q);
                      handleAiQuestion();
                    }}
                  >
                    <HelpCircle className="mr-2 h-4 w-4 shrink-0" />
                    <span>{q}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* HR Coaches Tab */}
        <TabsContent value="coaches">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                HR Coaches & CV Experts
              </CardTitle>
              <CardDescription>
                Connect with professionals who can help you prepare for interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Coach Cards */}
                {[
                  {
                    name: "Jane Smith",
                    title: "Senior HR Consultant",
                    specialization: "Supply Chain Recruitment",
                    rating: 4.9,
                    reviews: 42,
                    image: "/placeholder.svg"
                  },
                  {
                    name: "Michael Johnson",
                    title: "Career Coach",
                    specialization: "Logistics Interview Preparation",
                    rating: 4.7,
                    reviews: 38,
                    image: "/placeholder.svg"
                  },
                  {
                    name: "Sarah Williams",
                    title: "CV Specialist",
                    specialization: "Procurement & Supply Chain",
                    rating: 4.8,
                    reviews: 56,
                    image: "/placeholder.svg"
                  }
                ].map((coach, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="p-0">
                      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
                        <Avatar className="h-24 w-24 border-4 border-white">
                          <AvatarImage src={coach.image} alt={coach.name} />
                          <AvatarFallback>{coach.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-lg">{coach.name}</h3>
                      <p className="text-muted-foreground">{coach.title}</p>
                      <Badge variant="outline" className="mt-2">
                        {coach.specialization}
                      </Badge>
                      <div className="flex items-center mt-3 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{coach.rating}</span>
                        <span className="text-muted-foreground ml-1">({coach.reviews} reviews)</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Contact Coach</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button variant="outline">
                  View All Coaches
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interview Questions Tab */}
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Community Interview Questions
              </CardTitle>
              <CardDescription>
                Real questions shared by users from actual interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <Input 
                      placeholder="Search for questions by keyword or company..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button 
                        variant="ghost" 
                        className="absolute right-0 top-0 h-full" 
                        onClick={() => setSearchTerm("")}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <Button onClick={() => {
                    if (session) {
                      setIsAddingQuestion(true);
                    } else {
                      toast.error("Please sign in to add your experience");
                      navigate("/auth");
                    }
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your Experience
                  </Button>
                </div>
                
                {/* Question Form */}
                {isAddingQuestion && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="text-lg">Share an Interview Question</CardTitle>
                      <CardDescription>
                        Help others prepare by sharing questions you were asked
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form onSubmit={handleAddQuestion} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">Company Name <span className="text-red-500">*</span></Label>
                            <Input 
                              id="company" 
                              placeholder="Company name" 
                              value={newQuestion.company_name}
                              onChange={(e) => setNewQuestion({...newQuestion, company_name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position">Position <span className="text-red-500">*</span></Label>
                            <Input 
                              id="position" 
                              placeholder="Job title/position" 
                              value={newQuestion.position}
                              onChange={(e) => setNewQuestion({...newQuestion, position: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select 
                            value={newQuestion.difficulty} 
                            onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                              <SelectItem value="Very Hard">Very Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="question">Interview Question <span className="text-red-500">*</span></Label>
                          <Textarea 
                            id="question" 
                            placeholder="What question were you asked?" 
                            className="min-h-[100px]" 
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="anonymous" 
                            checked={newQuestion.is_anonymous}
                            onCheckedChange={(checked) => setNewQuestion({...newQuestion, is_anonymous: checked})}
                          />
                          <Label htmlFor="anonymous">Submit anonymously</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddingQuestion(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            Submit Question
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
                
                {/* Question List */}
                {questionsLoading ? (
                  <div className="text-center py-8">Loading questions...</div>
                ) : filteredQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    {searchTerm ? "No questions match your search" : "No questions yet. Be the first to share!"}
                  </div>
                ) : (
                  filteredQuestions.map((q) => (
                    <Card key={q.id} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{q.company_name}</CardTitle>
                            <CardDescription>{q.position}</CardDescription>
                          </div>
                          <Badge>{q.difficulty}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm md:text-base">{q.question}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-2">
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span>{new Date(q.created_at).toLocaleDateString()}</span>
                          {!q.is_anonymous && <span>By: {q.user_id}</span>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => voteQuestionMutation.mutate({ id: q.id, voteType: 'upvote' })}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">{q.upvotes || 0}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => voteQuestionMutation.mutate({ id: q.id, voteType: 'downvote' })}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Company Reviews Tab */}
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Company Interview Reviews
              </CardTitle>
              <CardDescription>
                Learn about interview processes and company culture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <Input 
                      placeholder="Search for companies..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button 
                        variant="ghost" 
                        className="absolute right-0 top-0 h-full" 
                        onClick={() => setSearchTerm("")}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <Button onClick={() => {
                    if (session) {
                      setIsAddingReview(true);
                    } else {
                      toast.error("Please sign in to add a company review");
                      navigate("/auth");
                    }
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Company Review
                  </Button>
                </div>
                
                {/* Review Form */}
                {isAddingReview && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="text-lg">Share Your Interview Experience</CardTitle>
                      <CardDescription>
                        Help others prepare by sharing your interview experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form onSubmit={handleAddReview} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="review-company">Company Name <span className="text-red-500">*</span></Label>
                            <Input 
                              id="review-company" 
                              placeholder="Company name" 
                              value={newReview.company_name}
                              onChange={(e) => setNewReview({...newReview, company_name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="review-position">Position <span className="text-red-500">*</span></Label>
                            <Input 
                              id="review-position" 
                              placeholder="Job title/position" 
                              value={newReview.position}
                              onChange={(e) => setNewReview({...newReview, position: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="review-difficulty">Interview Difficulty</Label>
                            <Select 
                              value={newReview.difficulty} 
                              onValueChange={(value) => setNewReview({...newReview, difficulty: value})}
                            >
                              <SelectTrigger id="review-difficulty">
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                                <SelectItem value="Very Hard">Very Hard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="review-rating">Overall Rating (1-5)</Label>
                            <Select 
                              value={String(newReview.rating)} 
                              onValueChange={(value) => setNewReview({...newReview, rating: parseFloat(value)})}
                            >
                              <SelectTrigger id="review-rating">
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Poor</SelectItem>
                                <SelectItem value="2">2 - Below Average</SelectItem>
                                <SelectItem value="3">3 - Average</SelectItem>
                                <SelectItem value="4">4 - Good</SelectItem>
                                <SelectItem value="5">5 - Excellent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="review-process">Interview Process</Label>
                          <Textarea 
                            id="review-process" 
                            placeholder="Describe the interview process (e.g., number of rounds, types of interviews)" 
                            value={newReview.interview_process}
                            onChange={(e) => setNewReview({...newReview, interview_process: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company Culture (select all that apply)</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {["Fast-paced", "Collaborative", "Structured", "Competitive", "Results-oriented", 
                              "Supportive", "Work-life balance", "Learning-focused", "Innovative", "High-pressure"].map((trait) => (
                              <Badge 
                                key={trait}
                                variant={newReview.company_culture.includes(trait) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => toggleCultureTrait(trait)}
                              >
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="review-text">Interview Experience <span className="text-red-500">*</span></Label>
                          <Textarea 
                            id="review-text" 
                            placeholder="Share your overall experience - what went well, what was challenging, any advice for others" 
                            className="min-h-[150px]" 
                            value={newReview.review_text}
                            onChange={(e) => setNewReview({...newReview, review_text: e.target.value})}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="review-anonymous" 
                            checked={newReview.is_anonymous}
                            onCheckedChange={(checked) => setNewReview({...newReview, is_anonymous: checked})}
                          />
                          <Label htmlFor="review-anonymous">Submit anonymously</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddingReview(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            Submit Review
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
                
                {/* Company Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {reviewsLoading ? (
                    <div className="text-center py-8 col-span-2">Loading reviews...</div>
                  ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-8 col-span-2">
                      {searchTerm ? "No company reviews match your search" : "No company reviews yet. Be the first to share!"}
                    </div>
                  ) : (
                    filteredReviews.map((review) => (
                      <Card key={review.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{review.company_name}</CardTitle>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{review.rating}</span>
                            </div>
                          </div>
                          <CardDescription>
                            {review.position} • {new Date(review.created_at).toLocaleDateString()}
                            {!review.is_anonymous && ` • By User`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-2">
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Interview Difficulty: 
                              <span className={`ml-2 ${
                                review.difficulty === "Very Hard" ? "text-red-500" : 
                                review.difficulty === "Hard" ? "text-orange-500" :
                                review.difficulty === "Medium" ? "text-yellow-600" :
                                "text-green-500"
                              }`}>
                                {review.difficulty}
                              </span>
                            </p>
                            <p className="text-sm">{review.review_text}</p>
                          </div>
                          {review.interview_process && (
                            <div>
                              <p className="text-sm font-medium mb-1">Interview Process:</p>
                              <p className="text-sm">{review.interview_process}</p>
                            </div>
                          )}
                          {review.company_culture && review.company_culture.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">Company Culture:</p>
                              <div className="flex flex-wrap gap-2">
                                {review.company_culture.map((trait, i) => (
                                  <Badge key={i} variant="outline">{trait}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            Read Full Review
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewPrep;
