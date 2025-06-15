
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
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              SupplyChain Jobs
            </Link>
            
            {/* Desktop Navigation */}
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
          </div>
        </div>
        
        {/* Mobile Navigation - Horizontal scrollable at bottom */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 pb-2 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[80px] px-3 py-2 rounded-lg text-xs font-medium transition-colors touch-manipulation",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
