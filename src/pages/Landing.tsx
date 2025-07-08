
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Briefcase, TrendingUp, Star, Play, CheckCircle, Target, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoVideoModal } from "@/components/DemoVideoModal";

const Landing = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      title: "Smart Job Matching",
      description: "AI-powered job recommendations tailored to your supply chain expertise and career goals."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Professional Network",
      description: "Connect with industry leaders, mentors, and peers in the supply chain community."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Career Growth",
      description: "Access exclusive training, mentorship programs, and career development resources."
    },
    {
      icon: <Star className="h-8 w-8 text-orange-600" />,
      title: "Premium Opportunities",
      description: "Discover exclusive job openings from top companies in Kenya and across East Africa."
    }
  ];

  const stats = [
    { number: "5,000+", label: "Active Job Seekers" },
    { number: "500+", label: "Partner Companies" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Kenya's #1 Supply Chain Job Platform
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Dream 
              <span className="text-primary block">Supply Chain Job</span>
              in Kenya
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with top employers, access exclusive opportunities, and accelerate your career 
              in supply chain management, logistics, and procurement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link to="/auth">
                  <Target className="h-5 w-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => setShowDemoModal(true)}
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SupplyChain Jobs?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another job board. We're your career acceleration platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-gray-50">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Join Thousands of Successful Professionals
            </h2>
            <p className="text-xl mb-8 opacity-90">
              "SupplyChain Jobs helped me land my dream role as a Logistics Manager at a Fortune 500 company. 
              The platform's personalized approach made all the difference."
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-semibold">4.9/5 from 2,500+ reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join our community of supply chain professionals and discover opportunities 
            that align with your goals and aspirations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90">
              <Link to="/auth">
                <CheckCircle className="h-5 w-5 mr-2" />
                Start Your Journey
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900">
              <Link to="/jobs">
                <Briefcase className="h-5 w-5 mr-2" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Video Modal */}
      <DemoVideoModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
      />
    </div>
  );
};

export default Landing;
