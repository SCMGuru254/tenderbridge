import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Building2, MapPin, Users, Search, Plus, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';

interface Company {
  id: string;
  name: string;
  description?: string;
  location?: string;
  website?: string;
  verification_status: string;
  user_id: string;
  created_at: string;
}

interface CompanyReview {
  id: string;
  company_id: string;
  rating: number;
  review_text: string;
  job_position?: string;
  pros?: string;
  cons?: string;
  is_anonymous: boolean;
  is_current_employee: boolean;
  helpful_votes: number;
  status: string;
  created_at: string;
  reviewer_id?: string;
}

const CompaniesComplete = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<CompanyReview[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyReviews = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('company_reviews')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    fetchCompanyReviews(company.id);
    setActiveTab('company-detail');
  };

  const handleSubmitReview = async (reviewData: any) => {
    if (!user || !selectedCompany) return;

    try {
      const { error } = await supabase
        .from('company_reviews')
        .insert({
          company_id: selectedCompany.id,
          reviewer_id: user.id,
          ...reviewData
        });

      if (error) throw error;
      
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      fetchCompanyReviews(selectedCompany.id);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">Unverified</Badge>;
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pb-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          Supply Chain Companies
        </h1>
        <p className="text-muted-foreground">
          Discover and review supply chain companies in Kenya
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Companies</TabsTrigger>
          <TabsTrigger value="add-company">Add Company</TabsTrigger>
          <TabsTrigger value="company-detail" disabled={!selectedCompany}>
            Company Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search companies by name, location, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Companies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{company.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        {getVerificationBadge(company.verification_status)}
                      </div>
                    </div>
                  </div>
                  
                  {company.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {company.location}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {company.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">4.2</span>
                      <span className="text-sm text-muted-foreground">(12 reviews)</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewCompany(company)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No companies found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or add a new company.
                </p>
                <Button onClick={() => setActiveTab('add-company')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="add-company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Your Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Register Your Company</h3>
                <p className="text-muted-foreground mb-6">
                  Add your company to our directory and start receiving applications from qualified candidates.
                </p>
                <Button size="lg">
                  Register Company
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company-detail" className="space-y-6">
          {selectedCompany && (
            <>
              {/* Company Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{selectedCompany.name}</CardTitle>
                      <div className="flex items-center gap-4 mb-4">
                        {getVerificationBadge(selectedCompany.verification_status)}
                        {selectedCompany.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {selectedCompany.location}
                          </div>
                        )}
                      </div>
                    </div>
                    {user && (
                      <Button onClick={() => setShowReviewForm(true)}>
                        Write Review
                      </Button>
                    )}
                  </div>
                  
                  {selectedCompany.description && (
                    <p className="text-muted-foreground">{selectedCompany.description}</p>
                  )}
                </CardHeader>
              </Card>

              {/* Reviews Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employee Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No reviews yet. Be the first to review this company!
                      </p>
                    ) : (
                      reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mb-2">{review.review_text}</p>
                          {review.job_position && (
                            <Badge variant="outline" className="text-xs">
                              {review.job_position}
                            </Badge>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Form Modal */}
      {showReviewForm && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Write Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">Review form coming soon...</p>
              <Button className="w-full" onClick={() => setShowReviewForm(false)}>
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompaniesComplete;