
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Calendar, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

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

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Simulated data from tenderzville-portal.co.ke/blog-page/
        // In a real implementation, this would be an API call to fetch blog posts
        const samplePosts: TenderzvillePost[] = [
          {
            id: 1,
            title: "Understanding The Green Public Procurement In Kenya",
            excerpt: "Green Public Procurement in Kenya refers to the procurement of goods, services, and works with a reduced environmental impact throughout their lifecycle.",
            content: "Green Public Procurement in Kenya refers to the procurement of goods, services, and works with a reduced environmental impact throughout their lifecycle. It's an approach that considers not just the financial cost but also the environmental footprint of what is being procured.",
            date: "2023-04-10",
            link: "https://tenderzville-portal.co.ke/blog-page/understanding-the-green-public-procurement-in-kenya/",
            tags: ["Procurement", "Kenya", "Sustainability"]
          },
          {
            id: 2,
            title: "Securing Business Opportunities With County Governments In Kenya",
            excerpt: "County governments in Kenya operate independently with their own procurement systems and budgets.",
            content: "County governments in Kenya operate independently with their own procurement systems and budgets. They regularly announce tenders for goods and services needed in their jurisdictions. These tenders present lucrative opportunities for businesses looking to expand their operations.",
            date: "2023-04-15",
            link: "https://tenderzville-portal.co.ke/blog-page/securing-business-opportunities-with-county-governments-in-kenya/",
            tags: ["Kenya", "Government", "Business"]
          },
          {
            id: 3,
            title: "Navigating The Digital Procurement Landscape In Kenya",
            excerpt: "Kenya has been at the forefront of digital transformation in Africa, and procurement is no exception.",
            content: "Kenya has been at the forefront of digital transformation in Africa, and procurement is no exception. The shift from traditional paper-based procurement to digital systems has revolutionized how businesses and governments acquire goods and services.",
            date: "2023-04-20",
            link: "https://tenderzville-portal.co.ke/blog-page/navigating-the-digital-procurement-landscape-in-kenya/",
            tags: ["Procurement", "Technology", "Kenya", "Digital"]
          },
          {
            id: 4,
            title: "Supply Chain Resilience Strategies For Kenyan Businesses",
            excerpt: "Recent global disruptions have highlighted the importance of building resilient supply chains.",
            content: "Recent global disruptions have highlighted the importance of building resilient supply chains. Kenyan businesses are now reevaluating their supply chain strategies to ensure continuity and adaptability in the face of unforeseen challenges.",
            date: "2023-04-25",
            link: "https://tenderzville-portal.co.ke/blog-page/supply-chain-resilience-strategies-for-kenyan-businesses/",
            tags: ["Supply Chain", "Risk Management", "Kenya"]
          },
          {
            id: 5,
            title: "The Role Of Technology In Enhancing Supply Chain Visibility",
            excerpt: "Technology plays a crucial role in enhancing supply chain visibility, enabling businesses to track and monitor their products throughout the entire process.",
            content: "Technology plays a crucial role in enhancing supply chain visibility, enabling businesses to track and monitor their products throughout the entire process. From Internet of Things (IoT) devices to blockchain technology, there are numerous tools available that can provide real-time insights into the supply chain.",
            date: "2023-05-01",
            link: "https://tenderzville-portal.co.ke/blog-page/the-role-of-technology-in-enhancing-supply-chain-visibility/",
            tags: ["Technology", "Supply Chain", "Innovation"]
          }
        ];
        
        // Add today's date for fresh content
        const today = new Date();
        const recentPost: TenderzvillePost = {
          id: 6,
          title: "Latest Tender Opportunities in Kenya: April 2025 Update",
          excerpt: "Stay informed about the newest government and private sector tender opportunities available this month.",
          content: "This monthly update provides information on the latest tender opportunities across various sectors in Kenya. From infrastructure projects to IT services, we cover a wide range of options for businesses looking to secure new contracts.",
          date: format(today, 'yyyy-MM-dd'),
          link: "https://tenderzville-portal.co.ke/blog-page/latest-tender-opportunities-kenya-april-2025/",
          tags: ["Tenders", "Kenya", "Opportunities", "Procurement"]
        };
        
        setPosts([recentPost, ...samplePosts]);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error fetching Tenderzville posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term and selected tags
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-medium mb-2">No matching posts found</h3>
        <p className="mb-6">Try adjusting your search filters or check back later for new content</p>
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
        <p className="text-xs text-gray-500">Content refreshed daily</p>
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
