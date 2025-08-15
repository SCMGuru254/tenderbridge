import { useNavigate } from 'react-router-dom';
import {
  Bot,
  FileText,
  Users,
  Building2,
  Briefcase,
  MessagesSquare,
  GraduationCap,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const useNavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Feature flags from environment
  const featureFlags = {
    enableAI: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
    enableDocuments: import.meta.env.VITE_ENABLE_DOCUMENT_MANAGEMENT === 'true',
    enableMentorship: import.meta.env.VITE_ENABLE_MENTORSHIP === 'true',
    enableHRDirectory: import.meta.env.VITE_ENABLE_HR_DIRECTORY === 'true',
  };

  const mainNav = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Menu,
      visible: !!user,
    },
    {
      title: "Jobs",
      href: "/jobs",
      icon: Briefcase,
      visible: true,
    },
    {
      title: "Companies",
      href: "/companies",
      icon: Building2,
      visible: true,
    },
    {
      title: "Documents",
      href: "/documents",
      icon: FileText,
      visible: !!user && featureFlags.enableDocuments,
    },
    {
      title: "HR Directory",
      href: "/hr-directory",
      icon: Users,
      visible: !!user && featureFlags.enableHRDirectory,
    },
    {
      title: "Mentorship",
      href: "/mentorship",
      icon: GraduationCap,
      visible: !!user && featureFlags.enableMentorship,
    },
    {
      title: "AI Assistant",
      href: "/ai-chat",
      icon: Bot,
      visible: !!user && featureFlags.enableAI,
    },
    {
      title: "Discussions",
      href: "/discussions",
      icon: MessagesSquare,
      visible: !!user,
    },
    {
      title: "Hire My Skill",
      href: "/hire-my-skill",
      icon: Building2,
      visible: true,
    },
  ];

  return {
    mainNav,
    navigate,
  };
};
