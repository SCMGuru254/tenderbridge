
import { QueryClient } from '@tanstack/react-query';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

export const mockJob = {
  id: '1',
  title: 'Supply Chain Manager',
  company: 'Test Company',
  location: 'Nairobi, Kenya',
  job_type: 'Full-time' as const,
  created_at: '2024-01-01T00:00:00Z',
  description: 'Test job description',
  posted_by: 'test-user-id',
  is_active: true,
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockScrapedJob = {
  id: '1',
  title: 'Logistics Coordinator',
  company: 'Test Logistics',
  location: 'Mombasa, Kenya',
  source: 'TestSource',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockConsoleError = () => {
  const originalError = console.error;
  console.error = () => {};
  return () => {
    console.error = originalError;
  };
};

export const renderWithQueryClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  
  return {
    queryClient: testQueryClient,
    component: ui
  };
};
