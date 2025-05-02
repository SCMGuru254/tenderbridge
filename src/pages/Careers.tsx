
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, MapPin, Rocket, Users, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Careers() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Join SupplyChain_KE</h1>
        <p className="text-muted-foreground mb-8">
          Building the future of supply chain management in Kenya
        </p>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">We're Building Something Different</h2>
          <p className="text-orange-700 mb-4">
            SupplyChain_KE is a startup at the beginning of its journey. We're not looking for conventional employees - we're looking for visionaries and builders who deliver on their promises.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-50">Authenticity</Badge>
            <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-50">Honesty</Badge>
            <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-50">Innovation</Badge>
            <Badge variant="outline" className="border-orange-300 text-orange-800 bg-orange-50">Execution</Badge>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Hiring Philosophy</CardTitle>
            <CardDescription>We look at the whole person, not just the CV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-2 rounded-md">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Vision Driven</h3>
                <p className="text-muted-foreground">
                  We seek people who share our vision for transforming supply chain management in Kenya, and who bring their own creative perspectives.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-2 rounded-md">
                <Rocket className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Execution Focus</h3>
                <p className="text-muted-foreground">
                  We value people who can deliver what they promise. Talk is cheap - we look for doers with a track record of execution.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-purple-100 p-2 rounded-md">
                <Zap className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Innovation Mindset</h3>
                <p className="text-muted-foreground">
                  Standard approaches won't transform the industry. We seek people who think differently and aren't afraid to challenge conventional wisdom.
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="prose prose-stone max-w-none">
              <blockquote className="italic border-l-4 border-orange-400 pl-4 py-1">
                "The role is demanding. The expectations are clear: leading our multi-city procurement, inventory, logistics, and partner management strategy, designing frameworks that prevent stockouts and wastage, management of vendor relations to last-mile delivery - and this would be done with limited resources, and a lot of hustle—in the beginning."
              </blockquote>
            </div>
            
            <div className="prose prose-stone max-w-none">
              <blockquote className="italic border-l-4 border-orange-400 pl-4 py-1">
                "We're offering a structure that leans on value. You won't be walking into a plush seat. The first months will be an immersive co-leadership phase with stipend. After that, it transitions into full managerial role, plus other benefits tied to your office, milestones and impact."
              </blockquote>
            </div>
            
            <div className="mt-2">
              <p className="font-semibold">This isn't for everyone. But for the one who gets it, this is a rocketship ride into the future of supply chain in Africa.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Opportunities</CardTitle>
            <CardDescription>
              While we don't have open positions right now, we're building our talent pipeline for these future roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-md p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">Head of Supply Chain Operations</h3>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Nairobi, Kenya</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>Full-time</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Coming Q3 2025</span>
                      </div>
                    </div>
                  </div>
                  <Badge>Leadership</Badge>
                </div>
                
                <p className="mt-4 text-muted-foreground">
                  Leading our multi-city procurement, inventory, logistics, and partner management strategy. Designing frameworks that prevent stockouts and manage vendor relations to last-mile delivery.
                </p>
              </div>
              
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
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Coming Q3 2025</span>
                      </div>
                    </div>
                  </div>
                  <Badge>Growth</Badge>
                </div>
                
                <p className="mt-4 text-muted-foreground">
                  Spearheading our market expansion strategy. Building relationships with key supply chain stakeholders across Kenya and developing innovative partnership models.
                </p>
              </div>
              
              <div className="border rounded-md p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">Supply Chain Technology Specialist</h3>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Nairobi, Kenya</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>Full-time</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Coming Q4 2025</span>
                      </div>
                    </div>
                  </div>
                  <Badge>Tech</Badge>
                </div>
                
                <p className="mt-4 text-muted-foreground">
                  Implementing innovative tech solutions to streamline supply chain operations. Developing systems to improve visibility, traceability and efficiency across the entire supply chain.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="mb-4">
                Don't see a role that fits your skills? We're always looking for exceptional talent.
              </p>
              <Button variant="outline" className="min-w-[200px]">
                Express Interest
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                <p>
                  Our vision for SupplyChain_KE encapsulates reimagining how Kenyans access and manage supply chains—from port to customer, warehouse to doorstep, and procurement to delivery.
                </p>
                <p>
                  We're building the next era of distribution in Kenya - together with visionary professionals who understand both the challenges and opportunities in our market.
                </p>
                <p className="font-medium">
                  Let's build the next era of distribution - together.
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
