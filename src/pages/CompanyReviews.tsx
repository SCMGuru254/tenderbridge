import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Building2, 
  Calendar,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface InterviewReview {
  id: string;
  company_name: string;
  position: string;
  review_text: string;
  rating: number;
  difficulty: string;
  interview_process?: string;
  interview_date?: string;
  company_culture?: string[];
  is_anonymous: boolean;
  created_at: string;
}

const CompanyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<InterviewReview[]>([]);
  const [newReview, setNewReview] = useState({
    company_name: '',
    position: '',
    review_text: '',
    rating: 5,
    difficulty: 'medium',
    interview_process: '',
    interview_date: '',
    company_culture: [],
    is_anonymous: false
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast.error('Please sign in to submit a review');
      return;
    }

    try {
      const { error } = await supabase
        .from('interview_reviews')
        .insert({
          ...newReview,
          user_id: user.id,
          interview_date: newReview.interview_date || null
        });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setNewReview({
        company_name: '',
        position: '',
        review_text: '',
        rating: 5,
        difficulty: 'medium',
        interview_process: '',
        interview_date: '',
        company_culture: [],
        is_anonymous: false
      });
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          Company Reviews
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Share your interview experiences and help others prepare better for their supply chain career journey.
        </p>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Browse Reviews</TabsTrigger>
          <TabsTrigger value="submit">Submit Review</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{review.company_name}</h3>
                      <p className="text-muted-foreground">{review.position}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-muted-foreground">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">{review.review_text}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">
                      Difficulty: {review.difficulty}
                    </Badge>
                    {review.interview_date && (
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(review.interview_date).toLocaleDateString()}
                      </Badge>
                    )}
                    {review.company_culture?.map((culture: string) => (
                      <Badge key={culture} variant="outline">
                        {culture}
                      </Badge>
                    ))}
                  </div>

                  {review.interview_process && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Interview Process:</h4>
                      <p className="text-sm text-muted-foreground">{review.interview_process}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      By {review.is_anonymous ? 'Anonymous' : 'Verified User'} • 
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {reviews.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share your interview experience.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Interview Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={newReview.company_name}
                      onChange={(e) => setNewReview({...newReview, company_name: e.target.value})}
                      placeholder="Safaricom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newReview.position}
                      onChange={(e) => setNewReview({...newReview, position: e.target.value})}
                      placeholder="Supply Chain Manager"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rating">Overall Rating</Label>
                    <Select 
                      value={newReview.rating.toString()} 
                      onValueChange={(value) => setNewReview({...newReview, rating: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Interview Difficulty</Label>
                    <Select 
                      value={newReview.difficulty} 
                      onValueChange={(value) => setNewReview({...newReview, difficulty: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="interview_date">Interview Date</Label>
                    <Input
                      id="interview_date"
                      type="date"
                      value={newReview.interview_date}
                      onChange={(e) => setNewReview({...newReview, interview_date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="review_text">Your Review</Label>
                  <Textarea
                    id="review_text"
                    rows={4}
                    value={newReview.review_text}
                    onChange={(e) => setNewReview({...newReview, review_text: e.target.value})}
                    placeholder="Share your interview experience, what questions were asked, and any tips for future candidates..."
                  />
                </div>

                <div>
                  <Label htmlFor="interview_process">Interview Process (Optional)</Label>
                  <Textarea
                    id="interview_process"
                    rows={3}
                    value={newReview.interview_process}
                    onChange={(e) => setNewReview({...newReview, interview_process: e.target.value})}
                    placeholder="Describe the interview process: how many rounds, types of interviews, timeline, etc."
                  />
                </div>

                <Button onClick={submitReview} className="w-full">
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyReviews;
