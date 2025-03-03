
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Briefcase, Star, Building, HelpCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const InterviewPrep = () => {
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponses, setAiResponses] = useState<{question: string, answer: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAiQuestion = async () => {
    if (!aiQuestion.trim()) return;
    
    setLoading(true);
    
    // In a real implementation, this would call an API to get AI responses
    // For now, we'll simulate a response
    setTimeout(() => {
      setAiResponses([
        ...aiResponses,
        {
          question: aiQuestion,
          answer: `Here's how you might approach "${aiQuestion}": 
          
          1. Start by briefly introducing your background relevant to this question.
          2. Use the STAR method (Situation, Task, Action, Result) to structure your answer.
          3. Be specific about your contributions and quantify results if possible.
          4. Keep your answer concise but detailed enough to demonstrate your skills.
          
          Practice this answer out loud a few times to make it sound natural!`
        }
      ]);
      setAiQuestion("");
      setLoading(false);
    }, 1500);
  };

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
                  <Button onClick={handleAiQuestion} disabled={loading}>
                    {loading ? (
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
                  <div className="flex-1">
                    <Input placeholder="Search for questions by keyword or company..." />
                  </div>
                  <Button>
                    Add Your Experience
                  </Button>
                </div>
                
                {/* Sample Interview Questions */}
                {[
                  {
                    company: "Logistics Corp Kenya",
                    position: "Supply Chain Manager",
                    difficulty: "Medium",
                    question: "Describe how you would handle a situation where a critical supplier fails to deliver on time for a major client.",
                    upvotes: 24,
                    date: "2 weeks ago"
                  },
                  {
                    company: "Global Freight Ltd",
                    position: "Procurement Officer",
                    difficulty: "Hard",
                    question: "How would you approach negotiating with a supplier who has suddenly increased prices by 15% due to 'market conditions'?",
                    upvotes: 18,
                    date: "1 month ago"
                  },
                  {
                    company: "East Africa Distributors",
                    position: "Inventory Specialist",
                    difficulty: "Easy",
                    question: "Which inventory management methods have you used and which do you find most effective for perishable goods?",
                    upvotes: 31,
                    date: "3 weeks ago"
                  }
                ].map((q, idx) => (
                  <Card key={idx} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{q.company}</CardTitle>
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
                        <span>{q.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{q.upvotes}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
                
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Share Your Interview Experience</CardTitle>
                      <CardDescription>
                        Help others prepare by sharing questions you were asked
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company Name</label>
                          <Input placeholder="Company name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Position</label>
                          <Input placeholder="Job title/position" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Interview Question</label>
                        <Textarea placeholder="What question were you asked?" className="min-h-[100px]" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Submit Question</Button>
                    </CardFooter>
                  </Card>
                </div>
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
                  <div className="flex-1">
                    <Input placeholder="Search for companies..." />
                  </div>
                  <Button>
                    Add Company Review
                  </Button>
                </div>
                
                {/* Company Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    {
                      name: "Logistics Corp Kenya",
                      reviews: 12,
                      rating: 4.2,
                      process: "3 interviews",
                      difficulty: "Medium",
                      culture: ["Fast-paced", "Collaborative", "Structured"],
                      comment: "The interview process was thorough but fair. Started with a phone screening, followed by a technical assessment and final interview with the department head."
                    },
                    {
                      name: "Global Freight Ltd",
                      reviews: 8,
                      rating: 3.8,
                      process: "2 interviews",
                      difficulty: "Hard",
                      culture: ["Competitive", "Results-oriented", "Long hours"],
                      comment: "Challenging technical questions and case studies. They value analytical thinking and problem-solving. Be prepared to discuss past supply chain optimizations in detail."
                    },
                    {
                      name: "East Africa Distributors",
                      reviews: 15,
                      rating: 4.5,
                      process: "2-3 interviews",
                      difficulty: "Medium",
                      culture: ["Supportive", "Work-life balance", "Learning-focused"],
                      comment: "Very pleasant experience. They focus on cultural fit as much as technical skills. The team was welcoming and transparent about expectations."
                    },
                    {
                      name: "Nairobi Supply Solutions",
                      reviews: 7,
                      rating: 3.5,
                      process: "4 interviews",
                      difficulty: "Very Hard",
                      culture: ["Innovative", "High-pressure", "Goal-driven"],
                      comment: "Lengthy process with multiple stakeholders. Technical assessment was particularly challenging. They value experience with digital supply chain tools."
                    }
                  ].map((company, idx) => (
                    <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{company.rating}</span>
                          </div>
                        </div>
                        <CardDescription>{company.reviews} interview reviews • {company.process}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pb-2">
                        <div>
                          <p className="text-sm font-medium mb-2">Interview Difficulty: 
                            <span className={`ml-2 ${
                              company.difficulty === "Very Hard" ? "text-red-500" : 
                              company.difficulty === "Hard" ? "text-orange-500" :
                              company.difficulty === "Medium" ? "text-yellow-600" :
                              "text-green-500"
                            }`}>
                              {company.difficulty}
                            </span>
                          </p>
                          <p className="text-sm">{company.comment}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Company Culture:</p>
                          <div className="flex flex-wrap gap-2">
                            {company.culture.map((trait, i) => (
                              <Badge key={i} variant="outline">{trait}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          Read Full Reviews
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
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
