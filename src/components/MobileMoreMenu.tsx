import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  BarChart3,
  Settings,
  MessageCircle,
  Users,
  FileText,
  Award,
  DollarSign,
  Star,
  ChevronRight
} from 'lucide-react';

export function MobileMoreMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const menuItems = [
    {
      group: "Analytics & Insights",
      items: [
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/documents', label: 'Documents', icon: FileText },
      ]
    },
    {
      group: "Community",
      items: [
        { href: '/communities', label: 'Communities', icon: Users },
        { href: '/discussions', label: 'Discussions', icon: MessageCircle },
      ]
    },
    {
      group: "Rewards & Benefits",
      items: [
        { href: '/rewards', label: 'Rewards', icon: Award },
        { href: '/affiliate', label: 'Affiliate Program', icon: DollarSign },
        { href: '/featured-services', label: 'Premium Services', icon: Star },
      ]
    },
    {
      group: "Account",
      items: [
        { href: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>More Options</SheetTitle>
        </SheetHeader>
        <div className="py-6 divide-y">
          {menuItems.map((group) => (
            <div key={group.group} className="py-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{group.group}</h3>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
