
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import InterviewPrep from "./pages/InterviewPrep";
import AIAgents from "./pages/AIAgents";
import Discussions from "./pages/Discussions";
import Networking from "./pages/Networking";
import Rewards from "./pages/Rewards";
import Affiliate from "./pages/Affiliate";
import FeaturedClients from "./pages/FeaturedClients";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/interview-prep" element={<InterviewPrep />} />
                  <Route path="/ai-agents" element={<AIAgents />} />
                  <Route path="/discussions" element={<Discussions />} />
                  <Route path="/networking" element={<Networking />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/affiliate" element={<Affiliate />} />
                  <Route path="/featured-clients" element={<FeaturedClients />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
