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
  TrendingUp,
  Search,
  LayoutGrid,
  ChevronDown,
  Trophy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DesktopNavigation = () => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex items-center space-x-1">
      <Link to="/">
        <Button variant={isActivePath("/") ? "default" : "ghost"} size="sm" className="gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </Link>

      <Link to="/jobs">
        <Button variant={isActivePath("/jobs") ? "default" : "ghost"} size="sm" className="gap-2">
          <Briefcase className="h-4 w-4" />
          Jobs
        </Button>
      </Link>

      <Link to="/companies">
        <Button variant={isActivePath("/companies") ? "default" : "ghost"} size="sm" className="gap-2">
          <Building2 className="h-4 w-4" />
          Companies
        </Button>
      </Link>

      {/* Services Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Services
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <Link to="/documents">
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </DropdownMenuItem>
          </Link>
          <Link to="/salary-analyzer">
            <DropdownMenuItem>
              <TrendingUp className="h-4 w-4 mr-2" />
              Salary Analyzer
            </DropdownMenuItem>
          </Link>
          <Link to="/interview-prep">
            <DropdownMenuItem>
              <Search className="h-4 w-4 mr-2" />
              Interview Prep
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link to="/rewards">
        <Button variant={isActivePath("/rewards") ? "default" : "ghost"} size="sm" className="gap-2">
          <Trophy className="h-4 w-4" />
          Rewards
        </Button>
      </Link>

      <Link to="/discussions">
        <Button variant={isActivePath("/discussions") ? "default" : "ghost"} size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Discussions
        </Button>
      </Link>

      <Link to="/paypal-portal">
        <Button variant={isActivePath("/paypal-portal") ? "default" : "ghost"} size="sm" className="gap-2">
          <CreditCard className="h-4 w-4" />
          PayPal
        </Button>
      </Link>

      <Link to="/profile">
        <Button variant={isActivePath("/profile") ? "default" : "ghost"} size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Profile
        </Button>
      </Link>

      <Link to="/company-signup">
        <Button variant={isActivePath("/company-signup") ? "default" : "ghost"} size="sm" className="gap-2">
          <Building2 className="h-4 w-4" />
          Post Job
        </Button>
      </Link>
    </div>
  );
};

export default DesktopNavigation;
