
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoContentProps {
  activeTab: string;
  handleCreatePost: () => void;
}

export const NoContent = ({ activeTab, handleCreatePost }: NoContentProps) => {
  return (
    <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-xl font-medium mb-2">No content found</h3>
      {activeTab === "news" ? (
        <p className="mb-6">Supply chain news are updated daily and only show items from the last 3 days</p>
      ) : (
        <>
          <p className="mb-6">Be the first to contribute to our community knowledge base</p>
          <Button 
            onClick={handleCreatePost}
            className="bg-primary hover:bg-primary/90"
          >
            Write a Blog Post
          </Button>
        </>
      )}
    </div>
  );
};
