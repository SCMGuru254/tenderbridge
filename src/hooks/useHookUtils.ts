import { useEffect, useCallback, DependencyList } from 'react';

export interface AsyncEffectConfig {
  wait?: number;
  retries?: number;
  retry?: (error: Error, attempt: number) => boolean;
  cleanup?: () => void;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

/**
 * Executes an async effect with retry logic and cleanup
 */
export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps: DependencyList,
  config: AsyncEffectConfig = {}
) {
  const {
    wait = 1000,
    retries = 3,
    retry = () => true,
    cleanup,
    onError,
    onSuccess
  } = config;

  useEffect(() => {
    let mounted = true;
    let attempts = 0;
    let timeoutId: NodeJS.Timeout;

    const runEffect = async () => {
      try {
        const result = await effect();
        if (!mounted) return;

        if (onSuccess) onSuccess();

        if (typeof result === 'function') {
          return () => {
            cleanup?.();
            result();
          };
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        
        if (!mounted) return;
        
        if (onError) onError(error);

        if (attempts < retries && retry(error, attempts)) {
          attempts++;
          timeoutId = setTimeout(runEffect, wait);
        }
      }
    };

    runEffect();

    return () => {
      mounted = false;
      cleanup?.();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, deps);
}

/**
 * Creates a memoized callback that is safe to use in useEffect dependencies
 */
export function useSafeCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  return useCallback(callback, deps);
}

/**
 * Wraps useEffect to provide automatic cleanup and dependency validation
 */
export function useManagedEffect(
  effect: () => void | (() => void),
  deps: DependencyList,
  cleanup?: () => void
) {
  useEffect(() => {
    const result = effect();
    return () => {
      cleanup?.();
      if (typeof result === 'function') {
        result();
      }
    };
  }, deps);
}
