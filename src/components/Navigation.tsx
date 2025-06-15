import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Award,
  DollarSign,
  Star,
  Bot,
  GraduationCap
} from 'lucide-react';

// Add Interview Prep and Job Matching nav if missing
const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/interview-prep', label: 'Interview Prep', icon: GraduationCap },
    { href: '/ai-agents', label: 'AI Agents', icon: Bot },
    { href: '/discussions', label: 'Discussions', icon: MessageSquare },
    { href: '/networking', label: 'Networking', icon: Users },
    { href: '/rewards', label: 'Rewards', icon: Award },
    { href: '/affiliate', label: 'Affiliate', icon: DollarSign },
    { href: '/featured-clients', label: 'Featured Services', icon: Star },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              SupplyChain Jobs
            </Link>
            <div className="hidden md:flex space-x-2 md:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            {/* Mobile nav: show horizontal scrollable list */}
            <div className="flex md:hidden overflow-x-auto space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[64px] px-2 py-1 rounded text-xs font-semibold transition-colors",
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5 mb-0.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
