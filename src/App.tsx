import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Auth = lazy(() => import("./pages/Auth"));
const Mentorship = lazy(() => import("./components/Mentorship").then(m => ({ default: m.Mentorship })));
const SalaryAnalyzer = lazy(() => import("./components/SalaryAnalyzer").then(m => ({ default: m.SalaryAnalyzer })));
const DiscussionList = lazy(() => import("./components/DiscussionList").then(m => ({ default: m.DiscussionList })));
const JoinOurTeam = lazy(() => import("./components/JoinOurTeam").then(m => ({ default: m.JoinOurTeam })));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));
const CompanyReviews = lazy(() => import("./pages/CompanyReviews"));
const HRDirectory = lazy(() => import("./pages/HRDirectory"));
const Careers = lazy(() => import("./pages/Careers"));
const Companies = lazy(() => import("./pages/Companies"));
const Profile = lazy(() => import("./pages/Profile"));
const Rewards = lazy(() => import("./pages/Rewards"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const AIAgents = lazy(() => import("./pages/AIAgents"));
const DocumentGenerator = lazy(() => import("./pages/DocumentGenerator"));
const ATSChecker = lazy(() => import("./components/ATSChecker").then(m => ({ default: m.ATSChecker })));
const ChatAssistant = lazy(() => import("./pages/ChatAssistant"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces deprecated cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route element={<Layout />}>
                  <Route path="/jobs" element={<Index />} />
                  <Route path="/jobs/:id" element={<lazy(() => import("./pages/JobDetails"))} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mentorship" element={<Mentorship />} />
                  <Route path="/salary-analyzer" element={<SalaryAnalyzer />} />
                  <Route path="/discussions" element={<DiscussionList />} />
                  <Route path="/join-our-team" element={<JoinOurTeam />} />
                  <Route path="/interview-prep" element={<InterviewPrep />} />
                  <Route path="/company-reviews" element={<CompanyReviews />} />
                  <Route path="/hr-directory" element={<HRDirectory />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/companies/signup" element={<lazy(() => import("./components/companies/CompanySignup"))} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-cancel" element={<PaymentCancel />} />
                  <Route path="/ai-agents" element={<AIAgents />} />
                  <Route path="/documents" element={<DocumentGenerator />} />
                  <Route path="/ats-checker" element={<ATSChecker />} />
                  <Route path="/chat-assistant" element={<ChatAssistant />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
