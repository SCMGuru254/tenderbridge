import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  Briefcase, Home, MessageSquare, BookOpen, 
  LogIn, User, BookOpenCheck, HelpCircle, Menu, Shield, FileText
} from "lucide-react";

const Navigation = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user, loading, signOut } = useUser();

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [window.location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { to: "/", icon: <Home size={18} />, label: "Home" },
    { to: "/jobs", icon: <Briefcase size={18} />, label: "Jobs" },
    { to: "/discussions", icon: <MessageSquare size={18} />, label: "Discussions" },
    { to: "/blog", icon: <BookOpen size={18} />, label: "Blog" },
    { to: "/interview-prep", icon: <BookOpenCheck size={18} />, label: "Interview Prep" },
    { to: "/faq", icon: <HelpCircle size={18} />, label: "FAQ" },
    {
      label: "Document Generator",
      href: "/document-generator",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  const accountItems = [
    { to: "/post-job", icon: <Briefcase size={18} />, label: "Post a Job", authRequired: false },
    { to: "/messages", icon: <MessageSquare size={18} />, label: "Messages", authRequired: true },
    { to: "/security", icon: <Shield size={18} />, label: "Security", authRequired: true },
  ];

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-2 bg-primary text-white rounded-full z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={18} />
      </Button>
      
      <div 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 bg-white 
          shadow-md z-40 ${isOpen ? (isMobile ? "w-64" : "w-64") : "w-0"}`}
      >
        <div className={`h-full flex flex-col overflow-y-auto ${!isOpen ? "invisible" : "visible"}`}>
          <div className="p-4 flex-1">
            <h2 className="text-lg font-semibold mb-4 px-2">Navigation</h2>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            
            <h2 className="text-lg font-semibold mt-8 mb-4 px-2">Account</h2>
            <nav className="space-y-1">
              {accountItems
                .filter(item => !item.authRequired || (item.authRequired && user))
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 rounded-md transition-colors ${
                        isActive 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))
              }
            </nav>
          </div>
          
          <div className="p-4 border-t">
            {loading ? (
              <div className="flex items-center px-3 py-2">
                <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center px-3 py-2 text-sm text-gray-700">
                  <User size={18} className="mr-3" />
                  <span className="truncate">Signed in</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={signOut}
                >
                  <LogIn size={18} className="mr-2 rotate-180" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <NavLink to="/auth">
                <Button className="w-full">
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
      
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`${isOpen && !isMobile ? "ml-64" : "ml-0"} transition-all duration-300`}>
        {/* This is where the App content will be rendered */}
      </div>
    </>
  );
};

export default Navigation;
