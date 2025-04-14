import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Briefcase, Search, Calendar, User } from "lucide-react";
import { Profile } from "@/types/profiles";

export default function JobSeekers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  
  // Fetch job seekers profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['job-seekers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'job_seeker')
        .not('full_name', 'is', null);
        
      if (error) throw error;
      return data as Profile[];
    }
  });
  
  // Get unique positions for filter
  const positions = profiles 
    ? [...new Set(profiles.map(profile => profile.position).filter(Boolean))]
    : [];
  
  // Filter profiles based on search and position
  const filteredProfiles = profiles?.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.position?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPosition = !filterPosition || profile.position === filterPosition;
    
    return matchesSearch && matchesPosition;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Find Job Seekers</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, position..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filterPosition} onValueChange={setFilterPosition}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All positions</SelectItem>
              {positions.map(position => (
                <SelectItem key={position} value={position}>{position}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 mt-auto">
                <div className="h-9 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredProfiles?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(profile => (
            <Card key={profile.id} className="flex flex-col h-full">
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
                    ) : (
                      <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{profile.full_name}</h3>
                    {profile.position && (
                      <p className="text-muted-foreground text-sm flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {profile.position}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex-1">
                  {profile.bio ? (
                    <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No bio provided</p>
                  )}
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.cv_url && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        CV Available
                      </Badge>
                    )}
                    {profile.linkedin_url && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        LinkedIn
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full">
                  <Link to={`/profile/${profile.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No matching profiles found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters to find more job seekers.
          </p>
        </div>
      )}
    </div>
  );
}
