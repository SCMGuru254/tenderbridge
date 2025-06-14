
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  items: NavItem[];
}

export const MobileNav = ({ items }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold">
                SupplyChain_KE
              </SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          
          <nav className="flex flex-col p-6 space-y-2 flex-1">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="flex items-center py-3 px-4 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-6 border-t bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Connecting Kenya's Supply Chain Professionals
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
