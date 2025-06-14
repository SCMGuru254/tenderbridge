
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CompanyMember } from '@/types/careers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyTeamProps {
  companyId: string;
}

export const CompanyTeam: React.FC<CompanyTeamProps> = ({ companyId }) => {
  const { teamMembers, createTeamMember, loading } = useCompany(companyId);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState<Partial<CompanyMember>>({
    name: '',
    position: '',
    bio: '',
    avatar_url: '',
    linkedin_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMember.name?.trim()) {
      toast.error('Member name is required');
      return;
    }

    const result = await createTeamMember(newMember);
    if (result) {
      toast.success('Team member added successfully!');
      setShowForm(false);
      setNewMember({
        name: '',
        position: '',
        bio: '',
        avatar_url: '',
        linkedin_url: ''
      });
    } else {
      toast.error('Failed to add team member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Team Members</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={newMember.name || ''}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium mb-1">
                  Position
                </label>
                <Input
                  id="position"
                  value={newMember.position || ''}
                  onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                  placeholder="Job title/position"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  value={newMember.bio || ''}
                  onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                  placeholder="Brief bio"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium mb-1">
                  Avatar URL
                </label>
                <Input
                  id="avatar"
                  value={newMember.avatar_url || ''}
                  onChange={(e) => setNewMember({ ...newMember, avatar_url: e.target.value })}
                  placeholder="Profile picture URL"
                />
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
                  LinkedIn URL
                </label>
                <Input
                  id="linkedin"
                  value={newMember.linkedin_url || ''}
                  onChange={(e) => setNewMember({ ...newMember, linkedin_url: e.target.value })}
                  placeholder="LinkedIn profile URL"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Member'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarImage src={member.avatar_url || ''} alt={member.name} />
                <AvatarFallback>
                  {member.name.split(' ').map((name) => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              {member.position && (
                <CardDescription>{member.position}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {member.bio && (
                <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
              )}
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
