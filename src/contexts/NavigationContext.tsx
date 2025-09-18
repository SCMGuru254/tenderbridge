import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  NavigationState,
  NavigationAction,
  NavigationContextType,
  NavigationPreference
} from './types/navigation';

// Load initial preferences from localStorage
const loadPreferences = (): NavigationPreference => {
  try {
    const saved = localStorage.getItem('navigationPreferences');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const initialState: NavigationState = {
  activeItem: undefined,
  activeCategory: undefined,
  isDrawerOpen: false,
  preferences: loadPreferences()
};

const savePreferences = (preferences: NavigationPreference) => {
  try {
    localStorage.setItem('navigationPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save navigation preferences:', error);
  }
};

const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  switch (action.type) {
    case 'SET_ACTIVE_ITEM':
      if (action.payload) {
        // Add to recent links when setting active item
        const recentLinks = [
          action.payload.href,
          ...(state.preferences.recentLinks || []).filter(link => link !== action.payload?.href)
        ].slice(0, 10); // Keep last 10 items

        const newState = {
          ...state,
          activeItem: action.payload,
          preferences: {
            ...state.preferences,
            recentLinks
          }
        };
        savePreferences(newState.preferences);
        return newState;
      }
      return { ...state, activeItem: undefined };

    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload };

    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: !state.isDrawerOpen };

    case 'SET_DRAWER_OPEN':
      return { ...state, isDrawerOpen: action.payload };

    case 'ADD_FAVORITE': {
      const favorites = [...(state.preferences.favoriteLinks || []), action.payload];
      const newState = {
        ...state,
        preferences: { ...state.preferences, favoriteLinks: favorites }
      };
      savePreferences(newState.preferences);
      return newState;
    }

    case 'REMOVE_FAVORITE': {
      const favorites = (state.preferences.favoriteLinks || []).filter(
        link => link !== action.payload
      );
      const newState = {
        ...state,
        preferences: { ...state.preferences, favoriteLinks: favorites }
      };
      savePreferences(newState.preferences);
      return newState;
    }

    case 'ADD_RECENT': {
      const recentLinks = [
        action.payload,
        ...(state.preferences.recentLinks || []).filter(link => link !== action.payload)
      ].slice(0, 10); // Keep last 10 items
      const newState = {
        ...state,
        preferences: { ...state.preferences, recentLinks }
      };
      savePreferences(newState.preferences);
      return newState;
    }

    case 'SET_RECENT_LINKS': {
      const newState = {
        ...state,
        preferences: { ...state.preferences, recentLinks: action.payload }
      };
      savePreferences(newState.preferences);
      return newState;
    }

    case 'HIDE_CATEGORY': {
      const hiddenCategories = [...(state.preferences.hideCategories || []), action.payload];
      const newState = {
        ...state,
        preferences: { ...state.preferences, hideCategories: hiddenCategories }
      };
      savePreferences(newState.preferences);
      return newState;
    }

    case 'SHOW_CATEGORY': {
      const hiddenCategories = (state.preferences.hideCategories || []).filter(
        cat => cat !== action.payload
      );
      const newState = {
        ...state,
        preferences: { ...state.preferences, hideCategories: hiddenCategories }
      };
      savePreferences(newState.preferences);
      return newState;
    }

    case 'SET_ALWAYS_SHOW_BOTTOM_NAV': {
      const newState = {
        ...state,
        preferences: { ...state.preferences, alwaysShowBottomNav: action.payload }
      };
      savePreferences(newState.preferences);
      return newState;
    }

    default:
      return state;
  }
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  const toggleDrawer = useCallback(() => {
    dispatch({ type: 'TOGGLE_DRAWER' });
  }, []);

  const addFavorite = useCallback((href: string) => {
    dispatch({ type: 'ADD_FAVORITE', payload: href });
  }, []);

  const removeFavorite = useCallback((href: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: href });
  }, []);

  const hideCategory = useCallback((category: string) => {
    dispatch({ type: 'HIDE_CATEGORY', payload: category });
  }, []);

  const showCategory = useCallback((category: string) => {
    dispatch({ type: 'SHOW_CATEGORY', payload: category });
  }, []);

  const setAlwaysShowBottomNav = useCallback((show: boolean) => {
    dispatch({ type: 'SET_ALWAYS_SHOW_BOTTOM_NAV', payload: show });
  }, []);

  const isFavorite = useCallback(
    (href: string) => (state.preferences.favoriteLinks || []).includes(href),
    [state.preferences.favoriteLinks]
  );

  const isRecentlyVisited = useCallback(
    (href: string) => (state.preferences.recentLinks || []).includes(href),
    [state.preferences.recentLinks]
  );

  const isCategoryHidden = useCallback(
    (category: string) => (state.preferences.hideCategories || []).includes(category),
    [state.preferences.hideCategories]
  );

  const value = {
    state,
    dispatch,
    toggleDrawer,
    addFavorite,
    removeFavorite,
    hideCategory,
    showCategory,
    setAlwaysShowBottomNav,
    isFavorite,
    isRecentlyVisited,
    isCategoryHidden
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationContext;