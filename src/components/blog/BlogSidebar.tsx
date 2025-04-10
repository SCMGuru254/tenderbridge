
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BlogSidebarProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  supplyChainTags: string[];
}

export const BlogSidebar = ({ selectedTags, toggleTag, supplyChainTags }: BlogSidebarProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">Community Guidelines</h3>
      <ul className="space-y-2 text-sm">
        <li>Be respectful and constructive in your content</li>
        <li>Share your professional experiences and insights</li>
        <li>Cite sources when sharing information</li>
        <li>Avoid self-promotion or spam</li>
        <li>Upload images smaller than 2MB for better performance</li>
      </ul>
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {supplyChainTags.slice(0, 8).map(tag => (
            <Button 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
              className="text-xs"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
