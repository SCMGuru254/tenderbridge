
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RouterErrorBoundary } from '@/components/RouterErrorBoundary';
import Home from '@/pages/Home';
import Jobs from '@/pages/Jobs';
import Discussions from '@/pages/Discussions';
import Networking from '@/pages/Networking';
import Rewards from '@/pages/Rewards';
import Affiliate from '@/pages/Affiliate';
import FeaturedClients from '@/pages/FeaturedClients';
import InterviewPrep from '@/pages/InterviewPrep';
import AIAgents from '@/pages/AIAgents';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <div className="min-h-screen bg-background">
          <BrowserRouter>
            <RouterErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/networking" element={<Networking />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/featured-clients" element={<FeaturedClients />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/ai-agents" element={<AIAgents />} />
              </Routes>
            </RouterErrorBoundary>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
