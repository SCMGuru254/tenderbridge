
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import Discussions from "./pages/Discussions";
import PostJob from "./pages/PostJob";
import JobDetails from "./pages/JobDetails";
import JobSeekers from "./pages/JobSeekers";
import Blog from "./pages/Blog";
import SupplyChainInsights from "./pages/SupplyChainInsights";
import InterviewPrep from "./pages/InterviewPrep";
import DocumentGenerator from "./pages/DocumentGenerator";
import RewardsPage from "./pages/RewardsPage";
import Rewards from "./pages/Rewards";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/company/:id" element={<CompanyProfile />} />
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/job-seekers" element={<JobSeekers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/supply-chain-insights" element={<SupplyChainInsights />} />
              <Route path="/interview-prep" element={<InterviewPrep />} />
              <Route path="/document-generator" element={<DocumentGenerator />} />
              <Route path="/rewards-system" element={<RewardsPage />} />
              <Route path="/rewards" element={<Rewards />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
