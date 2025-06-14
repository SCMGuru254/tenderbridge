
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { openaiService } from "@/services/openaiService";
import { newsService, SupplyChainNews } from "@/services/newsService";
import { useToast } from "@/hooks/use-toast";

interface NewsInsight {
  id: string;
  title: string;
  summary: string;
  categories: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
  keyInsights: string[];
  originalContent: string;
}

const AgentNewsAnalyzer = () => {
  const [insights, setInsights] = useState<NewsInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const loadAndAnalyzeNews = async () => {
    setIsLoading(true);
    try {
      // Get latest news
      const news = await newsService.getNews();
      
      if (news.length === 0) {
        toast({
          title: "No news available",
          description: "Please fetch news first or try again later.",
          variant: "destructive"
        });
        return;
      }

      setIsAnalyzing(true);
      const analyzedInsights: NewsInsight[] = [];

      // Analyze first 5 news items
      for (const newsItem of news.slice(0, 5)) {
        try {
          const analysis = await openaiService.analyzeNews({
            title: newsItem.title,
            content: newsItem.content
          });

          analyzedInsights.push({
            id: newsItem.id,
            title: newsItem.title,
            summary: analysis.summary,
            categories: analysis.categories,
            sentiment: analysis.sentiment,
            relevanceScore: analysis.relevanceScore,
            keyInsights: analysis.keyInsights,
            originalContent: newsItem.content
          });
        } catch (error) {
          console.error('Error analyzing news item:', error);
          // Add fallback analysis
          analyzedInsights.push({
            id: newsItem.id,
            title: newsItem.title,
            summary: newsItem.content.substring(0, 150) + '...',
            categories: newsItem.tags || ['General'],
            sentiment: 'neutral',
            relevanceScore: 50,
            keyInsights: ['Analysis temporarily unavailable'],
            originalContent: newsItem.content
          });
        }
      }

      setInsights(analyzedInsights);
    } catch (error) {
      console.error('Error loading news:', error);
      toast({
        title: "Error",
        description: "Failed to load and analyze news. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    loadAndAnalyzeNews();
  }, []);

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
            AI News Analysis
          </CardTitle>
          <CardDescription>AI-powered insights from supply chain news</CardDescription>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={loadAndAnalyzeNews}
              disabled={isLoading || isAnalyzing}
              size="sm"
            >
              {isLoading || isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isAnalyzing ? 'Analyzing...' : 'Loading...'}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {insights.length === 0 && !isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No news analysis available. Click "Refresh Analysis" to get started.</p>
                </div>
              ) : (
                insights.map((insight) => (
                  <Card key={insight.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium line-clamp-2">{insight.title}</CardTitle>
                        <div className="flex flex-col gap-1 ml-2">
                          {insight.categories.slice(0, 2).map((category, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{insight.summary}</p>
                      
                      {insight.keyInsights && insight.keyInsights.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium mb-2">Key Insights:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {insight.keyInsights.slice(0, 2).map((insight_item, idx) => (
                              <li key={idx} className="border-l-2 border-blue-200 pl-2">
                                {insight_item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
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
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentNewsAnalyzer;
