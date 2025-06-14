
import { useState, useEffect } from 'react';
import { Logo } from './header/Logo';
import UserMenu from './header/UserMenu';
import { MobileNav } from './header/MobileNav';
import { DesktopNav } from './header/DesktopNav';
import { ThemeToggle } from './header/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Companies', href: '/companies' },
  { label: 'Candidates', href: '/job-seekers' },
  { label: 'Interview Prep', href: '/interview-prep' },
  { label: 'Discussions', href: '/discussions' },
  { label: 'Blog', href: '/blog' },
  { label: 'Post a Job', href: '/post-job' },
  { label: 'Rewards', href: '/rewards' }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="container flex items-center justify-between h-14 sm:h-16 px-4 mx-auto">
        <div className="flex items-center gap-2 sm:gap-6">
          <MobileNav items={navItems} />
          <Logo />
          {!isMobile && <DesktopNav items={navItems} />}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
