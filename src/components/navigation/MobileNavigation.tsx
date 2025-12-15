import { NavLink } from 'react-router-dom';
import { Menu, Star, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useNavigation } from '@/contexts/NavigationContext';
import {
  navigationCategories,
  MenuItem,
  NavigationCategory,
  getBottomNavigationItems
} from '@/config/navigation';

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const { user } = useAuth();
  const featureFlags = useFeatureFlags();
  const {
    state,
    toggleDrawer,
    addFavorite,
    removeFavorite,
    isFavorite,
    isCategoryHidden
  } = useNavigation();
  const bottomNavItems = getBottomNavigationItems();

  // Function to check if an item should be visible based on feature flags and roles
  const isItemVisible = (item: MenuItem): boolean => {
    if (item.featureFlag && !featureFlags[item.featureFlag as keyof typeof featureFlags]) {
      return false;
    }
    if (item.requiredRole && !user) {
      return false;
    }
    return true;
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border md:hidden",
        className
      )}>
        <div className="flex items-center justify-around pb-6 pt-2 px-1">
          {bottomNavItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1.5",
                    "text-xs font-medium transition-colors",
                    "touch-manipulation",
                    "relative py-1",
                    isActive
                      ? "text-primary after:absolute after:h-0.5 after:w-1/2 after:-bottom-[1px] after:bg-primary after:rounded-full"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                <Icon className="h-5 w-5 mb-0.5" />
                <span className="truncate text-[10px]">{item.title}</span>
              </NavLink>
            );
          })}

          {/* Side Drawer Menu */}
          <Sheet open={state.isDrawerOpen} onOpenChange={toggleDrawer}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                <Menu className="h-6 w-6 mb-0.5" />
                <span>More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-6">
                {navigationCategories
                  .filter(category => !isCategoryHidden(category.name))
                  .map((category: NavigationCategory) => (
                    <div key={category.name}>
                      <h3 className="px-3 text-sm font-medium text-muted-foreground mb-2">
                        {category.name}
                      </h3>
                      <div className="space-y-1">
                        {category.items
                          .filter(isItemVisible)
                          .map((item: MenuItem) => (
                            <div key={item.href} className="flex items-center">
                              <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                  cn(
                                    "flex-1 flex items-center space-x-3 rounded-lg px-3 py-2",
                                    "text-sm font-medium transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                                  )
                                }
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </NavLink>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => {
                                  if (isFavorite(item.href)) {
                                    removeFavorite(item.href);
                                  } else {
                                    addFavorite(item.href);
                                  }
                                }}
                              >
                                {isFavorite(item.href) ? (
                                  <Star className="h-4 w-4 text-yellow-400" />
                                ) : (
                                  <StarOff className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;