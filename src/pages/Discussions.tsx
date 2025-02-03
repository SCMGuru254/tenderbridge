import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare } from "lucide-react";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
}

type Discussion = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles: Profile;
}

const Discussions = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: discussions, isLoading } = useQuery({
    queryKey: ['discussions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Discussion[];
    }
  });

  const filteredDiscussions = discussions?.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Supply Chain Discussions</h1>
        <Button className="bg-primary hover:bg-primary/90">
          Start Discussion
        </Button>
      </div>

      <Input
        placeholder="Search discussions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8"
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : filteredDiscussions?.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No discussions found
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredDiscussions?.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{discussion.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>Started by {discussion.profiles?.full_name || 'Anonymous'}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{discussion.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussions;