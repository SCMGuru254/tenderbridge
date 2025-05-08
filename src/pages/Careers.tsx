
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CareerApplicationForm } from "@/components/CareerApplicationForm";
import { CareerApplicationsList } from "@/components/CareerApplicationsList";

export default function Careers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Join SupplyChain_KE</h1>
        <p className="text-muted-foreground mb-8">
          Building the future of supply chain management in Kenya
        </p>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Job Information</TabsTrigger>
            <TabsTrigger value="apply">Submit Vision</TabsTrigger>
            <TabsTrigger value="submissions">Community Voting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Business Development Opportunities</CardTitle>
                <CardDescription>
                  Join our team to build Kenya's premier Supply Chain jobs platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">Business Development Lead</h3>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Nairobi, Kenya</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>Full-time</span>
                        </div>
                      </div>
                    </div>
                    <Badge>Growth</Badge>
                  </div>
                  
                  <p className="mt-4 text-muted-foreground">
                    Help build Kenya's premier Supply Chain jobs platform through strategic partnerships, 
                    customer acquisition, and innovative revenue models.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-orange-800 mb-4">Selection Process</h2>
                  <p className="text-orange-700 mb-4">
                    "We're offering a structure that leans on value. You won't be walking into a plush seat. 
                    The first months will be an immersive co-leadership phase with stipend. After that, it transitions 
                    into full managerial role, plus other benefits tied to your office, milestones and impact."
                  </p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-50">Community Voting</Badge>
                    <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-50">Proven Results</Badge>
                    <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-50">Value-Based</Badge>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Users className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Join our team by voting initiative</h3>
                    <p className="text-muted-foreground">
                      We believe in community-led growth. Our platform is built for and by supply chain practitioners. 
                      Share your vision for enhancing the platform and let the community vote for the best ideas 
                      that will drive traffic, engagement, and success.
                    </p>
                    <Button 
                      className="bg-purple-700 hover:bg-purple-800 mt-4"
                      onClick={() => handleTabChange("apply")}
                    >
                      Submit Your Vision
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Vision</CardTitle>
                <CardDescription>
                  Share how you would enhance SupplyChain_KE to drive traffic, engagement, and success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CareerApplicationForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Community Voting</CardTitle>
                <CardDescription>
                  Vote for the business development visions that you believe will best drive the platform's growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CareerApplicationsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
