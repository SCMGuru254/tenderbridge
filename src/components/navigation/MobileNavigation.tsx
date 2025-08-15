
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
        <nav className="mt-6 flex flex-row justify-between items-center gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center rounded-lg p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                style={{ flex: 1, minWidth: 0 }}
              >
                <Icon className="h-6 w-6" />
                {/* Optionally, add a tooltip for accessibility */}
                {/* <span className="sr-only">{item.label}</span> */}
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
