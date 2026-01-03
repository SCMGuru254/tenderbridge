import {
  Home,
  Briefcase,
  GraduationCap,
  Building2,
  Bot,
  FileText,
  Users,
  Trophy,
  User,
  LayoutDashboard,
  MessageSquare,
  LineChart,
  Lightbulb,
  Network,
  Search,
  Bookmark,
  TrendingUp
} from 'lucide-react';

export interface MenuItem {
  title: string;
  description?: string;
  icon: any;
  href: string;
  label?: string;
  to?: string;
  visible?: boolean;
  requiredRole?: string[];
  category?: string;
  badge?: string;
  featureFlag?: string;
  showInBottomNav?: boolean;
}

export interface NavigationCategory {
  name: string;
  items: MenuItem[];
}

// Configuration for the bottom navigation bar - most frequently used items
export const bottomNavigation = [
  { icon: Home, label: 'Home', to: '/dashboard', showInBottomNav: true },
  { icon: Briefcase, label: 'Jobs', to: '/jobs', showInBottomNav: true },
  { icon: GraduationCap, label: 'Learn', to: '/courses', showInBottomNav: true },
  { icon: Building2, label: 'Companies', to: '/companies', showInBottomNav: true },
  { icon: Lightbulb, label: 'OBS', to: '/supply-chain-insights', showInBottomNav: true }
];

export const navigationCategories: NavigationCategory[] = [
  {
    name: 'Learning & Development',
    items: [
      {
        title: 'Courses',
        description: 'Browse supply chain courses',
        icon: GraduationCap,
        href: '/courses',
        category: 'learning',
        showInBottomNav: true
      },
      {
        title: 'Discussions',
        description: 'Join community discussions',
        icon: MessageSquare,
        href: '/discussions',
        category: 'learning'
      },
      {
        title: 'Supply Chain Insights',
        description: 'Industry news and analysis',
        icon: Lightbulb,
        href: '/supply-chain-insights',
        category: 'learning'
      },
      {
        title: 'Interview Prep',
        description: 'Practice interviews',
        icon: Search,
        href: '/interview-prep',
        category: 'learning'
      }
    ]
  },
  {
    name: 'AI Tools',
    items: [
      {
        title: 'AI Agents',
        description: 'AI-powered career tools',
        icon: Bot,
        href: '/ai-agents',
        featureFlag: 'enableAI',
        category: 'tools'
      },
      {
        title: 'Chat Assistant',
        description: 'Get AI help',
        icon: Bot,
        href: '/chat-assistant',
        featureFlag: 'enableAI',
        category: 'tools'
      },
      {
        title: 'Documents',
        description: 'CV & Cover Letters',
        icon: FileText,
        href: '/documents',
        featureFlag: 'enableDocuments',
        category: 'tools'
      }
    ]
  },
  {
    name: 'Career Growth',
    items: [
      {
        title: 'Mentorship',
        description: 'Find mentors',
        icon: Users,
        href: '/mentorship',
        featureFlag: 'enableMentorship',
        category: 'career'
      },
      {
        title: 'Hire My Skill',
        description: 'Showcase your talent',
        icon: Briefcase,
        href: '/hire-my-skill',
        category: 'career'
      },
      {
        title: 'Rewards',
        description: 'Earn points',
        icon: Trophy,
        href: '/rewards',
        category: 'career'
      },
      {
        title: 'Salary Analyzer',
        description: 'Compare salaries',
        icon: TrendingUp,
        href: '/salary-analyzer',
        category: 'career'
      }
    ]
  },
  {
    name: 'Professional Network',
    items: [
      {
        title: 'HR Directory',
        description: 'Find HR professionals',
        icon: Building2,
        href: '/hr-directory',
        featureFlag: 'enableHRDirectory',
        category: 'network'
      },
      {
        title: 'Analytics',
        description: 'Job insights',
        icon: LineChart,
        href: '/analytics',
        category: 'network'
      },
      {
        title: 'Networking',
        description: 'Build connections',
        icon: Network,
        href: '/networking',
        category: 'network'
      }
    ]
  },
  {
    name: 'Companies',
    items: [
      {
        title: 'Company Reviews',
        description: 'Read company reviews',
        icon: Building2,
        href: '/company-reviews',
        category: 'companies'
      },
      {
        title: 'Company Signup',
        description: 'Register your company',
        icon: Building2,
        href: '/company-signup',
        category: 'companies'
      },
      {
        title: 'Post Job',
        description: 'Post a job listing',
        icon: Bookmark,
        href: '/post-job',
        category: 'companies'
      }
    ]
  },
  {
    name: 'Account',
    items: [
      {
        title: 'Profile',
        description: 'Your profile',
        icon: User,
        href: '/profile',
        category: 'account'
      },
      {
        title: 'Dashboard',
        description: 'Your dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        showInBottomNav: true,
        category: 'account'
      },
      {
        title: 'My Applications',
        description: 'Track your jobs',
        icon: Briefcase,
        href: '/my-applications',
        category: 'account'
      }
    ]
  }
];

// Helper function to get bottom navigation items
export const getBottomNavigationItems = (): MenuItem[] => {
  const bottomNavItems = navigationCategories
    .flatMap(category => category.items)
    .filter(item => item.showInBottomNav);

  // Show up to 5 items in the bottom nav
  return bottomNavItems.slice(0, 5);
};

// Helper function to get menu items based on user roles and feature flags
export const getVisibleMenuItems = (
  userRoles: string[] = ['user'],
  featureFlags: Record<string, boolean> = {}
): MenuItem[] => {
  return navigationCategories
    .flatMap(category => category.items)
    .filter(item => {
      // Check feature flags
      if (item.featureFlag && !featureFlags[item.featureFlag]) {
        return false;
      }

      // Check required roles
      if (item.requiredRole && !item.requiredRole.some(role => userRoles.includes(role))) {
        return false;
      }

      return true;
    });
};

// Helper function to get menu items by category
export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return navigationCategories
    .flatMap(cat => cat.items)
    .filter(item => item.category === category);
};