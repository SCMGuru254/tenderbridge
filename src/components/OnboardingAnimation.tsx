
import { useEffect, useState } from "react";
import { Truck, Package, FileText, Briefcase, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const OnboardingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: Truck,
      title: "Streamline Your Supply Chain",
      description: "Connect with logistics professionals, manage shipments, and optimize your supply chain operations in Kenya and beyond.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Briefcase,
      title: "Find Supply Chain Opportunities",
      description: "Access specialized job listings in procurement, logistics, warehousing, transportation, and more across Kenya.",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Users,
      title: "Connect with Industry Professionals",
      description: "Build your network with supply chain professionals, share insights, and grow your career opportunities.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: FileText,
      title: "Stay Updated with Industry News",
      description: "Get the latest supply chain trends, disruptions, innovations, and best practices relevant to Kenya's market.",
      color: "bg-green-500/10 text-green-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 mt-16">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            SupplyChain_KE
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your complete platform for supply chain professionals in Kenya
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth?register=true")}>
                Join Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Animation Card */}
          <div className="order-2 md:order-1">
            <div className="relative h-[400px] flex justify-center items-center">
              {steps.map((step, index) => {
                const isActive = currentStep === index;
                const Icon = step.icon;
                
                return (
                  <Card
                    key={index}
                    className={`absolute w-full max-w-md p-8 transition-all duration-500 shadow-md ${
                      isActive
                        ? "opacity-100 translate-y-0 scale-100 z-10"
                        : "opacity-0 translate-y-8 scale-95 -z-10"
                    }`}
                  >
                    <div className={`rounded-full p-3 w-fit ${step.color} mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </Card>
                );
              })}
              
              {/* Step indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentStep === index ? "bg-primary" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="order-1 md:order-2 space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                    currentStep === index ? "bg-gray-100/80" : ""
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`rounded-full p-2 ${step.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
            
            <Button 
              variant="outline" 
              className="w-full mt-4 flex items-center justify-center"
              onClick={() => navigate("/jobs")}
            >
              Explore Jobs <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAnimation;
