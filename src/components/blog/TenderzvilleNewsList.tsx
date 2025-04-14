
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Calendar, ArrowUpRight } from "lucide-react";
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
      // This is a workaround using a CORS proxy to fetch the blog page
      // In a production environment, you would set up a proper backend proxy or API
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const targetUrl = encodeURIComponent('https://tenderzville-portal.co.ke/blog-page/');
      
      const response = await fetch(`${proxyUrl}${targetUrl}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data = await response.json();
      const htmlContent = data.contents;
      
      // Parse the HTML to extract blog posts
      const parsedPosts = parseTenderzvilleBlogHTML(htmlContent);
      
      // Sort posts by date (newest first)
      const sortedPosts = parsedPosts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setPosts(sortedPosts);
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

  // Function to parse the HTML content from the Tenderzville blog page
  const parseTenderzvilleBlogHTML = (html: string): TenderzvillePost[] => {
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract blog posts based on the website's structure
    // This will need to be adjusted based on the actual HTML structure of the website
    const blogPosts: TenderzvillePost[] = [];
    
    try {
      // Look for article elements or blog post containers
      const postElements = doc.querySelectorAll('.post, article, .blog-post');
      
      if (postElements.length === 0) {
        // If specific selectors don't work, try a more generic approach
        const postElements = doc.querySelectorAll('h2 a, h3 a');
        
        postElements.forEach((element, index) => {
          const link = element.getAttribute('href') || '';
          const title = element.textContent || `Blog Post ${index + 1}`;
          
          // Find the closest container that might have more information
          const parentContainer = element.closest('article, .post, div');
          
          // Try to extract excerpt, content and date
          let excerpt = '';
          let content = '';
          let date = '';
          let imageUrl = '';
          
          if (parentContainer) {
            // Try to find excerpt or content
            const contentElement = parentContainer.querySelector('p, .excerpt, .content');
            if (contentElement) {
              excerpt = contentElement.textContent || '';
              content = excerpt;
            }
            
            // Try to find date
            const dateElement = parentContainer.querySelector('.date, time, .posted-on');
            if (dateElement) {
              date = dateElement.textContent || '';
            } else {
              date = new Date().toISOString().split('T')[0]; // Default to today
            }
            
            // Try to find image
            const imgElement = parentContainer.querySelector('img');
            if (imgElement) {
              imageUrl = imgElement.getAttribute('src') || '';
              // Make sure the URL is absolute
              if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = new URL(imageUrl, 'https://tenderzville-portal.co.ke').href;
              }
            }
          }
          
          // Generate some tags based on the title and content
          const tags = generateTagsFromText(title + ' ' + excerpt);
          
          // Add "Kenya" as a default tag for all posts
          if (!tags.includes('Kenya')) {
            tags.push('Kenya');
          }
          
          blogPosts.push({
            id: index + 1,
            title,
            excerpt: excerpt || 'Click to read more about this topic on Tenderzville Portal.',
            content: content || excerpt,
            date: date || new Date().toISOString().split('T')[0],
            link: link.startsWith('http') ? link : `https://tenderzville-portal.co.ke${link}`,
            tags,
            imageUrl
          });
        });
      } else {
        // Process structured posts
        postElements.forEach((element, index) => {
          const titleElement = element.querySelector('h2, h3, .title a');
          const title = titleElement?.textContent || `Blog Post ${index + 1}`;
          
          const linkElement = element.querySelector('a');
          const link = linkElement?.getAttribute('href') || '';
          
          const excerptElement = element.querySelector('p, .excerpt, .content');
          const excerpt = excerptElement?.textContent || '';
          
          const dateElement = element.querySelector('.date, time, .posted-on');
          const date = dateElement?.textContent || new Date().toISOString().split('T')[0];
          
          const imgElement = element.querySelector('img');
          let imageUrl = imgElement?.getAttribute('src') || '';
          
          // Make sure the URL is absolute
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = new URL(imageUrl, 'https://tenderzville-portal.co.ke').href;
          }
          
          // Generate tags based on content
          const tags = generateTagsFromText(title + ' ' + excerpt);
          
          blogPosts.push({
            id: index + 1,
            title,
            excerpt: excerpt || 'Click to read more about this topic on Tenderzville Portal.',
            content: excerpt,
            date: date,
            link: link.startsWith('http') ? link : `https://tenderzville-portal.co.ke${link}`,
            tags,
            imageUrl
          });
        });
      }
      
      return blogPosts;
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return [];
    }
  };
  
  // Function to generate tags based on text content
  const generateTagsFromText = (text: string): string[] => {
    const tags: string[] = [];
    const lowercasedText = text.toLowerCase();
    
    // Look for common supply chain related terms
    const possibleTags = [
      "Procurement", "Kenya", "Tender", "Supply Chain", "Logistics", 
      "Government", "Business", "Opportunities", "Technology", "Digital"
    ];
    
    possibleTags.forEach(tag => {
      if (lowercasedText.includes(tag.toLowerCase())) {
        tags.push(tag);
      }
    });
    
    // If no tags were found, add a default one
    if (tags.length === 0) {
      tags.push("Procurement");
    }
    
    return tags;
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
                  <span>{post.date}</span>
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

