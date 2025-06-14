
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "@/pages/Index";
import Jobs from "@/pages/Jobs";
import Profile from "@/pages/Profile";
import PostJob from "@/pages/PostJob";
import Auth from "@/pages/Auth";
import Companies from "@/pages/Companies";
import Discussions from "@/pages/Discussions";
import PayPalPortal from "@/pages/PayPalPortal";
import Careers from "@/pages/Careers";
import AIAgents from "@/pages/AIAgents";
import { AppDebugger } from "@/components/debug/AppDebugger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  console.log('App rendering...', { isDevelopment });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            {isDevelopment && <AppDebugger />}
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/paypal-portal" element={<PayPalPortal />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/ai-agents" element={<AIAgents />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
