
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, MessageSquare, Building2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigation } from '@/hooks/useNavigation';

const BottomNavigation = () => {
  const { mainNav } = useNavigation();

  const primaryNavItems = [
    { icon: Home, label: 'Home', to: '/dashboard' },
    { icon: Briefcase, label: 'Jobs', to: '/jobs' },
    { icon: MessageSquare, label: 'Discussions', to: '/discussions' },
    { icon: Building2, label: 'Companies', to: '/companies' },
  ];

  const moreItems = mainNav.filter(item => 
    item.visible && 
    !primaryNavItems.some(primary => primary.to === item.href)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-4 pb-safe-area-inset-bottom">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center p-2 min-w-0 flex-1",
                  "text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
        
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center p-2 min-w-0 flex-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Menu className="h-5 w-5 mb-1" />
            <span>More</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 p-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-card hover:bg-accent transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BottomNavigation;