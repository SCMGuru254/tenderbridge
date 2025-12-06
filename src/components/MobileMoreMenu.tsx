import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Bot,
  GraduationCap,
  LineChart,
  FileText,
  Star,
  User,
  Award,
  Building2,
  Settings
} from 'lucide-react';

interface MobileMoreMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMoreMenu({ open, onClose }: MobileMoreMenuProps) {
  const menuItems = [
    {
      href: '/hire-my-skill',
      label: 'Hire My Skill',
      icon: Star,
      description: 'Find or offer skills'
    },
    {
      href: '/ai-agents',
      label: 'AI Agents',
      icon: Bot,
      description: 'AI-powered career tools'
    },
    {
      href: '/interview-prep',
      label: 'Interview Prep',
      icon: GraduationCap,
      description: 'Practice interviews'
    },
    {
      href: '/documents',
      label: 'Documents',
      icon: FileText,
      description: 'CV & Cover Letters'
    },
    {
      href: '/mentorship',
      label: 'Mentorship',
      icon: User,
      description: 'Find mentors'
    },
    {
      href: '/careers',
      label: 'Careers',
      icon: Star,
      description: 'Join our team'
    },
    {
      href: '/rewards',
      label: 'Rewards',
      icon: Award,
      description: 'Earn points'
    },
    {
      href: '/hr-directory',
      label: 'HR Directory',
      icon: Building2,
      description: 'Find HR professionals'
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: LineChart,
      description: 'Job insights'
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
      description: 'Your profile'
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Settings,
      description: 'Your dashboard'
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>More Options</SheetTitle>
        </SheetHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-6 pb-6 max-h-[calc(80vh-100px)] overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-lg",
                  "bg-background hover:bg-accent transition-colors",
                  "border border-border hover:border-primary/20",
                  "min-h-[100px] text-center"
                )}
              >
                <Icon className="h-6 w-6 mb-2 text-primary" />
                <span className="font-medium text-sm">{item.label}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}