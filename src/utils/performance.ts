
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class PerformanceUtils {
  private metrics: PerformanceMetric[] = [];
  private cache = new Map<string, CacheItem<any>>();

  measureTime<T>(fn: () => T, name: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.recordMetric(name, end - start);
    return result;
  }

  async measureAsyncTime<T>(fn: () => Promise<T>, name: string): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.recordMetric(name, end - start);
    return result;
  }

  recordMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now()
    });
    
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }
  }

  memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string,
    ttl: number = 5 * 60 * 1000
  ): T {
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      const cached = this.cache.get(key);
      
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.value;
      }
      
      const result = fn(...args);
      this.cache.set(key, {
        value: result,
        timestamp: Date.now(),
        ttl
      });
      
      return result;
    }) as T;
  }

  debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  getAverageMetric(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return sum / filtered.length;
  }

  lazy<T>(factory: () => T): () => T {
    let cached: T;
    let initialized = false;
    
    return () => {
      if (!initialized) {
        cached = factory();
        initialized = true;
      }
      return cached;
    };
  }

  batchProcess<T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]>,
    batchSize: number = 10
  ): Promise<R[]> {
    const batches: T[][] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    return Promise.all(batches.map(batch => processor(batch)))
      .then(results => results.flat());
  }

  createResourcePool<T>(
    factory: () => T,
    destroyer: (resource: T) => void,
    maxSize: number = 10
  ) {
    const pool: T[] = [];
    let activeCount = 0;
    
    return {
      acquire: async (): Promise<T> => {
        if (pool.length > 0) {
          return pool.pop()!;
        }
        
        if (activeCount < maxSize) {
          activeCount++;
          return factory();
        }
        
        return new Promise((resolve) => {
          const checkPool = () => {
            if (pool.length > 0) {
              resolve(pool.pop()!);
            } else {
              setTimeout(checkPool, 10);
            }
          };
          checkPool();
        });
      },
      
      release: (resource: T) => {
        pool.push(resource);
      },
      
      destroy: () => {
        pool.forEach(destroyer);
        pool.length = 0;
        activeCount = 0;
      }
    };
  }

  measureMemoryUsage(): { used: number; total: number } | null {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize
      };
    }
    return null;
  }

  observePerformance(callback: (entry: PerformanceEntry) => void): () => void {
    if (typeof PerformanceObserver === 'undefined') {
      return () => {};
    }

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(callback);
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    
    return () => observer.disconnect();
  }
}

export const performanceUtils = new PerformanceUtils();
