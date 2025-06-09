
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  FileText, 
  Truck, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            🚀 Kenya's Premier Supply Chain Job Platform
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Transform Your Supply Chain Career
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with top companies, access exclusive opportunities, and advance your career in Kenya's thriving supply chain industry.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link to="/jobs">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Briefcase className="mr-2 h-5 w-5" />
                Find Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/companies">
              <Button size="lg" variant="outline" className="border-2">
                <Users className="mr-2 h-5 w-5" />
                Browse Companies
              </Button>
            </Link>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-muted-foreground">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">200+</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1000+</div>
              <div className="text-sm text-muted-foreground">Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              SupplyChain_KE provides comprehensive tools and resources for supply chain professionals in Kenya.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Job Opportunities",
                description: "Find specialized supply chain positions across Kenya",
                color: "text-blue-500 bg-blue-500/10",
                href: "/jobs"
              },
              {
                icon: Users,
                title: "Professional Network",
                description: "Connect with industry leaders and peers",
                color: "text-green-500 bg-green-500/10",
                href: "/job-seekers"
              },
              {
                icon: FileText,
                title: "Industry Insights",
                description: "Access the latest supply chain news and analysis",
                color: "text-purple-500 bg-purple-500/10",
                href: "/blog"
              },
              {
                icon: Truck,
                title: "Resource Hub",
                description: "Leverage tools tailored for supply chain management",
                color: "text-orange-500 bg-orange-500/10",
                href: "/interview-prep"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                    <CardHeader className="text-center">
                      <div className={`mx-auto rounded-full p-4 w-fit ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Featured Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional services designed to accelerate your career growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <CardTitle>Free CV Review</CardTitle>
                </div>
                <CardDescription>Get professional feedback on your resume</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Our experts will review your CV and provide actionable feedback to improve your chances of landing interviews.</p>
                <Link to="/free-services">
                  <Button variant="outline" className="w-full">
                    Get Free Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <CardTitle>Career Coaching</CardTitle>
                </div>
                <CardDescription>One-on-one guidance from industry experts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Personal career coaching sessions to help you navigate your supply chain career path effectively.</p>
                <Link to="/free-services">
                  <Button variant="outline" className="w-full">
                    Book Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <CardTitle>Interview Prep</CardTitle>
                </div>
                <CardDescription>Master your next job interview</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Comprehensive interview preparation including mock interviews and industry-specific questions.</p>
                <Link to="/interview-prep">
                  <Button variant="outline" className="w-full">
                    Start Prep
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location Focus */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Opportunities Across Kenya</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find supply chain opportunities in major cities and regions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { city: "Nairobi", jobs: "250+ Jobs" },
              { city: "Mombasa", jobs: "80+ Jobs" },
              { city: "Kisumu", jobs: "45+ Jobs" },
              { city: "Nakuru", jobs: "35+ Jobs" },
              { city: "Eldoret", jobs: "25+ Jobs" },
              { city: "Meru", jobs: "20+ Jobs" },
              { city: "Thika", jobs: "30+ Jobs" },
              { city: "Machakos", jobs: "15+ Jobs" }
            ].map((location, index) => (
              <div key={index} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold">{location.city}</h3>
                <p className="text-sm text-muted-foreground">{location.jobs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Advance Your Career?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of supply chain professionals in Kenya and take your career to the next level.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/jobs">
                <Clock className="mr-2 h-5 w-5" />
                Browse Jobs Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/post-job">Post a Job</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
