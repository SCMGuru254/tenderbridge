import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Globe, BarChart3, Clock } from "lucide-react";

interface NewsStats {
  articlesAnalyzed: number;
  positiveSentiment: number;
  negativeSentiment: number;
  neutralSentiment: number;
  lastUpdated: string;
}

const AgentNewsAnalyzer = () => {
  const [newsStats, setNewsStats] = useState<NewsStats>({
    articlesAnalyzed: 0,
    positiveSentiment: 0,
    negativeSentiment: 0,
    neutralSentiment: 0,
    lastUpdated: ''
  });

  useEffect(() => {
    // Simulate loading news analysis stats
    setNewsStats({
      articlesAnalyzed: 235,
      positiveSentiment: 68,
      negativeSentiment: 15,
      neutralSentiment: 17,
      lastUpdated: '2 hours ago'
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Supply Chain News Analysis
          <Badge variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Updated {newsStats.lastUpdated}
          </Badge>
        </CardTitle>
        <CardDescription>Insights from the latest industry news</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">{newsStats.articlesAnalyzed}</div>
            <p className="text-sm text-muted-foreground">Articles Analyzed</p>
          </div>
          <div>
            <div className="text-2xl font-bold">{newsStats.positiveSentiment}%</div>
            <p className="text-sm text-muted-foreground">Positive Sentiment</p>
          </div>
          <div>
            <div className="text-2xl font-bold">{newsStats.negativeSentiment}%</div>
            <p className="text-sm text-muted-foreground">Negative Sentiment</p>
          </div>
          <div>
            <div className="text-2xl font-bold">{newsStats.neutralSentiment}%</div>
            <p className="text-sm text-muted-foreground">Neutral Sentiment</p>
          </div>
        </div>
        
        <Button variant="secondary" className="w-full">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Detailed Analysis
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentNewsAnalyzer;
