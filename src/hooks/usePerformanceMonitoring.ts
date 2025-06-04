
import { useEffect, useCallback, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  errorCount: number;
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errorCount: 0
  });

  // Monitor render performance
  const trackRenderTime = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      
      // Log slow renders for optimization
      if (renderTime > 16) { // 16ms = 60fps threshold
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      setMetrics(prev => ({ ...prev, renderTime }));
    };
  }, []);

  // Monitor memory usage
  const trackMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / 1048576; // Convert to MB
      
      setMetrics(prev => ({ ...prev, memoryUsage }));
      
      // Alert on high memory usage
      if (memoryUsage > 100) { // 100MB threshold
        console.warn(`High memory usage detected: ${memoryUsage.toFixed(2)}MB`);
      }
    }
  }, []);

  // Monitor network requests
  const trackNetworkRequest = useCallback(() => {
    setMetrics(prev => ({ ...prev, networkRequests: prev.networkRequests + 1 }));
  }, []);

  // Monitor errors
  const trackError = useCallback((error: Error) => {
    console.error('Application error:', error);
    setMetrics(prev => ({ ...prev, errorCount: prev.errorCount + 1 }));
  }, []);

  // Performance monitoring setup
  useEffect(() => {
    // Monitor memory usage every 30 seconds
    const memoryInterval = setInterval(trackMemoryUsage, 30000);
    
    // Monitor network performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('Page load time:', entry.duration);
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation', 'resource'] });
    
    return () => {
      clearInterval(memoryInterval);
      observer.disconnect();
    };
  }, [trackMemoryUsage]);

  return {
    metrics,
    trackRenderTime,
    trackNetworkRequest,
    trackError
  };
}
