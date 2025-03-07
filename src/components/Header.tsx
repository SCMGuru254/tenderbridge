
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, Truck, Package, Globe, Briefcase } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Companies", path: "/companies" },
    { name: "Discussions", path: "/discussions" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SupplyChain_KE</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative font-medium transition-colors hover:text-primary ${
                    isActive
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                      : "text-gray-700"
                  }`
                }
                onClick={closeMenu}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url} alt={user.email} />
                      <AvatarFallback>{user.email ? user.email[0].toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile">Profile</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/messages">Messages</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/settings">Settings</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <NavLink to="/auth">Sign In</NavLink>
                </Button>
                <Button asChild>
                  <NavLink to="/auth?register=true">Register</NavLink>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `py-2 font-medium transition-colors hover:text-primary ${
                      isActive ? "text-primary" : "text-gray-700"
                    }`
                  }
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              ))}
              
              {/* Mobile Auth Buttons or User Menu */}
              {user ? (
                <div className="border-t pt-4 mt-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url} alt={user.email} />
                      <AvatarFallback>{user.email ? user.email[0].toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <NavLink
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-primary"
                    onClick={closeMenu}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/messages"
                    className="block py-2 text-gray-700 hover:text-primary"
                    onClick={closeMenu}
                  >
                    Messages
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="block py-2 text-gray-700 hover:text-primary"
                    onClick={closeMenu}
                  >
                    Settings
                  </NavLink>
                  <button
                    className="block w-full text-left py-2 text-gray-700 hover:text-primary"
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 border-t pt-4 mt-2">
                  <Button variant="outline" asChild>
                    <NavLink to="/auth" onClick={closeMenu}>
                      Sign In
                    </NavLink>
                  </Button>
                  <Button asChild>
                    <NavLink to="/auth?register=true" onClick={closeMenu}>
                      Register
                    </NavLink>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
