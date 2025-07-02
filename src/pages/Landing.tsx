
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Star,
  CheckCircle,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: <Briefcase className="h-6 w-6" />, title: "20+ Job Sources", desc: "Access jobs from multiple platforms" },
    { icon: <Users className="h-6 w-6" />, title: "AI Matching", desc: "Get personalized job recommendations" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Career Growth", desc: "Mentorship and skill development" },
    { icon: <Star className="h-6 w-6" />, title: "Expert Network", desc: "Connect with industry professionals" }
  ];

  const stats = [
    { number: "10,000+", label: "Active Jobs" },
    { number: "5,000+", label: "Professionals" },
    { number: "500+", label: "Companies" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Badge className="mb-4 animate-pulse" variant="secondary">
              🚀 Kenya's Leading Supply Chain Job Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Launch Your
              <br />
              Supply Chain Career
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with top employers, find your dream job, and accelerate your career 
              in supply chain, logistics, and procurement across Kenya and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/jobs')}
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Find Jobs Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-3 rounded-full border-2 hover:bg-gray-50 transition-all duration-300"
                onClick={() => navigate('/onboarding')}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Animated Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From job discovery to career advancement, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-lg transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'animate-fade-in' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of supply chain professionals who have found their dream jobs through our platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-3 rounded-full bg-white text-orange-600 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300"
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
