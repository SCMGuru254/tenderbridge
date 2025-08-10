
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Briefcase, 
  Users, 
  MessageCircle, 
  CreditCard,
  Building2,
  Star
} from "lucide-react";

export const DesktopNavigation = () => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/jobs", icon: Briefcase, label: "Jobs" },
    { path: "/companies", icon: Building2, label: "Companies" },
    { path: "/company-signup", icon: Building2, label: "Company Signup" },
    { path: "/discussions", icon: MessageCircle, label: "Discussions" },
    { path: "/paypal-portal", icon: CreditCard, label: "PayPal Portal" },
    { path: "/profile", icon: Users, label: "Profile" },
    { path: "/careers", icon: Star, label: "Careers" },
  ];

  return (
    <div className="hidden md:flex space-x-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActivePath(item.path) ? "default" : "ghost"}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default DesktopNavigation;
