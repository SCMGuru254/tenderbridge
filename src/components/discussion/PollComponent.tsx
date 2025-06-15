
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users } from 'lucide-react';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  userVote?: string;
  expiresAt?: Date;
}

interface PollComponentProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

export const PollComponent = ({ poll, onVote }: PollComponentProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleVote = () => {
    if (selectedOption && !poll.hasVoted) {
      onVote(poll.id, selectedOption);
    }
  };

  const getPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0;
  };

  const isExpired = poll.expiresAt && new Date() > poll.expiresAt;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Poll
        </CardTitle>
        <h3 className="text-lg font-medium">{poll.question}</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {poll.totalVotes} votes
          </Badge>
          {isExpired && <Badge variant="destructive">Expired</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.options.map((option) => (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!poll.hasVoted && !isExpired && (
                  <input
                    type="radio"
                    name={`poll-${poll.id}`}
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-4 h-4"
                  />
                )}
                <label className="text-sm font-medium">{option.text}</label>
                {poll.userVote === option.id && (
                  <Badge variant="secondary" className="text-xs">Your vote</Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {getPercentage(option.votes)}%
              </span>
            </div>
            <Progress value={getPercentage(option.votes)} className="h-2" />
          </div>
        ))}
        
        {!poll.hasVoted && !isExpired && (
          <Button 
            onClick={handleVote} 
            disabled={!selectedOption}
            className="w-full"
          >
            Vote
          </Button>
        )}
        
        {poll.expiresAt && !isExpired && (
          <p className="text-xs text-muted-foreground text-center">
            Expires: {poll.expiresAt.toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
