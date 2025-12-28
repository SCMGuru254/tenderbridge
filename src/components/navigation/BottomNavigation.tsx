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
    <nav className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border md:hidden", className)}>
      <div className="flex items-center justify-between py-1 px-1 max-w-md mx-auto overflow-hidden">
        {bottomNavItems.map((item: MenuItem) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center min-w-[50px] flex-shrink-0 flex-1 py-1",
                  "text-[9px] font-medium transition-colors leading-tight",
                  "touch-manipulation",
                  "relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4 mb-0.5" />
              <span className="truncate w-full text-center px-0.5">{item.title}</span>
            </NavLink>
          );
        })}
        
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center min-w-[50px] flex-shrink-0 flex-1 py-1 text-[9px] font-medium text-muted-foreground hover:text-foreground transition-colors touch-manipulation leading-tight">
            <Menu className="h-4 w-4 mb-0.5" />
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