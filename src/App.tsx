import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { AuthProviderFull } from "@/contexts/AuthContextFull";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Auth = lazy(() => import("./pages/Auth"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const CompanySignup = lazy(() => import("./components/companies/CompanySignup"));
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
const Jobs = lazy(() => import("./pages/Jobs"));
const SupplyChainInsights = lazy(() => import("./pages/SupplyChainInsights"));
const PostJob = lazy(() => import("./pages/PostJob"));
const JobsAlerts = lazy(() => import("./pages/jobs/alerts"));
const JobsAnalytics = lazy(() => import("./pages/jobs/analytics"));
const JobsApplications = lazy(() => import("./pages/jobs/applications"));
const JobsRecommendations = lazy(() => import("./pages/jobs/recommendations"));
// Additional pages
const Blog = lazy(() => import("./pages/Blog"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Networking = lazy(() => import("./pages/Networking"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Security = lazy(() => import("./pages/Security"));
const Forms = lazy(() => import("./pages/Forms"));
const FreeServices = lazy(() => import("./pages/FreeServices"));
const Faq = lazy(() => import("./pages/Faq"));
const SocialHub = lazy(() => import("./pages/SocialHub"));
const PayPalPortal = lazy(() => import("./pages/PayPalPortal"));
const FeaturedClients = lazy(() => import("./pages/FeaturedClients"));
const Documents = lazy(() => import("./pages/Documents"));
const HireMySkill = lazy(() => import("./pages/HireMySkill"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 2,
    },
  },
});

// Feature flags from environment
const featureFlags = {
  enableAI: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
  enableDocuments: import.meta.env.VITE_ENABLE_DOCUMENT_MANAGEMENT === 'true',
  enableMentorship: import.meta.env.VITE_ENABLE_MENTORSHIP === 'true',
  enableHRDirectory: import.meta.env.VITE_ENABLE_HR_DIRECTORY === 'true',
};

// Register PWA service worker (disabled on preview domains to prevent chunk-loading issues)
if ('serviceWorker' in navigator && !window.location.hostname.startsWith('preview--')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('PWA: Service worker registered successfully', registration.scope);
      })
      .catch((error) => {
        console.log('PWA: Service worker registration failed', error);
      });
  });
}

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
      <AuthProviderFull>
        <TooltipProvider delayDuration={300}>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="landing" element={<Landing />} />
                  <Route path="index" element={<Index />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="onboarding" element={<Onboarding />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="job/:id" element={<JobDetails />} />
                  <Route path="company-signup" element={<CompanySignup />} />
                  {featureFlags.enableMentorship && (
                    <Route path="mentorship" element={<Mentorship />} />
                  )}
                  <Route path="salary-analyzer" element={<SalaryAnalyzer />} />
                  <Route path="discussions" element={<DiscussionList />} />
                  <Route path="careers" element={<JoinOurTeam />} />
                  <Route path="interview-prep" element={<InterviewPrep />} />
                  <Route path="company-reviews" element={<CompanyReviews />} />
                  {featureFlags.enableHRDirectory && (
                    <Route path="hr-directory" element={<HRDirectory />} />
                  )}
                  <Route path="join-team" element={<Careers />} />
                  <Route path="companies" element={<Companies />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="payment-success" element={<PaymentSuccess />} />
                  <Route path="payment-cancel" element={<PaymentCancel />} />
                  {featureFlags.enableAI && (
                    <>
                      <Route path="ai-agents" element={<AIAgents />} />
                      <Route path="document-generator" element={<DocumentGenerator />} />
                      <Route path="ats-checker" element={<ATSChecker />} />
                      <Route path="chat-assistant" element={<ChatAssistant />} />
                    </>
                  )}
                  <Route path="supply-chain-insights" element={<SupplyChainInsights />} />
                  <Route path="post-job" element={<PostJob />} />
                  <Route path="jobs/alerts" element={<JobsAlerts />} />
                  <Route path="jobs/analytics" element={<JobsAnalytics />} />
                  <Route path="jobs/applications" element={<JobsApplications />} />
                  <Route path="jobs/recommendations" element={<JobsRecommendations />} />
                  {/* Additional pages */}
                  <Route path="blog" element={<Blog />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="networking" element={<Networking />} />
                  <Route path="affiliate" element={<Affiliate />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="hire-my-skill" element={<HireMySkill />} />
                  <Route path="security" element={<Security />} />
                  <Route path="forms" element={<Forms />} />
                  <Route path="free-services" element={<FreeServices />} />
                  <Route path="faq" element={<Faq />} />
                  <Route path="social-hub" element={<SocialHub />} />
                  <Route path="paypal-portal" element={<PayPalPortal />} />
                  <Route path="featured-clients" element={<FeaturedClients />} />
                  {featureFlags.enableDocuments && (
                    <Route path="documents" element={<Documents />} />
                  )}
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProviderFull>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;