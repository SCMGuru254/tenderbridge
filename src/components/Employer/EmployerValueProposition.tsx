import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Zap,
  Gift,
  Shield,
  BarChart3
} from 'lucide-react';

export function EmployerValueProposition() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
            🏢 FOR EMPLOYERS
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Hire the Best <span className="text-green-400">Supply Chain Talent</span> in Kenya
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Stop wasting time calling 10 people — post once, get many quality applicants. 
            Free to post, boost only if you want more visibility.
          </p>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Gift,
              title: 'Free Forever',
              description: 'Post jobs at no cost. Boost only when you need more applicants.',
              color: 'text-green-400 bg-green-400/10'
            },
            {
              icon: Users,
              title: 'Quality Candidates',
              description: 'Access pre-screened supply chain professionals.',
              color: 'text-blue-400 bg-blue-400/10'
            },
            {
              icon: Clock,
              title: 'Fast Hiring',
              description: 'Fill positions 50% faster with our targeted platform.',
              color: 'text-purple-400 bg-purple-400/10'
            },
            {
              icon: BarChart3,
              title: 'Analytics',
              description: 'Track views, applications, and candidate quality.',
              color: 'text-orange-400 bg-orange-400/10'
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-400">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pricing Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Simple, Transparent Pricing</h3>
            <p className="text-slate-400">Free to post, affordable to boost</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {/* Free */}
            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <div className="text-center">
                <Gift className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">FREE</div>
                <div className="text-sm text-green-400">Basic Job Post</div>
                <div className="text-xs text-slate-400 mt-2">30 days visibility</div>
              </div>
            </div>

            {/* Standard */}
            <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
              <div className="text-center">
                <Zap className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">KES 200</div>
                <div className="text-sm text-blue-400">Standard Boost</div>
                <div className="text-xs text-slate-400 mt-2">7-day featured</div>
              </div>
            </div>

            {/* Pro */}
            <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">KES 500</div>
                <div className="text-sm text-purple-400">Pro Boost (5 jobs)</div>
                <div className="text-xs text-slate-400 mt-2">KES 100/job</div>
              </div>
            </div>

            {/* Ultimate */}
            <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30">
              <div className="text-center">
                <Shield className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">KES 2,500</div>
                <div className="text-sm text-orange-400">Ultimate (Lifetime)</div>
                <div className="text-xs text-slate-400 mt-2">Permanent top spot</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-center">
          {[
            { value: '500+', label: 'Employers Trust Us' },
            { value: '10K+', label: 'Jobs Posted' },
            { value: '50K+', label: 'Applications Sent' },
            { value: '98%', label: 'Satisfaction Rate' }
          ].map((stat, index) => (
            <div key={index} className="px-6">
              <div className="text-3xl font-bold text-green-400">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/post-job">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8">
              <Briefcase className="mr-2 h-5 w-5" />
              Post a Job FREE
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/employer/dashboard">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <BarChart3 className="mr-2 h-5 w-5" />
              Employer Dashboard
            </Button>
          </Link>
        </div>

        {/* Quote */}
        <p className="text-center text-slate-400 mt-8 italic">
          "Perfect for small shops, farms, schools, transporters, and big companies — all in one platform."
        </p>
      </div>
    </section>
  );
}
