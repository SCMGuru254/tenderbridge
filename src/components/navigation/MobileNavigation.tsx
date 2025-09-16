
import { NavLink } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Home, 
  Briefcase, 
  MessageSquare, 
  Building2,
  BookOpen,
  Bot,
  Search
} from "lucide-react";

const MobileNavigation = () => {
  const navigationItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/hire-my-skill", label: "Hire My Skill", icon: Briefcase },
    { to: "/mentorship", label: "Mentorship", icon: BookOpen },
    { to: "/courses", label: "Courses", icon: BookOpen },
    { to: "/company-reviews", label: "Company Reviews", icon: Building2 },
    { to: "/discussions", label: "Discussions", icon: MessageSquare },
    { to: "/companies", label: "Companies", icon: Building2 },
    { to: "/company-signup", label: "Company Signup", icon: Building2 },
    { to: "/supply-chain-insights", label: "Insights", icon: BookOpen },
    { to: "/salary-analyzer", label: "Salary Analyzer", icon: BookOpen },
    { to: "/post-job", label: "Post Job", icon: BookOpen },
    { to: "/chat-assistant", label: "Chat Assistant", icon: Bot },
    { to: "/interview-prep", label: "Interview Prep", icon: Search },
    { to: "/ai-agents", label: "AI Agents", icon: Bot },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
