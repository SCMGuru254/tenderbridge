
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CompanyMember } from '@/types/careers';
import { ExternalLink } from 'lucide-react';

interface CompanyTeamProps {
  members: CompanyMember[];
}

export const CompanyTeam = ({ members }: CompanyTeamProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Team Members</h3>
      {members.length === 0 ? (
        <p className="text-muted-foreground">No team members listed.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {members.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    {member.position && (
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              {(member.bio || member.linkedin_url) && (
                <CardContent>
                  {member.bio && (
                    <p className="text-muted-foreground mb-3">{member.bio}</p>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-500 hover:underline text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
