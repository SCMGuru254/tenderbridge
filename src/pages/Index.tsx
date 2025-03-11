import OnboardingAnimation from "@/components/OnboardingAnimation";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { ArrowRight, Package, Truck, FileText, Users, Briefcase } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <OnboardingAnimation />
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
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
                color: "text-primary bg-primary/10"
              },
              {
                icon: Users,
                title: "Professional Network",
                description: "Connect with industry leaders and peers",
                color: "text-secondary bg-secondary/10"
              },
              {
                icon: FileText,
                title: "Industry Insights",
                description: "Access the latest supply chain news and analysis",
                color: "text-accent bg-accent/10"
              },
              {
                icon: Truck,
                title: "Resource Hub",
                description: "Leverage tools tailored for supply chain management",
                color: "text-green-500 bg-green-500/10"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="rounded-lg p-6 text-center hover:shadow-md transition-shadow animate-fade-in">
                  <div className={`mx-auto rounded-full p-3 w-fit ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Your Journey Today</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of supply chain professionals in Kenya and take your career to the next level.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <NavLink to="/jobs">
                Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </NavLink>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <NavLink to="/post-job">Post a Job</NavLink>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
