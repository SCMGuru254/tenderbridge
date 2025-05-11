
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, FileText, MessageSquare, Users } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

export default function FreeServices() {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState('cv-review');

  // Mock data of available coaches/experts
  const experts = [
    { id: 1, name: "Sarah Johnson", specialty: "CV Review", available: true },
    { id: 2, name: "David Mwangi", specialty: "Interview Coaching", available: true },
    { id: 3, name: "Grace Otieno", specialty: "Career Guidance", available: false },
    { id: 4, name: "James Odhiambo", specialty: "CV Review", available: true },
  ];

  const filterExpertsByType = (type: string) => {
    switch (type) {
      case 'cv-review':
        return experts.filter(expert => expert.specialty === "CV Review" && expert.available);
      case 'interview-coaching':
        return experts.filter(expert => expert.specialty === "Interview Coaching" && expert.available);
      case 'career-guidance':
        return experts.filter(expert => expert.specialty === "Career Guidance" && expert.available);
      default:
        return experts.filter(expert => expert.available);
    }
  };

  const filteredExperts = filterExpertsByType(serviceType);

  return (
    <div className="container mx-auto px-4 py-12 mt-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Free Career Services</h1>
        <p className="text-muted-foreground mb-8">
          Access complimentary career services from our partner HR specialists and coaches
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
            <CardDescription>
              Through our rewards program and partnerships, we offer free career services to eligible users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our HR partners provide a limited number of free services each month to the SupplyChain_KE community.
              You can qualify for these services by:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Referring the app to 20+ new users (see our <Link to="/rewards" className="text-primary hover:underline">Rewards Program</Link>)</li>
              <li>Engaging with our partner content (50+ ad views per month)</li>
              <li>Being selected in our monthly lucky draw for active community members</li>
            </ul>
            <p className="mt-4">
              Services are limited and allocated on a first-come, first-served basis to qualified users.
            </p>
          </CardContent>
          {!user && (
            <CardFooter>
              <Button asChild>
                <Link to="/auth">Sign in to check eligibility</Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        <Tabs defaultValue="cv-review" className="mb-8" onValueChange={setServiceType}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="cv-review" className="text-center">CV Review</TabsTrigger>
            <TabsTrigger value="interview-coaching" className="text-center">Interview Coaching</TabsTrigger>
            <TabsTrigger value="career-guidance" className="text-center">Career Guidance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cv-review">
            <h2 className="text-xl font-medium mb-4">Available CV Review Services</h2>
            <p className="mb-6">Our HR specialists will review your CV and provide professional feedback to make it stand out to recruiters.</p>
          </TabsContent>
          
          <TabsContent value="interview-coaching">
            <h2 className="text-xl font-medium mb-4">Available Interview Coaching</h2>
            <p className="mb-6">Prepare for your next interview with a 30-minute coaching session focused on supply chain role interviews.</p>
          </TabsContent>
          
          <TabsContent value="career-guidance">
            <h2 className="text-xl font-medium mb-4">Available Career Guidance</h2>
            <p className="mb-6">Get personalized advice on your supply chain career path and development opportunities.</p>
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredExperts.length > 0 ? (
            filteredExperts.map(expert => (
              <Card key={expert.id} className="relative">
                <CardHeader>
                  <CardTitle className="text-lg">{expert.name}</CardTitle>
                  <CardDescription>{expert.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Available for one free session this month
                  </p>
                </CardContent>
                <CardFooter>
                  <Button disabled={!user} className="w-full">
                    {user ? "Book Free Session" : "Sign in to Book"}
                  </Button>
                </CardFooter>
                {expert.available && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Available
                    </span>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Available Experts</h3>
              <p className="text-muted-foreground mt-2">
                There are currently no experts available for this service type.
                Please check back later or try another service.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Interested in offering your HR expertise to our community?
          </p>
          <Button variant="outline" asChild>
            <Link to="/forms">Become a Partner</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
