import { useUser } from '@/hooks/useUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useConnectionSuggestions, useConnections } from '@/hooks/useNetworking';
import { Users } from 'lucide-react';

export default function ConnectionSuggestions() {
  const { user } = useUser();
  const { suggestions, isLoading } = useConnectionSuggestions(user?.id || '');
  const { sendConnectionRequest } = useConnections(user?.id || '');

  if (!user) return null;

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>People You May Know</CardTitle>
        <CardDescription>
          Professionals in your industry you might want to connect with
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.suggested_user_id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {suggestion.full_name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                  <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${suggestion.suggested_user_id}`} />
                </Avatar>
                <div>
                  <h4 className="font-medium">{suggestion.full_name}</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.position}</p>
                  <p className="text-sm text-muted-foreground">{suggestion.company}</p>
                  
                  {(suggestion.common_connections > 0 || suggestion.common_skills > 0) && (
                    <div className="flex items-center gap-4 mt-1">
                      {suggestion.common_connections > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {suggestion.common_connections} mutual connection
                          {suggestion.common_connections !== 1 ? 's' : ''}
                        </div>
                      )}
                      {suggestion.common_skills > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {suggestion.common_skills} shared skill
                          {suggestion.common_skills !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => sendConnectionRequest(suggestion.suggested_user_id)}
              >
                Connect
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
