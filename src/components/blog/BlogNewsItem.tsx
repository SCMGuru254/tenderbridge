
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";

interface BlogNewsItemProps {
  title: string;
  content: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedDate?: string;
  tags?: string[];
}

const BlogNewsItem = ({ title, content, sourceUrl, sourceName, publishedDate, tags }: BlogNewsItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  const truncateContent = (text: string, limit = 200) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {sourceUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        <CardDescription className="flex items-center gap-2">
          {sourceName && <span>{sourceName}</span>}
          {publishedDate && (
            <>
              <Calendar className="h-4 w-4" />
              <span>{formatDate(publishedDate)}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {isExpanded ? content : truncateContent(content)}
        </p>
        
        {content.length > 200 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-4"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </Button>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogNewsItem;
