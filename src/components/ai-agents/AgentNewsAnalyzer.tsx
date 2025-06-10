
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp } from "lucide-react";

interface NewsInsight {
  id: string;
  title: string;
  summary: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
}

const AgentNewsAnalyzer = () => {
  const [insights] = useState<NewsInsight[]>([
    {
      id: "1",
      title: "Supply Chain Disruption Alert",
      summary: "Global shipping delays affecting East Africa trade routes",
      category: "Logistics",
      sentiment: "negative",
      relevanceScore: 92
    },
    {
      id: "2",
      title: "Digital Transformation Opportunities",
      summary: "New blockchain solutions emerging in supply chain tracking",
      category: "Technology",
      sentiment: "positive",
      relevanceScore: 85
    }
  ]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            News Analysis
          </CardTitle>
          <CardDescription>AI-powered insights from supply chain news</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{insight.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium ${getSentimentColor(insight.sentiment)}`}>
                        {insight.sentiment.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Relevance: {insight.relevanceScore}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentNewsAnalyzer;
