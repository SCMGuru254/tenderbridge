
import { useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const ResponsiveAppBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'News', path: '/' },
    { text: 'Jobs', path: '/jobs' },
    { text: 'Career Path', path: '/career' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {isMobile && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleDrawerToggle}>
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  {menuItems.map((item) => (
                    <RouterLink
                      key={item.text}
                      to={item.path}
                      onClick={handleDrawerToggle}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {item.text}
                    </RouterLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
          
          <RouterLink
            to="/"
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            TenderBridge
          </RouterLink>
          
          {!isMobile && (
            <nav className="flex space-x-6">
              {menuItems.map((item) => (
                <RouterLink
                  key={item.text}
                  to={item.path}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.text}
                </RouterLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default ResponsiveAppBar;
