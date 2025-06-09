
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Briefcase, 
  Users, 
  MessageCircle, 
  CreditCard,
  Building2,
  FileText,
  Star
} from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/jobs", icon: Briefcase, label: "Jobs" },
    { path: "/companies", icon: Building2, label: "Companies" },
    { path: "/discussions", icon: MessageCircle, label: "Discussions" },
    { path: "/paypal-portal", icon: CreditCard, label: "PayPal Portal" },
    { path: "/profile", icon: Users, label: "Profile" },
    { path: "/document-generator", icon: FileText, label: "Documents" },
    { path: "/careers", icon: Star, label: "Careers" },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-primary">
            Supply Chain Hub
          </Link>
          
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

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
