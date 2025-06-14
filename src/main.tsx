
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_CONFIG } from "@/hooks/useAdvancedCaching";

// Safety check for React
if (!React || typeof React.createElement !== 'function') {
  throw new Error('React is not properly loaded');
}

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

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

console.log("[DIAGNOSTIC] React version:", React.version);
console.log("[DEBUG] main.tsx - About to render app");

// Add error boundary for development
const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
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
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    // Fallback render
    root.render(
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Application Error</h1>
        <p>Failed to initialize the application. Please refresh the page.</p>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
      </div>
    );
  }
};

renderApp();
