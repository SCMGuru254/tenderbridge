
import React from 'react';
import { useEngagement } from '@/hooks/useEngagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

export const ReputationPanel = () => {
  const { reputation, loading } = useEngagement();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Reputation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = Object.entries(reputation);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Reputation
        </CardTitle>
        <CardDescription>
          Your standing in different areas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No reputation data yet. Start engaging to build your reputation!
          </p>
        ) : (
          categories.map(([category, data]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{data.name}</span>
                <Badge variant="outline">{data.score} pts</Badge>
              </div>
              <Progress value={Math.min((data.score / 1000) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
