
import { useContentData } from "@/hooks/useContentData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";

export interface ContentListProps {
  activeTab: string;
  searchTerm: string;
  selectedTags: string[];
  handleCreatePost: () => void;
}

const ContentList = ({ activeTab, searchTerm, selectedTags, handleCreatePost }: ContentListProps) => {
  const { content, loading } = useContentData();

  const filteredContent = content.filter(item => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => item.tags.includes(tag));
    
    return matchesTab && matchesSearch && matchesTags;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredContent.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              No content found matching your criteria.
            </p>
            {activeTab === "blog" && (
              <Button onClick={handleCreatePost}>
                Create Your First Post
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {filteredContent.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl line-clamp-2">{item.title}</CardTitle>
              <Badge variant={item.type === "blog" ? "default" : "secondary"}>
                {item.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              {item.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{item.author}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {item.content}
            </p>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentList;
