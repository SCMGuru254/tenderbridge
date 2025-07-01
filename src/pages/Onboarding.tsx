
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useAppSettings();

  const steps = [
    {
      title: "Welcome to SupplyChain Jobs",
      description: "Let's get you set up for success in supply chain careers",
      component: "welcome"
    },
    {
      title: "What interests you most?",
      description: "Select areas you'd like to focus on",
      component: "interests"
    },
    {
      title: "Your experience level",
      description: "Help us personalize your job recommendations",
      component: "experience"
    },
    {
      title: "You're all set!",
      description: "Welcome to the supply chain community",
      component: "complete"
    }
  ];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if (user) {
      // Save preferences to profile
      await supabase
        .from('profiles')
        .update({
          tagline: selectedExperience,
          bio: `Interested in: ${selectedInterests.join(', ')}`
        })
        .eq('id', user.id);
    }
    navigate('/dashboard');
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {steps[currentStep].component === "welcome" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-lg">
                Discover amazing supply chain opportunities in Kenya and beyond
              </p>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Access to 20+ job sources
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  AI-powered job matching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Interview preparation tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Professional community
                </li>
              </ul>
            </div>
          )}

          {steps[currentStep].component === "interests" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {settings.supply_chain_tags.map((interest) => (
                  <Button
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    onClick={() => handleInterestToggle(interest)}
                    className="h-auto p-3 text-left justify-start"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Select as many as you like - you can change these later
              </p>
            </div>
          )}

          {steps[currentStep].component === "experience" && (
            <div className="space-y-4">
              {settings.experience_levels.map((level) => (
                <Button
                  key={level.id}
                  variant={selectedExperience === level.id ? "default" : "outline"}
                  onClick={() => setSelectedExperience(level.id)}
                  className="w-full h-auto p-4 text-left justify-start"
                >
                  {level.label}
                </Button>
              ))}
            </div>
          )}

          {steps[currentStep].component === "complete" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg">
                You're ready to start your supply chain journey!
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Your preferences:</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Interests:</strong> {selectedInterests.join(', ') || 'None selected'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Experience:</strong> {settings.experience_levels.find(l => l.id === selectedExperience)?.label || 'Not specified'}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && selectedInterests.length === 0) ||
                  (currentStep === 2 && !selectedExperience)
                }
              >
                Next
                <ArrowRight className="w-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
