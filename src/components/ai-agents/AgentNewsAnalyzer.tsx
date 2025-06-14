
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewsAnalysis {
  summary: string;
  keyTrends: string[];
  impact: string;
}

export const AgentNewsAnalyzer: React.FC = () => {
  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    analyzeNews();
  }, []);

  const analyzeNews = async () => {
    setIsLoading(true);
    try {
      // Mock analysis
      setTimeout(() => {
        setAnalysis({
          summary: 'Current supply chain trends show increased focus on digital transformation and sustainability in Kenya.',
          keyTrends: [
            'Digital transformation in logistics',
            'Sustainable supply chain practices',
            'E-commerce growth impact',
            'Regional trade integration'
          ],
          impact: 'These trends are creating new job opportunities in supply chain analytics and green logistics.'
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing news:', error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Supply Chain News Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <p>Analyzing latest supply chain news...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-gray-700">{analysis.summary}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Key Trends</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.keyTrends.map((trend, index) => (
                  <li key={index} className="text-sm text-gray-700">{trend}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Career Impact</h4>
              <p className="text-sm text-gray-700">{analysis.impact}</p>
            </div>
          </div>
        ) : (
          <p>No analysis available</p>
        )}
      </CardContent>
    </Card>
  );
};
