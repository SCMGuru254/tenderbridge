import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Bot,
  GraduationCap,
  LineChart,
  Menu
} from 'lucide-react';
import { MobileMoreMenu } from './MobileMoreMenu';

export function MobileNavigation() {
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mobileNavItems = [
    {
      href: '/ai-agents',
      label: 'AI Tools',
      icon: Bot,
      description: 'AI-powered job tools'
    },
    {
      href: '/interview-prep',
      label: 'Practice',
      icon: GraduationCap,
      description: 'Interview practice'
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: LineChart,
      description: 'Your insights'
    }
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden animate-slide-up">
        <div className="grid grid-cols-4 h-16">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1",
                  "transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                  "active:scale-95",
                  isActive && "text-primary bg-primary/5"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110"
                )} />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center space-y-1 hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>

      <MobileMoreMenu
        open={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
      />
    </>
  );
}

