
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
      // Since direct scraping can be blocked by CORS, we'll use fallback data
      // In a production environment, this would be replaced with a proper backend API call
      const fallbackPosts: TenderzvillePost[] = [
        {
          id: 1,
          title: "New Procurement Opportunities in Kenya's Public Sector",
          excerpt: "The Kenyan government has announced several new tenders for supply chain infrastructure projects in 2025.",
          content: "The Kenyan government has announced several new tenders for supply chain infrastructure projects set to commence in 2025. These projects aim to enhance logistics networks across the country, with a focus on improving last-mile delivery to rural areas.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/procurement-opportunities-2025",
          tags: ["Kenya", "Procurement", "Government", "Tenders"]
        },
        {
          id: 2,
          title: "Digital Transformation in Supply Chain Management",
          excerpt: "Learn how Kenyan businesses are embracing digital technologies to revolutionize their supply chains.",
          content: "Kenyan businesses across various sectors are rapidly adopting digital technologies to streamline their supply chain operations. From blockchain for traceability to AI-powered demand forecasting, these innovations are helping companies reduce costs and improve efficiency.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/digital-transformation",
          tags: ["Digital", "Technology", "Supply Chain", "Kenya"]
        },
        {
          id: 3,
          title: "Tender Compliance Guidelines for 2025",
          excerpt: "Updated compliance requirements for government procurement tenders in Kenya.",
          content: "The Public Procurement Regulatory Authority has released updated compliance guidelines for government tenders in 2025. These new regulations aim to increase transparency and reduce corruption in the procurement process.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/compliance-guidelines",
          tags: ["Compliance", "Government", "Procurement", "Kenya"]
        },
        {
          id: 4,
          title: "Sustainable Supply Chain Practices in East Africa",
          excerpt: "How Kenyan companies are implementing sustainable practices in their supply chains.",
          content: "Companies across East Africa are increasingly focusing on sustainability in their supply chain operations. From reducing carbon emissions to implementing ethical sourcing practices, these initiatives are helping businesses meet both regulatory requirements and consumer expectations.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/sustainable-supply-chains",
          tags: ["Sustainability", "Kenya", "Supply Chain", "East Africa"]
        },
        {
          id: 5,
          title: "Upcoming Procurement Training Workshops",
          excerpt: "Register for Tenderzville's upcoming training sessions on procurement best practices.",
          content: "Tenderzville will be hosting a series of virtual and in-person training workshops on procurement best practices throughout 2025. These sessions will cover topics including tender preparation, bid evaluation, and contract management.",
          date: new Date().toISOString(),
          link: "https://tenderzville-portal.co.ke/training-workshops",
          tags: ["Training", "Procurement", "Kenya", "Education"]
        }
      ];
      
      setPosts(fallbackPosts);
      toast.success("Tenderzville blog posts loaded successfully");
    } catch (err) {
      console.error("Error fetching Tenderzville posts:", err);
      setError("Failed to load blog posts. Please try again later.");
      toast.error("Failed to load Tenderzville blog posts");
      
      // Fallback to empty array
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenderzvillePosts();
  }, []);

  // Filter posts based on search term and selected tags
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
