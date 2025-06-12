import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Clock, User, BookOpen, Video, FileText, MessageSquare, Target, TrendingUp } from "lucide-react";

const InterviewPrep = () => {
  const [selectedCategory, setSelectedCategory] = useState("behavioral");
  const [searchTerm, setSearchTerm] = useState("");

  const mockQuestions = [
    {
      id: 1,
      category: "behavioral",
      question: "Tell me about a time when you had to manage a difficult supplier relationship",
      difficulty: "Medium",
      tags: ["supplier management", "communication", "problem solving"]
    },
    {
      id: 2,
      category: "technical",
      question: "How would you optimize inventory levels for a seasonal product?",
      difficulty: "Hard",
      tags: ["inventory management", "forecasting", "optimization"]
    },
    {
      id: 3,
      category: "situational",
      question: "Your main supplier just informed you of a 2-week delay. What's your action plan?",
      difficulty: "Medium",
      tags: ["crisis management", "contingency planning", "supplier relations"]
    }
  ];

  const categories = [
    { id: "behavioral", name: "Behavioral", count: 25 },
    { id: "technical", name: "Technical", count: 18 },
    { id: "situational", name: "Situational", count: 22 },
    { id: "leadership", name: "Leadership", count: 15 }
  ];

  const filteredQuestions = mockQuestions.filter(q => 
    q.category === selectedCategory && 
    (searchTerm === "" || q.question.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interview Preparation</h1>
        <p className="text-muted-foreground">
          Practice with supply chain specific interview questions and scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{category.name}</h3>
                <Badge variant="secondary">{category.count}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Practice Questions</CardTitle>
              <CardDescription>
                Answer these questions to improve your interview skills
              </CardDescription>
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          variant={
                            question.difficulty === "Easy" ? "secondary" :
                            question.difficulty === "Medium" ? "default" : "destructive"
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="font-medium mb-3">{question.question}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {question.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Practice</Button>
                        <Button size="sm" variant="outline">View Tips</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Questions Answered</span>
                    <span>45/100</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Study Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Video Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Study Guides
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Mock Interviews
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
