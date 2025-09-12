// Utility to fix common React Hook dependency issues
import { useEffect, useCallback, DependencyList } from 'react';

export function useEffectWithDeps(
  effect: () => void | (() => void),
  deps: DependencyList,
  options: { skipFirst?: boolean; cleanup?: () => void } = {}
) {
  const { skipFirst, cleanup } = options;
  
  useEffect(() => {
    if (skipFirst) {
      return;
    }
    
    const result = effect();
    
    return () => {
      cleanup?.();
      if (typeof result === 'function') {
        result();
      }
    };
  }, deps);
}

export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps: DependencyList,
  options: { skipFirst?: boolean; cleanup?: () => void } = {}
) {
  useEffect(() => {
    const { cleanup } = options;
    let mounted = true;
    let cleanupFn: (() => void) | undefined;
    
    (async () => {
      try {
        const result = await effect();
        if (!mounted) return;
        
        if (typeof result === 'function') {
          cleanupFn = result;
        }
      } catch (err) {
        console.error('Error in async effect:', err);
      }
    })();
    
    return () => {
      mounted = false;
      cleanup?.();
      cleanupFn?.();
    };
  }, deps);
}

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  return useCallback(callback, deps);
}
