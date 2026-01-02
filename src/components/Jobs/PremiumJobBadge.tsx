import { Badge } from '@/components/ui/badge';
import { Star, Zap, Crown } from 'lucide-react';

interface PremiumJobBadgeProps {
  isPremium?: boolean;
  isFeatured?: boolean;
  priorityScore?: number;
  className?: string;
}

export function PremiumJobBadge({ 
  isPremium, 
  isFeatured, 
  priorityScore = 0,
  className = '' 
}: PremiumJobBadgeProps) {
  if (!isPremium && !isFeatured) return null;

  // Determine badge type based on priority score
  const getBadgeConfig = () => {
    if (isFeatured && priorityScore >= 100) {
      return {
        icon: <Crown className="h-3 w-3" />,
        label: 'Ultimate',
        className: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0'
      };
    } else if (isFeatured && priorityScore >= 50) {
      return {
        icon: <Star className="h-3 w-3" />,
        label: 'Featured',
        className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0'
      };
    } else if (isPremium) {
      return {
        icon: <Zap className="h-3 w-3" />,
        label: 'Boosted',
        className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0'
      };
    }
    return null;
  };

  const config = getBadgeConfig();
  if (!config) return null;

  return (
    <Badge className={`flex items-center gap-1 ${config.className} ${className}`}>
      {config.icon}
      <span className="font-semibold">{config.label}</span>
    </Badge>
  );
}

interface PremiumJobCardWrapperProps {
  isPremium?: boolean;
  isFeatured?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PremiumJobCardWrapper({ 
  isPremium, 
  isFeatured, 
  children,
  className = '' 
}: PremiumJobCardWrapperProps) {
  const getWrapperClass = () => {
    if (isFeatured) {
      return 'border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg';
    } else if (isPremium) {
      return 'border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md';
    }
    return '';
  };

  return (
    <div className={`${getWrapperClass()} ${className}`}>
      {children}
    </div>
  );
}
