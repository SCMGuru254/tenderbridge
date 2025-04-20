
import { Loader2 } from "lucide-react";
import { format, parseISO, isAfter, subDays, differenceInDays, addMonths } from "date-fns";
import { BlogNewsItem } from "./BlogNewsItem";
import { NoContent } from "./NoContent";
import { ExpiryAlert } from "./ExpiryAlert";
import { useContentData } from "@/hooks/useContentData";
import type { NewsItem, BlogPost } from "@/hooks/useContentData";

interface ContentListProps {
  activeTab: string;
  searchTerm: string;
  selectedTags: string[];
  handleCreatePost: () => void;
}

export const ContentList = ({ 
  activeTab, 
  searchTerm, 
  selectedTags, 
  handleCreatePost 
}: ContentListProps) => {
  const { news, blogPostsData, isLoadingNews, blogLoading } = useContentData(activeTab);

  // Calculate date thresholds
  const threeDaysAgo = subDays(new Date(), 3);
  const oneMonthAgo = subDays(new Date(), 30);

  const filteredContent = activeTab === "news" 
    ? news?.filter(item => {
        const matchesSearch = !searchTerm || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesTags = selectedTags.length === 0 || 
          (item.tags && selectedTags.some(tag => item.tags?.includes(tag)));
        
        let isRecent = false;
        if (item.published_date) {
          try {
            const pubDate = parseISO(item.published_date);
            isRecent = isAfter(pubDate, threeDaysAgo);
          } catch (e) {
            console.error("Error parsing date:", e);
          }
        }
        
        return matchesSearch && matchesTags && isRecent;
      })
    : blogPostsData?.filter(post => {
        const matchesSearch = 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesTags = selectedTags.length === 0 || 
          (post.tags && selectedTags.some(tag => post.tags?.includes(tag)));
        
        const isWithinMonth = isAfter(parseISO(post.created_at), oneMonthAgo);
        
        return matchesSearch && matchesTags && isWithinMonth;
      });

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'No date';
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  const getDaysRemaining = (createdAt: string) => {
    try {
      const date = parseISO(createdAt);
      const expiryDate = addMonths(date, 1);
      const daysLeft = differenceInDays(expiryDate, new Date());
      return daysLeft > 0 ? daysLeft : 0;
    } catch (error) {
      return 0;
    }
  };

  if (isLoadingNews || blogLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (filteredContent?.length === 0) {
    return <NoContent activeTab={activeTab} handleCreatePost={handleCreatePost} />;
  }

  return (
    <div className="grid gap-6">
      {activeTab === "blog" && <ExpiryAlert />}
      
      {filteredContent?.map((item) => (
        <div key={item.id} className="relative">
          {activeTab === "blog" && (
            <div className="absolute top-2 right-2 z-10 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
              {getDaysRemaining(item.created_at)} days left
            </div>
          )}
          <BlogNewsItem 
            item={item}
            type={activeTab as "news" | "blog"}
            formatDate={formatDate}
          />
        </div>
      ))}
    </div>
  );
};
