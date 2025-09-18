import { MenuItem } from '@/config/navigation';

export type NavigationPreference = {
  alwaysShowBottomNav?: boolean;
  favoriteLinks?: string[];
  recentLinks?: string[];
  hideCategories?: string[];
};

export type NavigationState = {
  activeItem?: MenuItem;
  activeCategory?: string;
  isDrawerOpen: boolean;
  preferences: NavigationPreference;
};

export type NavigationAction =
  | { type: 'SET_ACTIVE_ITEM'; payload: MenuItem | undefined }
  | { type: 'SET_ACTIVE_CATEGORY'; payload: string | undefined }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_DRAWER_OPEN'; payload: boolean }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENT'; payload: string }
  | { type: 'SET_RECENT_LINKS'; payload: string[] }
  | { type: 'HIDE_CATEGORY'; payload: string }
  | { type: 'SHOW_CATEGORY'; payload: string }
  | { type: 'SET_ALWAYS_SHOW_BOTTOM_NAV'; payload: boolean };

export interface NavigationContextType {
  state: NavigationState;
  dispatch: React.Dispatch<NavigationAction>;
  toggleDrawer: () => void;
  addFavorite: (href: string) => void;
  removeFavorite: (href: string) => void;
  hideCategory: (category: string) => void;
  showCategory: (category: string) => void;
  setAlwaysShowBottomNav: (show: boolean) => void;
  isFavorite: (href: string) => boolean;
  isRecentlyVisited: (href: string) => boolean;
  isCategoryHidden: (category: string) => boolean;
}