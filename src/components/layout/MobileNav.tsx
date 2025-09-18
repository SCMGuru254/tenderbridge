import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Menu,
  Home,
  Briefcase,
  Building,
  Star,
  GraduationCap,
  MessageCircle,
  User,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navigation: NavigationItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: <Home className="h-4 w-4" />
  },
  {
    title: 'Jobs',
    href: '/jobs',
    icon: <Briefcase className="h-4 w-4" />
  },
  {
    title: 'Companies',
    href: '/companies',
    icon: <Building className="h-4 w-4" />
  },
  {
    title: 'Reviews',
    href: '/reviews',
    icon: <Star className="h-4 w-4" />
  },
  {
    title: 'Courses',
    href: '/courses',
    icon: <GraduationCap className="h-4 w-4" />
  },
  {
    title: 'Discussions',
    href: '/discussions',
    icon: <MessageCircle className="h-4 w-4" />
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: <User className="h-4 w-4" />
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: ['admin', 'moderator', 'employer']
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />
  }
];

export const MobileNav = () => {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <ScrollArea className="h-full px-2">
          <div className="flex flex-col gap-4 py-4">
            {user && (
              <div className="flex items-center gap-2 px-4 py-2">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                // Skip items that require specific roles if user doesn't have them
                if (
                  item.roles?.length &&
                  !item.roles.some((role) =>
                    profile?.roles?.some((r) => r.role === role)
                  )
                ) {
                  return null;
                }

                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                );
              })}
            </div>

            {!user && (
              <div className="flex flex-col gap-2 px-4 mt-4">
                <Button asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/register" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};