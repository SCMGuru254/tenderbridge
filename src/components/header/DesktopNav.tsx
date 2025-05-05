
import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  items: NavItem[];
}

export const DesktopNav = ({ items }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.href}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
