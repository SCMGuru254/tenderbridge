import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { MenuItem, navigationCategories, getBottomNavigationItems } from '@/config/navigation';

interface Props {
  className?: string;
}

const BottomNavigation: React.FC<Props> = ({ className }) => {
  const { user } = useAuth();
  const featureFlags = useFeatureFlags();
  const bottomNavItems = getBottomNavigationItems();
  
  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border md:hidden", className)}>
      <div className="flex items-center justify-around py-2 px-1">
        {bottomNavItems.map((item: MenuItem) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1.5",
                  "text-xs font-medium transition-colors",
                  "touch-manipulation", // Better touch targets
                  "relative py-1",
                  isActive
                    ? "text-primary after:absolute after:h-0.5 after:w-1/2 after:-bottom-[1px] after:bg-primary after:rounded-full"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="truncate">{item.title}</span>
            </NavLink>
          );
        })}
        
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
            <Menu className="h-6 w-6 mb-1.5" />
            <span>More</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <div className="grid gap-2 p-4 overflow-y-auto">
              {navigationCategories.map((category) => (
                <div key={category.name} className="grid gap-2">
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {category.items
                      .filter(item => {
                        if (item.featureFlag && !featureFlags[item.featureFlag as keyof typeof featureFlags]) return false;
                        if (item.requiredRole && !user) return false;
                        return true;
                      })
                      .map((item: MenuItem) => (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          className="flex flex-col p-4 rounded-lg bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3 mb-1">
                            <item.icon className="h-5 w-5 text-primary" />
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground pl-8">
                            {item.description}
                          </span>
                        </NavLink>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default BottomNavigation;