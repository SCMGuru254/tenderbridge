
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarSeparator, 
  MenubarTrigger 
} from "@/components/ui/menubar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Briefcase, 
  FileText, 
  Users, 
  MessageSquare, 
  BookOpen, 
  HelpCircle,
  Award,
  GraduationCap,
  Building,
  ShieldCheck
} from "lucide-react";

// Simple media query hook inline to avoid import issues
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function SiteNavigation() {
  const location = useLocation();
  const { user } = useAuth();
  const [activeSection] = useState("platform");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Close menu when clicking outside on mobile
  useEffect(() => {
    if (isMobile) {
      const handleClickOutside = () => {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isMobile, isMenuOpen]);

  // Handle menu item click on mobile
  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <Menubar className={`border-none bg-transparent px-0 ${isMobile ? 'flex-wrap gap-2' : ''}`}>
        <MenubarMenu>
          <MenubarTrigger 
            className={`${activeSection === "platform" ? "font-bold text-primary" : ""} ${isMobile ? "py-2 px-3" : ""}`}
            onClick={() => isMobile && setIsMenuOpen(!isMenuOpen)}
          >
            Platform
          </MenubarTrigger>
          <MenubarContent className="min-w-[220px]">
            <MenubarItem asChild>
              <Link 
                to="/jobs" 
                className={`${isActive("/jobs") ? "bg-muted" : ""} ${isMobile ? "py-3" : ""}`}
                onClick={handleMenuItemClick}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Jobs
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/companies" className={isActive("/companies") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <Building className="mr-2 h-4 w-4" />
                Companies
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/discussions" className={isActive("/discussions") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Discussions
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/blog" className={isActive("/blog") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <BookOpen className="mr-2 h-4 w-4" />
                Blog
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className={activeSection === "resources" ? "font-bold text-primary" : ""}>
            Resources
          </MenubarTrigger>
          <MenubarContent className="min-w-[220px]">
            <MenubarItem asChild>
              <Link to="/interview-prep" className={isActive("/interview-prep") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Interview Prep
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/document-generator" className={isActive("/document-generator") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <FileText className="mr-2 h-4 w-4" />
                Document Generator
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/faq" className={isActive("/faq") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQ
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem asChild>
              <Link to="/free-services" className={isActive("/free-services") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <Award className="mr-2 h-4 w-4" />
                Free Services
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/rewards" className={isActive("/rewards") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <Award className="mr-2 h-4 w-4" />
                Rewards Program
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className={activeSection === "user" ? "font-bold text-primary" : ""}>
            Account
          </MenubarTrigger>
          <MenubarContent className="min-w-[220px]">
            {user ? (
              <>
                <MenubarItem asChild>
                  <Link to="/profile" className={isActive("/profile") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link to="/messages" className={isActive("/messages") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </MenubarItem>
              </>
            ) : (
              <MenubarItem asChild>
                <Link to="/auth" onClick={handleMenuItemClick}>
                  <Users className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </MenubarItem>
            )}
            <MenubarSeparator />
            <MenubarItem asChild>
              <Link to="/security" className={isActive("/security") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Security
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/privacy" className={isActive("/privacy") ? "bg-muted" : ""} onClick={handleMenuItemClick}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Privacy Policy
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
