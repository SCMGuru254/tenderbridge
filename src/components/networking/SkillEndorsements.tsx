import { useUser } from '@/hooks/useUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { useEndorsements } from '@/hooks/useNetworking';

export default function SkillEndorsements() {
  const { user } = useUser();
  const { receivedEndorsements, loadingReceived } = useEndorsements(user?.id || '');

  if (!user) return null;

  if (loadingReceived) {
    return <Skeleton className="h-48 w-full" />;
  }

  // Group endorsements by skill
  const endorsementsBySkill = (receivedEndorsements || []).reduce((acc, endorsement) => {
    const skill = endorsement?.skill;
    if (skill && skill.trim()) {
      if (!acc[skill]) acc[skill] = [];
      acc[skill].push(endorsement);
    }
    return acc;
  }, {} as Record<string, typeof receivedEndorsements>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Endorsements</CardTitle>
        <CardDescription>
          Skills endorsed by your professional network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(endorsementsBySkill).map(([skill, endorsements]) => (
            <div key={skill} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">{skill}</h4>
                </div>
                <Badge variant="secondary">
                  {endorsements.length} endorsement{endorsements.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((level) => {
                  const count = endorsements.filter(e => e.level === level).length;
                  const percentage = (count / endorsements.length) * 100;
                  
                  return (
                    <div key={level} className="space-y-1">
                      <div className="h-2 bg-secondary">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {level}★
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Top endorsers:
                  {endorsements
                    .slice(0, 3)
                    .map(e => e.profiles.full_name)
                    .join(', ')}
                </p>
              </div>
            </div>
          ))}

          {Object.keys(endorsementsBySkill).length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No endorsements yet. Start building your professional profile by adding skills.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
