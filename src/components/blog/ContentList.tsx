
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BlogNewsItem from "./BlogNewsItem";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedDate?: string;
  tags?: string[];
}

interface ContentListProps {
  items: ContentItem[];
  isLoading?: boolean;
}

const ContentList = ({ items, isLoading = false }: ContentListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Content...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Content Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No content items found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {items.map((item) => (
          <BlogNewsItem
            key={item.id}
            title={item.title}
            content={item.content}
            sourceUrl={item.sourceUrl}
            sourceName={item.sourceName}
            publishedDate={item.publishedDate}
            tags={item.tags}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ContentList;
