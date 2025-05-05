
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  items: NavItem[];
}

export const MobileNav = ({ items }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <img src="/favicon.ico" alt="SupplyChain_KE Logo" className="h-6 w-6 mr-2" />
            <span className="font-bold">SupplyChain_KE</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-4 px-2 mt-6">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="px-5 py-2 text-lg font-medium hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
