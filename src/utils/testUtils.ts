import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0
    }
  }
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const generateMockJob = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  title: 'Software Engineer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  description: 'Job description here',
  salary: '$100,000 - $150,000',
  skills: ['JavaScript', 'React', 'TypeScript'],
  is_remote: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const generateMockUser = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  email: 'test@example.com',
  name: 'Test User',
  created_at: new Date().toISOString(),
  ...overrides
});

export const generateMockNotification = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  user_id: Math.random().toString(36).substr(2, 9),
  title: 'New Job Alert',
  message: 'A new job matching your criteria has been posted',
  type: 'job_alert',
  read: false,
  created_at: new Date().toISOString(),
  ...overrides
});

// Mock API responses
export const mockApiResponse = <T>(data: T, delay = 1000) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock error responses
export const mockApiError = (error: Error, delay = 1000) => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(error), delay);
  });
};

// Test helpers
export const waitForLoadingToFinish = async () => {
  const loadingElement = document.querySelector('[data-testid="loading"]');
  if (loadingElement) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.ResizeObserver = mockResizeObserver;
};

// Custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      };
    }
  }
});

// Export everything
export * from '@testing-library/react';
export { customRender as render }; 