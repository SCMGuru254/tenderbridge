import { useEffect, useState } from 'react';

// Device detection
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return !isMobile() && !isTablet();
};

// Screen size detection
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Touch event handling
export const useTouchEvents = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void
) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({
      x: e.targetTouches[0]?.clientX || 0,
      y: e.targetTouches[0]?.clientY || 0
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0]?.clientX || 0,
      y: e.targetTouches[0]?.clientY || 0
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) < minSwipeDistance) return;
      if (distanceX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    } else {
      if (Math.abs(distanceY) < minSwipeDistance) return;
      if (distanceY > 0) {
        onSwipeUp?.();
      } else {
        onSwipeDown?.();
      }
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

// Mobile-specific styles
export const mobileStyles = {
  container: {
    padding: '1rem',
    maxWidth: '100%',
    overflowX: 'hidden'
  },
  button: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    minHeight: '44px' // Minimum touch target size
  },
  input: {
    padding: '0.75rem',
    fontSize: '16px' // Prevents iOS zoom on focus
  }
};

// Mobile gesture handlers
export const useMobileGestures = () => {
  const [gestureState, setGestureState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    setGestureState({
      isDragging: true,
      startX: e.touches[0]?.clientX || 0,
      startY: e.touches[0]?.clientY || 0,
      currentX: e.touches[0]?.clientX || 0,
      currentY: e.touches[0]?.clientY || 0
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gestureState.isDragging) return;

    setGestureState(prev => ({
      ...prev,
      currentX: e.touches[0]?.clientX || 0,
      currentY: e.touches[0]?.clientY || 0
    }));
  };

  const handleTouchEnd = () => {
    setGestureState(prev => ({
      ...prev,
      isDragging: false
    }));
  };

  return {
    gestureState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

// Mobile viewport meta tag helper
export const setMobileViewport = () => {
  if (typeof document !== 'undefined') {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      );
    }
  }
};

// Mobile keyboard handling
export const useMobileKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      if (isMobile) {
        const windowHeight = window.innerHeight;
        const screenHeight = window.screen.height;
        setIsKeyboardVisible(windowHeight < screenHeight * 0.8);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isKeyboardVisible;
};

// Mobile scroll handling
export const useMobileScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      setScrollPosition(window.pageYOffset);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return { scrollPosition, isScrolling };
}; 