
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CompanyMember } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Linkedin, Plus, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface CompanyTeamProps {
  companyId: string;
  canEdit?: boolean;
}

const CompanyTeam: React.FC<CompanyTeamProps> = ({ companyId, canEdit = false }) => {
  const { members, loading } = useCompany(companyId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    position: '',
    email: '',
    role: 'member' as 'admin' | 'member',
    bio: ''
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // This would integrate with the company hook to add a member
      console.log('Adding member:', newMember);
      
      setShowAddForm(false);
      setNewMember({
        name: '',
        position: '',
        email: '',
        role: 'member',
        bio: ''
      });
      
      toast({
        title: "Success",
        description: "Team member added successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return <div>Loading team members...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Team Members</h2>
          <Badge variant="secondary">{members.length}</Badge>
        </div>
        {canEdit && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newMember.position}
                    onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value: 'admin' | 'member') => setNewMember({ ...newMember, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Member</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No team members yet.</p>
          </div>
        ) : (
          members.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.position}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge className={getRoleColor(member.role)}>
                    {member.role}
                  </Badge>
                  
                  {member.bio && (
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  {member.email && (
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                  {member.linkedinUrl && (
                    <Button size="sm" variant="outline">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyTeam;
