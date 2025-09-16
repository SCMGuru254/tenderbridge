import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Briefcase, Users, BookOpen, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';
import appIcon from '@/assets/app-icon.png';

export default function OnboardingComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a flag that onboarding is complete
    localStorage.setItem('onboarding_completed', 'true');
  }, []);

  const dashboards = [
    {
      title: 'Jobs Dashboard',
      description: 'Find and apply for supply chain positions',
      icon: Briefcase,
      path: '/jobs',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Mentorship Program',
      description: 'Connect with industry experts',
      icon: Users,
      path: '/mentorship',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Learning Courses',
      description: 'Advance your skills with professional courses',
      icon: BookOpen,
      path: '/courses',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Supply Chain Insights',
      description: 'Stay updated with industry news and trends',
      icon: TrendingUp,
      path: '/supply-chain-insights',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src={appIcon} 
                  alt="Supply Chain Jobs App" 
                  className="w-20 h-20 rounded-2xl shadow-lg"
                />
                <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-green-500 bg-white rounded-full" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to Your Supply Chain Career Hub! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              You're all set! Explore our comprehensive platform designed to accelerate your supply chain career with jobs, mentorship, courses, and industry insights.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 rounded-full px-6 py-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Profile Created</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 rounded-full px-6 py-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Preferences Set</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 rounded-full px-6 py-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Ready to Go</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboards Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Your Dashboards
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Each dashboard is designed to help you advance your supply chain career. Start exploring!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboards.map((dashboard, index) => {
            const Icon = dashboard.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => navigate(dashboard.path)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${dashboard.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {dashboard.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {dashboard.description}
                  </p>
                  <div className="flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium mr-2">Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Quick Actions to Get Started
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">🎯 Find Your Next Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Browse thousands of supply chain job opportunities</p>
                <Button 
                  onClick={() => navigate('/jobs')}
                  className="w-full"
                  variant="outline"
                >
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">🚀 Skill Up</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Take professional courses to advance your career</p>
                <Button 
                  onClick={() => navigate('/courses')}
                  className="w-full"
                  variant="outline"
                >
                  Explore Courses
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-purple-600 dark:text-purple-400">🎓 Get Mentored</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Connect with industry experts for guidance</p>
                <Button 
                  onClick={() => navigate('/mentorship')}
                  className="w-full"
                  variant="outline"
                >
                  Find Mentors
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="px-8 py-4 text-lg font-semibold"
          >
            Go to Main Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}