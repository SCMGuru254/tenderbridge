import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_CONFIG } from "@/hooks/useAdvancedCaching";
import ErrorBoundary from "@/components/ErrorBoundary";

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
      refetchInterval: CACHE_CONFIG.JOBS.refetchInterval,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 2,
      retryDelay: 1000,
      networkMode: 'offlineFirst',
    },
  },
});

function initializeApp() {
  console.log("[DEBUG] main.tsx - Initializing app");
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider
              defaultTheme="system"
              storageKey="vite-react-theme"
            >
              <App />
              <Toaster />
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

// Ensure DOM is ready before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // Add a small delay to ensure React is fully loaded
  setTimeout(initializeApp, 0);
}
