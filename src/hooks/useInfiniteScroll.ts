import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  isLoading: boolean;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  hasNextPage,
  fetchNextPage,
  isLoading,
  threshold = 1.0,
  rootMargin = '100px'
}: UseInfiniteScrollOptions) => {
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      
      if (target.isIntersecting && hasNextPage && !isLoading && !isFetchingNextPage) {
        setIsFetchingNextPage(true);
        try {
          await fetchNextPage();
        } catch (error) {
          console.error('Failed to fetch next page:', error);
        } finally {
          setIsFetchingNextPage(false);
        }
      }
    },
    [hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]
  );

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver(handleObserver, {
        threshold,
        rootMargin
      });
      
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [handleObserver, isLoading, threshold, rootMargin]
  );

  const setLoadingRef = useCallback((node: HTMLDivElement | null) => {
    loadingRef.current = node;
    lastElementRef(node);
  }, [lastElementRef]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    lastElementRef: setLoadingRef,
    isFetchingNextPage: isFetchingNextPage || isLoading
  };
};

// Enhanced version with manual trigger capability
export const useInfiniteScrollWithManualTrigger = ({
  hasNextPage,
  fetchNextPage,
  isLoading,
  threshold = 1.0,
  rootMargin = '100px',
  enableAutoLoad = true
}: UseInfiniteScrollOptions & { enableAutoLoad?: boolean }) => {
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(enableAutoLoad);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      
      if (target.isIntersecting && hasNextPage && !isLoading && !isFetchingNextPage && autoLoadEnabled) {
        setIsFetchingNextPage(true);
        try {
          await fetchNextPage();
        } catch (error) {
          console.error('Failed to fetch next page:', error);
        } finally {
          setIsFetchingNextPage(false);
        }
      }
    },
    [hasNextPage, isLoading, isFetchingNextPage, fetchNextPage, autoLoadEnabled]
  );

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver(handleObserver, {
        threshold,
        rootMargin
      });
      
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [handleObserver, isLoading, threshold, rootMargin]
  );

  const manualLoadMore = async () => {
    if (hasNextPage && !isLoading && !isFetchingNextPage) {
      setIsFetchingNextPage(true);
      try {
        await fetchNextPage();
      } catch (error) {
        console.error('Failed to fetch next page:', error);
      } finally {
        setIsFetchingNextPage(false);
      }
    }
  };

  const toggleAutoLoad = () => {
    setAutoLoadEnabled(!autoLoadEnabled);
  };

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    lastElementRef,
    isFetchingNextPage: isFetchingNextPage || isLoading,
    manualLoadMore,
    autoLoadEnabled,
    toggleAutoLoad
  };
};

// Hook for virtualized infinite scroll
export const useVirtualizedInfiniteScroll = ({
  itemHeight,
  containerHeight,
  items,
  hasNextPage,
  fetchNextPage,
  isLoading,
  overscan = 5
}: {
  itemHeight: number;
  containerHeight: number;
  items: any[];
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  isLoading: boolean;
  overscan?: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length - 1
  );

  const visibleStartIndex = Math.max(0, startIndex - overscan);
  const visibleEndIndex = endIndex;

  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex + 1);

  const onScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);

    // Check if we need to load more items
    const scrollBottom = scrollTop + containerHeight;
    const threshold = totalHeight - (itemHeight * 3); // Load when 3 items from bottom

    if (scrollBottom >= threshold && hasNextPage && !isLoading && !isFetchingNextPage) {
      setIsFetchingNextPage(true);
      try {
        await fetchNextPage();
      } catch (error) {
        console.error('Failed to fetch next page:', error);
      } finally {
        setIsFetchingNextPage(false);
      }
    }
  }, [containerHeight, totalHeight, itemHeight, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);

  const getItemStyle = useCallback((index: number) => ({
    position: 'absolute' as const,
    top: (visibleStartIndex + index) * itemHeight,
    height: itemHeight,
    width: '100%'
  }), [visibleStartIndex, itemHeight]);

  const scrollToIndex = useCallback((index: number) => {
    const scrollTop = index * itemHeight;
    setScrollTop(scrollTop);
  }, [itemHeight]);

  return {
    visibleItems,
    totalHeight,
    onScroll,
    getItemStyle,
    visibleStartIndex,
    visibleEndIndex,
    isFetchingNextPage: isFetchingNextPage || isLoading,
    scrollToIndex
  };
};