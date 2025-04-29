import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

interface NewsCardProps {
  title: string;
  content: string;
  publishedDate: string;
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  analysis?: string;
}

const NewsCard = ({
  title,
  content,
  publishedDate,
  sourceName,
  sourceUrl,
  tags,
  analysis
}: NewsCardProps) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{sourceName}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(publishedDate), 'MMM d, yyyy')}
            </div>
          </div>
          <CardTitle className="text-xl line-clamp-2">{title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <p className="text-muted-foreground line-clamp-3">{content}</p>
          
          {analysis && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">AI Analysis</p>
              <p className="text-sm text-muted-foreground">{analysis}</p>
            </div>
          )}
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button asChild className="w-full" variant="outline">
          <a 
            href={sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Read Full Article
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;