import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RouterErrorBoundary } from '@/components/RouterErrorBoundary';
import Home from '@/pages/Home';
import Jobs from '@/pages/Jobs';
import Documents from '@/pages/Documents';
import Discussions from '@/pages/Discussions';
import Networking from '@/pages/Networking';
import Rewards from '@/pages/Rewards';
import Affiliate from '@/pages/Affiliate';
import FeaturedClients from '@/pages/FeaturedClients';

function App() {
  return (
    <QueryClient>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <div className="min-h-screen bg-background">
          <BrowserRouter>
            <RouterErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/networking" element={<Networking />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/featured-clients" element={<FeaturedClients />} />
              </Routes>
            </RouterErrorBoundary>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </QueryClient>
  );
}

export default App;
