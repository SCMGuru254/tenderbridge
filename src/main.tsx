
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CACHE_CONFIG } from '@/hooks/useAdvancedCaching'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}

// High-performance query client configuration for 100k+ users
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.JOBS.staleTime,
      gcTime: CACHE_CONFIG.JOBS.gcTime,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: CACHE_CONFIG.JOBS.retry,
      retryDelay: CACHE_CONFIG.JOBS.retryDelay,
      // Enable background refetching for better UX
      refetchInterval: CACHE_CONFIG.JOBS.refetchInterval,
      // Network mode for better offline handling
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 2,
      retryDelay: 1000,
      networkMode: 'offlineFirst',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="system"
        storageKey="vite-react-theme"
      >
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
