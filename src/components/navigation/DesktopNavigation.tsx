
import React from "react";
import { Link, useLocation } from "react-router-dom";
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

interface DesktopNavigationProps {
  isActive: (path: string) => boolean;
  onItemClick: () => void;
}

export function DesktopNavigation({ isActive, onItemClick }: DesktopNavigationProps) {
  return (
    <>
      <MenubarContent className="min-w-[220px]">
        <MenubarItem asChild>
          <Link 
            to="/jobs" 
            className={isActive("/jobs") ? "bg-muted" : ""}
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

      <MenubarContent className="min-w-[220px]">
        <MenubarItem asChild>
          <Link to="/interview-prep" className={isActive("/interview-prep") ? "bg-muted" : ""} onClick={onItemClick}>
            <GraduationCap className="mr-2 h-4 w-4" />
            Interview Prep
          </Link>
        </MenubarItem>
        <MenubarItem asChild>
          <Link to="/document-generator" className={isActive("/document-generator") ? "bg-muted" : ""} onClick={onItemClick}>
            <FileText className="mr-2 h-4 w-4" />
            Document Generator
          </Link>
        </MenubarItem>
        <MenubarItem asChild>
          <Link to="/faq" className={isActive("/faq") ? "bg-muted" : ""} onClick={onItemClick}>
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </Link>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem asChild>
          <Link to="/free-services" className={isActive("/free-services") ? "bg-muted" : ""} onClick={onItemClick}>
            <Award className="mr-2 h-4 w-4" />
            Free Services
          </Link>
        </MenubarItem>
        <MenubarItem asChild>
          <Link to="/rewards" className={isActive("/rewards") ? "bg-muted" : ""} onClick={onItemClick}>
            <Award className="mr-2 h-4 w-4" />
            Rewards Program
          </Link>
        </MenubarItem>
      </MenubarContent>
    </>
  );
}
