
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AIRecommendation {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  reasons: string[];
  skillsMatch: string[];
  salaryRange?: string;
  location: string;
}

export const AIJobRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState({
    profileCompleteness: 75,
    skillsGap: ['Logistics Management', 'Supply Chain Analytics'],
    careerProgression: 'Senior Supply Chain Analyst',
    marketTrends: ['Green Logistics', 'Digital Supply Chain']
  });

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      // Simulate AI recommendation generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          title: 'Senior Supply Chain Manager',
          company: 'Kenya Airways',
          matchScore: 92,
          reasons: ['Strong logistics background', 'Management experience', 'Industry expertise'],
          skillsMatch: ['Supply Chain Management', 'Process Optimization', 'Team Leadership'],
          salaryRange: 'KES 800,000 - 1,200,000',
          location: 'Nairobi, Kenya'
        },
        {
          id: '2',
          title: 'Procurement Specialist',
          company: 'Safaricom',
          matchScore: 88,
          reasons: ['Technical skills match', 'Industry knowledge', 'Career progression'],
          skillsMatch: ['Procurement', 'Vendor Management', 'Cost Analysis'],
          salaryRange: 'KES 600,000 - 900,000',
          location: 'Nairobi, Kenya'
        },
        {
          id: '3',
          title: 'Logistics Coordinator',
          company: 'DHL Express',
          matchScore: 85,
          reasons: ['International exposure', 'Growth potential', 'Skills development'],
          skillsMatch: ['Logistics', 'International Trade', 'Coordination'],
          salaryRange: 'KES 500,000 - 750,000',
          location: 'Mombasa, Kenya'
        }
      ];
      
      setRecommendations(mockRecommendations);
      toast.success('AI recommendations generated successfully!');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      generateRecommendations();
    }
  }, [user]);

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Job Recommendations
            <Badge variant="secondary" className="ml-2">
              <Brain className="h-3 w-3 mr-1" />
              Smart Match
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            {/* AI Insights Panel */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Career Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span>Profile Completeness</span>
                      <span className="font-semibold">{aiInsights.profileCompleteness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${aiInsights.profileCompleteness}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Recommended Next Role:</span>
                    <div className="text-blue-600 font-semibold">{aiInsights.careerProgression}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-medium text-sm">Trending Skills:</span>
                  <div className="flex gap-1 mt-1">
                    {aiInsights.marketTrends.map(trend => (
                      <Badge key={trend} variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Recommendations */}
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{rec.title}</h3>
                          <p className="text-muted-foreground">{rec.company} • {rec.location}</p>
                          {rec.salaryRange && (
                            <p className="text-sm font-medium text-green-600">{rec.salaryRange}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold ${getMatchColor(rec.matchScore)}`}>
                            <Target className="h-3 w-3 mr-1" />
                            {rec.matchScore}% Match
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium">Why this matches:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.reasons.map(reason => (
                              <Badge key={reason} variant="secondary" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium">Skills match:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.skillsMatch.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Save for Later</Button>
                        <Button variant="ghost" size="sm">Not Interested</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your profile to get AI-powered job recommendations
                </p>
                <Button onClick={generateRecommendations} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Recommendations'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
