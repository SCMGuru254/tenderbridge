
import { useState } from 'react';
import { Briefcase, MapPin, Search, Users, Star, Zap, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobList } from '@/components/JobList';
import { useJobData } from '@/hooks/useJobData';
import { FeatureStatusCheck } from '@/components/debug/FeatureStatusCheck';
import { Link } from 'react-router-dom';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeatureCheck, setShowFeatureCheck] = useState(false);
  const { jobs, isLoading, error } = useJobData();

  const features = [
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Latest Supply Chain Jobs",
      description: "Fresh opportunities updated daily from top companies across Kenya"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Professional Network",
      description: "Connect with supply chain professionals and industry leaders"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Matching",
      description: "Smart job recommendations based on your skills and experience"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "ATS Optimization",
      description: "Ensure your CV passes applicant tracking systems"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Ready",
      description: "Full mobile experience for job searching on the go"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Interview Prep",
      description: "AI-powered interview practice and feedback"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                🚀 Now 100% Production Ready
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Supply Chain Jobs Kenya
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Your premier destination for supply chain, logistics, and procurement careers in Kenya. 
              Powered by AI, built for professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/jobs">
                <Button size="lg" className="px-8 py-3 text-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Find Jobs
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  <Users className="mr-2 h-5 w-5" />
                  Join Network
                </Button>
              </Link>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowFeatureCheck(!showFeatureCheck)}
                className="text-sm"
              >
                {showFeatureCheck ? 'Hide' : 'Show'} System Status
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Status Check */}
      {showFeatureCheck && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <FeatureStatusCheck />
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete Job Search Platform</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to advance your supply chain career, powered by cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Opportunities</h2>
            <p className="text-muted-foreground">
              Fresh supply chain jobs posted in the last 24 hours
            </p>
          </div>

          <Tabs defaultValue="preview" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Job Preview</TabsTrigger>
              <TabsTrigger value="search">Advanced Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="space-y-6">
              <JobList jobs={jobs?.slice(0, 6)} isLoading={isLoading} error={error} />
              <div className="text-center">
                <Link to="/jobs">
                  <Button size="lg" variant="outline">
                    View All Jobs
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="search" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Find Your Perfect Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search for jobs, companies, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Link to={`/jobs${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`}>
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Logistics Manager
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Supply Chain Analyst
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Procurement Officer
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Warehouse Manager
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Advance Your Career?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of supply chain professionals who found their dream jobs with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Create Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
