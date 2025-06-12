
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, BriefcaseIcon, Star, Users, TrendingUp } from "lucide-react";

const JobSeekers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const jobCategories = [
    { name: "Supply Chain Management", count: 45, trending: true },
    { name: "Logistics Coordinator", count: 32, trending: false },
    { name: "Procurement Specialist", count: 28, trending: true },
    { name: "Warehouse Operations", count: 51, trending: false },
    { name: "Transportation", count: 23, trending: true },
    { name: "Inventory Management", count: 35, trending: false },
  ];

  const featuredEmployers = [
    { name: "Kenya Airways", logo: "🛫", jobs: 8, rating: 4.5 },
    { name: "Safaricom", logo: "📱", jobs: 12, rating: 4.7 },
    { name: "East African Breweries", logo: "🍺", jobs: 6, rating: 4.3 },
    { name: "Kenya Commercial Bank", logo: "🏦", jobs: 9, rating: 4.4 },
  ];

  const careerTips = [
    {
      title: "Optimize Your LinkedIn Profile",
      description: "Make your profile stand out to recruiters in the supply chain industry",
      readTime: "5 min read"
    },
    {
      title: "Supply Chain Certifications Worth Pursuing", 
      description: "Boost your career with these industry-recognized certifications",
      readTime: "8 min read"
    },
    {
      title: "Salary Negotiation Tips",
      description: "Get the compensation you deserve in your next role",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Supply Chain Job</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connect with top employers and advance your career in Kenya's supply chain industry
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              Search Jobs
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location: Nairobi
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4" />
            Experience Level
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Salary Range
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Job Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Job Categories</CardTitle>
              <CardDescription>Browse jobs by category in the supply chain industry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobCategories.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{category.name}</h3>
                      {category.trending && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{category.count} open positions</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Career Development Tips</CardTitle>
              <CardDescription>Boost your career with expert advice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careerTips.map((tip, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{tip.description}</p>
                    <Badge variant="outline">{tip.readTime}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Featured Employers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Featured Employers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredEmployers.map((employer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{employer.logo}</div>
                      <div>
                        <h4 className="font-medium text-sm">{employer.name}</h4>
                        <p className="text-xs text-muted-foreground">{employer.jobs} open jobs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{employer.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Job Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2,400+</div>
                  <div className="text-sm text-muted-foreground">Active Job Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">850+</div>
                  <div className="text-sm text-muted-foreground">Hiring Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15k+</div>
                  <div className="text-sm text-muted-foreground">Job Seekers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobSeekers;
