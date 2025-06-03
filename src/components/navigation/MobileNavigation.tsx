
import React from "react";
import { Link } from "react-router-dom";
import { 
  MenubarContent, 
  MenubarItem, 
  MenubarSeparator 
} from "@/components/ui/menubar";
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

interface MobileNavigationProps {
  isActive: (path: string) => boolean;
  onItemClick: () => void;
}

export function MobileNavigation({ isActive, onItemClick }: MobileNavigationProps) {
  return (
    <>
      <MenubarContent className="min-w-[220px]">
        <MenubarItem asChild>
          <Link 
            to="/jobs" 
            className={`${isActive("/jobs") ? "bg-muted" : ""} py-3`}
            onClick={onItemClick}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Jobs
          </Link>
        </MenubarItem>
        <MenubarItem asChild>
          <Link to="/companies" className={isActive("/companies") ? "bg-muted" : ""} onClick={onItemClick}>
            <Building className="mr-2 h-4 w-4" />
            Companies
          </Link>
        </MenubarItem>
        <MenubarItem asChild>
          <Link to="/discussions" className={isActive("/discussions") ? "bg-muted" : ""} onClick={onItemClick}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </Link>
        </MenubarItem>
        <MenubarItem asChild>
          <Link to="/blog" className={isActive("/blog") ? "bg-muted" : ""} onClick={onItemClick}>
            <BookOpen className="mr-2 h-4 w-4" />
            Blog
          </Link>
        </MenubarItem>
      </MenubarContent>
    </>
  );
}
