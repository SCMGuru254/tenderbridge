
import React from "react";
import { Link } from "react-router-dom";
import { 
  MenubarContent, 
  MenubarItem, 
  MenubarSeparator 
} from "@/components/ui/menubar";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  MessageSquare, 
  ShieldCheck
} from "lucide-react";

interface NavigationMenusProps {
  isActive: (path: string) => boolean;
  onItemClick: () => void;
}

export function NavigationMenus({ isActive, onItemClick }: NavigationMenusProps) {
  const { user } = useAuth();

  return (
    <MenubarContent className="min-w-[220px]">
      {user ? (
        <>
          <MenubarItem asChild>
            <Link to="/profile" className={isActive("/profile") ? "bg-muted" : ""} onClick={onItemClick}>
              <Users className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/messages" className={isActive("/messages") ? "bg-muted" : ""} onClick={onItemClick}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>
          </MenubarItem>
        </>
      ) : (
        <MenubarItem asChild>
          <Link to="/auth" onClick={onItemClick}>
            <Users className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </MenubarItem>
      )}
      <MenubarSeparator />
      <MenubarItem asChild>
        <Link to="/security" className={isActive("/security") ? "bg-muted" : ""} onClick={onItemClick}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Security
        </Link>
      </MenubarItem>
      <MenubarItem asChild>
        <Link to="/privacy" className={isActive("/privacy") ? "bg-muted" : ""} onClick={onItemClick}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Privacy Policy
        </Link>
      </MenubarItem>
    </MenubarContent>
  );
}
