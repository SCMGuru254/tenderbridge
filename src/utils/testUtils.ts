
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0
    }
  }
});

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(BrowserRouter, {}, children)
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

// Export everything
export * from '@testing-library/react';
export { customRender as render };
