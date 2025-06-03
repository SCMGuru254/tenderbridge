
import { useMemo, useState, useCallback } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

// Virtual scrolling for large lists (essential for 100k+ users)
export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
) {
  const [scrollTop, setScrollTop] = useState(0);
  const { itemHeight, containerHeight, overscan = 5 } = options;

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    );

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const getItemStyle = useCallback((index: number) => ({
    position: 'absolute' as const,
    top: (visibleRange.startIndex + index) * itemHeight,
    height: itemHeight,
    width: '100%'
  }), [visibleRange.startIndex, itemHeight]);

  return {
    visibleItems,
    totalHeight,
    onScroll,
    getItemStyle,
    visibleRange
  };
}
