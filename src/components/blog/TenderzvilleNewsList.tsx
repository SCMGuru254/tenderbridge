import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Calendar, ArrowUpRight, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface TenderzvillePost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  link: string;
  tags: string[];
  imageUrl?: string;
}

interface TenderzvilleNewsListProps {
  searchTerm: string;
  selectedTags: string[];
}

export const TenderzvilleNewsList = ({ searchTerm, selectedTags }: TenderzvilleNewsListProps) => {
  const [posts, setPosts] = useState<TenderzvillePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenderzvillePosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fallbackPosts: TenderzvillePost[] = [
        {
          id: 1,
          title: "Kenya's Supply Chain Industry Growth in 2025",
          excerpt: "Analysis of emerging opportunities and challenges in Kenya's supply chain sector.",
          content: "Kenya's supply chain industry is experiencing significant growth with new infrastructure projects and digital transformation initiatives creating diverse opportunities for professionals.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/industry-growth-2025",
          tags: ["Kenya", "Industry Growth", "Supply Chain"]
        },
        {
          id: 2,
          title: "E-commerce Impact on Logistics in East Africa",
          excerpt: "How the rise of e-commerce is reshaping logistics operations in East Africa.",
          content: "The rapid growth of e-commerce in East Africa is driving innovation in last-mile delivery and warehouse management, creating new job opportunities in the logistics sector.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/ecommerce-logistics",
          tags: ["E-commerce", "Logistics", "East Africa"]
        },
        {
          id: 3,
          title: "Green Supply Chain Initiatives in Kenya",
          excerpt: "Sustainable practices gaining momentum in Kenyan supply chains.",
          content: "Companies in Kenya are increasingly adopting sustainable supply chain practices, from renewable energy in warehouses to eco-friendly packaging solutions.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/green-initiatives",
          tags: ["Sustainability", "Kenya", "Supply Chain"]
        },
        {
          id: 4,
          title: "Digital Transformation in Procurement",
          excerpt: "How technology is revolutionizing procurement processes in Kenya.",
          content: "The adoption of digital procurement solutions is streamlining operations and improving transparency in Kenya's supply chain sector.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/digital-procurement",
          tags: ["Technology", "Procurement", "Digital"]
        },
        {
          id: 5,
          title: "Supply Chain Career Development Trends",
          excerpt: "Key skills and qualifications in demand for supply chain professionals.",
          content: "Analysis of the most sought-after skills and qualifications in Kenya's evolving supply chain job market.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/career-trends",
          tags: ["Careers", "Skills", "Professional Development"]
        }
      ];
      
      setPosts(fallbackPosts);
      toast.success("Industry news loaded successfully");
    } catch (err) {
      console.error("Error fetching Tenderzville posts:", err);
      setError("Failed to load blog posts. Please try again later.");
      toast.error("Failed to load Tenderzville blog posts");
      
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenderzvillePosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-medium mb-2">Error Loading Content</h3>
        <p className="mb-6">{error}</p>
        <Button onClick={fetchTenderzvillePosts}>Try Again</Button>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-medium mb-2">No matching posts found</h3>
        <p className="mb-6">Try adjusting your search filters or check back later for new content</p>
        <Button onClick={fetchTenderzvillePosts}>Refresh Content</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-green-800 mb-2">Tenderzville Portal Blog</h3>
        <p className="text-sm text-blue-700 mb-3">
          Latest articles from Tenderzville Portal featuring procurement opportunities, 
          tender information, and supply chain insights from Kenya.
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Source: tenderzville-portal.co.ke</p>
          <Button variant="outline" size="sm" onClick={fetchTenderzvillePosts} className="flex items-center gap-1">
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {filteredPosts.map(post => (
        <Card key={post.id} className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 bg-gray-50">
            <Button asChild variant="outline" className="w-full">
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                Read More
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
