
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const AgentCareerAdvisor: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getCareerAdvice = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      // Mock AI response
      setTimeout(() => {
        setAdvice('Based on your question, I recommend focusing on supply chain analytics and digital transformation skills. These are high-demand areas in Kenya\'s growing logistics sector.');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error getting career advice:', error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AI Career Advisor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Ask about your career path:
          </label>
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What skills should I develop for supply chain management?"
            rows={3}
          />
        </div>
        
        <Button 
          onClick={getCareerAdvice}
          disabled={isLoading || !question.trim()}
          className="w-full"
        >
          {isLoading ? 'Getting Advice...' : 'Get Career Advice'}
        </Button>

        {advice && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Career Advice:</h4>
            <p className="text-sm text-gray-700">{advice}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
