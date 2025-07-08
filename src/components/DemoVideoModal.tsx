
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X, Pause } from "lucide-react";
import { useState, useEffect } from "react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoModal = ({ isOpen, onClose }: DemoVideoModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Welcome to SupplyChain Jobs",
      content: "Your gateway to premium supply chain opportunities in Kenya",
      bg: "from-blue-500 to-purple-600"
    },
    {
      title: "Smart Job Matching",
      content: "AI-powered recommendations based on your skills and preferences",
      bg: "from-green-500 to-blue-500"
    },
    {
      title: "Professional Network",
      content: "Connect with industry experts and build meaningful relationships",
      bg: "from-purple-500 to-pink-500"
    },
    {
      title: "Career Growth Tools",
      content: "Access mentorship, salary insights, and interview preparation",
      bg: "from-orange-500 to-red-500"
    },
    {
      title: "Get Started Today",
      content: "Join thousands of professionals who found their dream jobs",
      bg: "from-indigo-500 to-purple-500"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">SupplyChain Jobs Platform Demo</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Animated Demo Area */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${demoSteps[currentStep].bg} transition-all duration-1000 opacity-90`}
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-8">
              <div className="text-center transform transition-all duration-500">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 animate-fade-in">
                  {demoSteps[currentStep].title}
                </h3>
                <p className="text-lg lg:text-xl opacity-90 animate-fade-in">
                  {demoSteps[currentStep].content}
                </p>
              </div>
              
              {/* Progress indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full w-16 h-16"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Demo Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Smart Job Matching</h4>
              <p className="text-blue-700 text-sm">
                Our AI matches you with the most relevant supply chain opportunities based on your skills and preferences.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">📈 Career Growth Tools</h4>
              <p className="text-green-700 text-sm">
                Access mentorship programs, salary insights, and interview preparation resources.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">🤝 Professional Network</h4>
              <p className="text-purple-700 text-sm">
                Connect with industry experts and build meaningful professional relationships.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">💼 Real-Time Opportunities</h4>
              <p className="text-orange-700 text-sm">
                Get notified instantly when new jobs matching your criteria are posted.
              </p>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Ready to Transform Your Career?</h3>
            <p className="text-gray-600 mb-4">
              Join thousands of supply chain professionals who have found their dream jobs through our platform.
            </p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
              Get Started Free
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
