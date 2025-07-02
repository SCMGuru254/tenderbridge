
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import InterviewPrep from "@/pages/InterviewPrep";
import ChatAssistant from "@/pages/ChatAssistant";
import JoinTeam from "@/pages/JoinTeam";
import { Mentorship } from "@/components/Mentorship";
import { SalaryAnalyzer } from "@/components/SalaryAnalyzer";
import { DiscussionList } from "@/components/DiscussionList";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/chat" element={<ChatAssistant />} />
                <Route path="/join-team" element={<JoinTeam />} />
                <Route path="/mentorship" element={<Mentorship />} />
                <Route path="/salary-analyzer" element={<SalaryAnalyzer />} />
                <Route path="/discussions" element={<DiscussionList />} />
              </Routes>
            </div>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
