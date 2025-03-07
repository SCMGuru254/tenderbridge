import {
  Home,
  Briefcase,
  Users,
  Settings,
  LogOut,
  UserPlus,
  Mail,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const { user, signOut } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: Briefcase,
    },
    {
      name: "Companies",
      path: "/companies",
      icon: Users,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: Mail, // Make sure to import Mail from lucide-react
    },
  ];

  const profileActions = [
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
    {
      name: "Sign Out",
      action: signOut,
      icon: LogOut,
    },
  ];

  return (
    <nav className="flex flex-col w-64 bg-gray-100 dark:bg-gray-900 p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-8">
        <span className="text-lg font-bold dark:text-white">Menu</span>
        {user ? (
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <NavLink to="/auth">
            <UserPlus className="w-6 h-6 dark:text-white" />
          </NavLink>
        )}
      </div>
      <ul className="flex-1 space-y-2">
        {navigationItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${
                  isActive
                    ? "bg-gray-200 dark:bg-gray-800 font-semibold"
                    : "dark:text-gray-400 dark:hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-2" />
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      {user && (
        <div className="mt-8">
          <ul className="space-y-2">
            {profileActions.map((item, index) => (
              <li key={index}>
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="flex items-center px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors w-full text-left"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className="flex items-center px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.name}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
