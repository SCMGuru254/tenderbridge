
import './styles/animations.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/Navigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import AppFooter from "@/components/AppFooter";

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
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Analytics from "./pages/Analytics";
import Communities from "./pages/Communities";
import Documents from "./pages/Documents";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <TooltipProvider>
              <AuthProvider>
                <div className="min-h-screen bg-background pb-16 md:pb-0 flex flex-col">
                  <Navigation />
                  <main className="container mx-auto px-4 py-8 page-transition flex-1">
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
                      <Route path="/payment-success" element={<PaymentSuccess />} />
                      <Route path="/payment-cancel" element={<PaymentCancel />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/communities" element={<Communities />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                    </Routes>
                  </main>
                  <AppFooter />
                  <MobileNavigation />
                </div>
                <Toaster />
                <Sonner />
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
