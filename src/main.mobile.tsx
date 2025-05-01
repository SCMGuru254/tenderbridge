import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

// Initialize mobile-specific features
const initializeMobile = async () => {
  if (Capacitor.isNativePlatform()) {
    // Set status bar style
    await StatusBar.setStyle({ style: 'DARK' });
    await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
    
    // Hide splash screen after a delay
    setTimeout(async () => {
      await SplashScreen.hide();
    }, 2000);
  }
};

// Initialize mobile features before rendering
initializeMobile().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider
        defaultTheme="system"
        storageKey="vite-react-theme"
      >
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>,
  );
}); 