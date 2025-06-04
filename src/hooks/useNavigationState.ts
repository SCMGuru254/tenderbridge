
import { useState, useEffect } from "react";

export function useNavigationState(isMobile: boolean) {
  const [activeSection, setActiveSection] = useState("platform");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return {
    activeSection,
    setActiveSection,
    isMenuOpen,
    setIsMenuOpen,
    handleMenuItemClick
  };
}
