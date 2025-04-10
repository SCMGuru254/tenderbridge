
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import { format, parseISO } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source_name?: string;
  source_url?: string;
  published_date?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  image_url?: string;
}

interface BlogPost extends NewsItem {
  author_id: string;
  author?: {
    full_name: string;
    avatar_url: string;
  };
}

interface NewsItemProps {
  item: NewsItem | BlogPost;
  type: "news" | "blog";
  formatDate: (dateString: string) => string;
}

export const BlogNewsItem = ({ item, type, formatDate }: NewsItemProps) => {
  const getDefaultImage = () => {
    return type === "news" 
      ? "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
      : "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
  };

  // Check if item has author property (is a BlogPost type)
  const isBlogPost = (post: NewsItem | BlogPost): post is BlogPost => {
    return 'author' in post;
  };

  return (
    <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <img 
            src={item.image_url || getDefaultImage()} 
            alt={item.title}
            className="h-full w-full object-cover aspect-video md:aspect-square"
          />
        </div>
        <div className="md:col-span-2 p-4">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-2xl">{item.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {formatDate(type === "news" ? item.published_date : item.created_at)}
              </span>
              {type === "blog" && isBlogPost(item) && item.author && (
                <div className="flex items-center ml-4">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={item.author.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{item.author.full_name || 'Anonymous'}</span>
                </div>
              )}
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0 py-2">
            <p className="text-gray-600 line-clamp-4">{item.content}</p>
          </CardContent>
          <CardFooter className="p-0 pt-2 flex justify-between">
            {type === "news" && item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline mt-4 inline-block"
              >
                Read more
              </a>
            )}
            {type === "blog" && (
              <Button variant="ghost" size="sm" className="ml-auto">
                Read more
              </Button>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
