
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, Building2, MapPin, Users, TrendingUp, GraduationCap, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { CareersVotingCTA } from "./CareersVotingCTA";

export const JobsBizDevelopment = () => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 dark:from-purple-900 dark:to-indigo-900 text-white py-12 px-4 rounded-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Business Development Team
          </h1>
          <p className="text-lg md:text-xl opacity-95 max-w-2xl">
            Help build Kenya's premier Supply Chain jobs platform through strategic partnerships, 
            customer acquisition, and innovative revenue models.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
              <Link to="/careers?tab=apply">Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>

      <CareersVotingCTA />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Our Vision</CardTitle>
          <CardDescription>
            Building the definitive Supply Chain careers platform for Kenya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            "The role is demanding. The expectations are clear: leading our multi-city procurement, 
            inventory, logistics, and partner management strategy, designing frameworks that prevent 
            stockouts and wastage, management of vendor relations to last-mile delivery - and this 
            would be done with limited resources, and a lot of hustle—in the beginning."
          </p>
          <p>
            "We're offering a structure that leans on value. You won't be walking into a plush seat. 
            The first months will be an immersive co-leadership phase with stipend. After that, it transitions 
            into full managerial role, plus other benefits tied to your office, milestones and impact."
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="core">Core Roles</TabsTrigger>
          <TabsTrigger value="specialized">Specialized Roles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="core" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-purple-600" />
                <CardTitle>Partnerships Manager</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Identify and secure partnerships with major Kenyan employers in logistics, manufacturing, retail, and agricultural supply chains</li>
                <li>Negotiate exclusive job posting agreements with companies like Safaricom, Kenya Airways, and major retailers</li>
                <li>Build relationships with government agencies like Kenya Ports Authority for public sector opportunities</li>
                <li>Create revenue-sharing models with complementary job platforms</li>
                <li>Develop corporate subscription packages for premium employers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-600" />
                <CardTitle>User Acquisition Specialist</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Implement targeted digital campaigns across Kenyan social media platforms</li>
                <li>Organize physical job fairs in major Kenyan cities (Nairobi, Mombasa, Kisumu)</li>
                <li>Create referral programs to incentivize user growth</li>
                <li>Develop university partnerships to reach supply chain graduates</li>
                <li>Track and optimize user acquisition costs and conversion rates</li>
                <li>Design SMS campaigns to reach candidates without consistent internet access</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-6 w-6 text-purple-600" />
                <CardTitle>Customer Success Representative</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide multilingual support in English, Swahili, and major local languages</li>
                <li>Create educational resources for job seekers on supply chain career paths</li>
                <li>Assist employers with optimizing job listings for better candidate matches</li>
                <li>Collect user feedback to inform product development</li>
                <li>Monitor and improve user retention metrics</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specialized" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <CardTitle>Revenue Strategy Manager</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Design sustainable monetization models (premium listings, featured employers, etc.)</li>
                <li>Develop pricing strategies appropriate for the Kenyan market</li>
                <li>Create financial projections and business growth models</li>
                <li>Identify opportunities for value-added services</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-purple-600" />
                <CardTitle>Regional Business Development Representatives</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Focus on specific geographic regions within Kenya</li>
                <li>Build relationships with local businesses and community organizations</li>
                <li>Understand regional supply chain employment needs and challenges</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-purple-600" />
                <CardTitle>International Supply Chain Connector</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Build relationships with multinational companies establishing operations in Kenya</li>
                <li>Create pathways for Kenyan supply chain professionals to access international opportunities</li>
                <li>Connect with East African regional employers looking for Kenyan talent</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card id="apply" className="bg-slate-50 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-xl">Revenue Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Primary Revenue Streams</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Premium job listings</li>
                <li>Featured company profiles</li>
                <li>Corporate subscription packages</li>
                <li>Candidate database access</li>
                <li>Sponsored industry reports</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Value-Added Services</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Resume building & optimization</li>
                <li>AI-based candidate matching</li>
                <li>Job fair organization</li>
                <li>Supply chain salary analysis</li>
                <li>Industry certification tracking</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Join our team by voting initiative</h3>
            <p className="mb-4">
              We believe in community-led growth. Our platform is built for and by supply chain practitioners. 
              Share your vision for enhancing the platform and let the community vote for the best ideas 
              that will drive traffic, engagement, and success.
            </p>
            <Button className="bg-purple-700 hover:bg-purple-800 mt-2">Submit Your Vision</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
