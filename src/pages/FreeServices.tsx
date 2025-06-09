
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Search, TrendingUp, CheckCircle, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ATSChecker } from "@/components/ATSChecker";

export default function FreeServices() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Free Services</h1>
      <p className="text-muted-foreground mb-8">
        Discover the comprehensive free tools and resources available to all SupplyChain_KE members
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Job Search & Application</CardTitle>
                <Badge variant="secondary" className="mt-1">Always Free</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Access thousands of supply chain and logistics job opportunities across Kenya and East Africa
            </CardDescription>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Browse unlimited job listings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Apply to any position</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Save jobs for later</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Job alerts and notifications</span>
              </li>
            </ul>
            <Button asChild className="w-full mt-4">
              <NavLink to="/jobs">Browse Jobs</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Professional Networking</CardTitle>
                <Badge variant="secondary" className="mt-1">Always Free</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Connect with supply chain professionals, join discussions, and build your network
            </CardDescription>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Create professional profile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Join industry discussions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Connect with professionals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Company reviews and insights</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-4">
              <NavLink to="/discussions">Join Discussions</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Career Resources</CardTitle>
                <Badge variant="secondary" className="mt-1">Always Free</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Access industry insights, career guidance, and professional development resources
            </CardDescription>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Industry news and insights</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Career guidance articles</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Interview preparation tips</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Salary insights</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-4">
              <NavLink to="/supply-chain-insights">View Resources</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Basic Analytics</CardTitle>
                <Badge variant="secondary" className="mt-1">Always Free</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Track your job applications and get basic insights into your job search progress
            </CardDescription>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Application tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Basic job market insights</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Profile view statistics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Job matching recommendations</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-4">
              <NavLink to="/profile">View Profile</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">ATS CV Checker</CardTitle>
                <Badge variant="secondary" className="mt-1">Always Free</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Optimize your CV for Applicant Tracking Systems with our free analysis tool
            </CardDescription>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>ATS compatibility score</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Keyword optimization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Formatting recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Supply chain specific keywords</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ATS Checker Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Free ATS CV Checker</h2>
        <ATSChecker />
      </div>

      <div className="mt-12 p-6 bg-orange-50 rounded-lg border border-orange-200">
        <h2 className="text-xl font-semibold mb-3">Why Choose SupplyChain_KE?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Specialized Focus</h3>
            <p className="text-sm text-muted-foreground">
              Unlike generic job boards, we focus exclusively on supply chain, logistics, procurement, 
              and related fields in Kenya and East Africa.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Local Expertise</h3>
            <p className="text-sm text-muted-foreground">
              Deep understanding of the Kenyan job market, salary ranges, and industry requirements 
              specific to the region.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Community Driven</h3>
            <p className="text-sm text-muted-foreground">
              Built by supply chain professionals for supply chain professionals, with features 
              designed for your specific career needs.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Always Free Core Services</h3>
            <p className="text-sm text-muted-foreground">
              Job search, networking, and basic career resources will always remain free for all users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
