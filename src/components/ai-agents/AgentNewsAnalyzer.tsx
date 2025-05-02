
import { useState } from "react";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AIAgent, AGENT_ROLES } from "@/services/agents";
import { useToast } from "@/hooks/use-toast";

export default function AgentNewsAnalyzer() {
  const [newsContent, setNewsContent] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  const newsAgent = new AIAgent(AGENT_ROLES.NEWS_ANALYZER);

  const handleAnalyzeNews = async () => {
    if (!newsContent.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter news content to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await newsAgent.processNews(newsContent);
      setAnalysis(result);
      
      if (!result) {
        throw new Error("Failed to analyze news content");
      }
      
    } catch (error) {
      console.error("News analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the news content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supply Chain News Analyzer</CardTitle>
        <CardDescription>
          Get insights and key points from supply chain news articles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea 
            placeholder="Paste supply chain news content here..." 
            className="min-h-[150px]" 
            value={newsContent}
            onChange={(e) => setNewsContent(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleAnalyzeNews}
          disabled={isAnalyzing || !newsContent.trim()}
          className="w-full"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze News"}
        </Button>
        
        {analysis && (
          <div className="mt-4 space-y-2">
            <Separator />
            <h3 className="font-medium">Analysis Results:</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {analysis}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
