import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthRedirect } from "@/components/AuthRedirect";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { AuthProviderFull } from "@/contexts/AuthContextFull";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { Toaster } from "sonner";

// Unregister all service workers on app load to fix blank screen issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('Service worker unregistered to fix caching issues');
    });
  });
  // Also clear caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
        console.log('Cache deleted:', name);
      });
    });
  }
}

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const WelcomeDashboard = lazy(() => import("./pages/WelcomeDashboard"));
const Auth = lazy(() => import("./pages/Auth").catch(error => {
  console.error("Failed to load Auth component:", error);
  // Return a simple fallback component
  return {
    default: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load authentication</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  };
}));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const CompanySignup = lazy(() => import("./components/companies/CompanySignup"));
const Mentorship = lazy(() => import("./pages/Mentorship"));
const Courses = lazy(() => import("./pages/Courses"));
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
const RLSTest = lazy(() => import("./pages/RLSTest"));
const Forms = lazy(() => import("./pages/Forms"));
const FreeServices = lazy(() => import("./pages/FreeServices"));
const Faq = lazy(() => import("./pages/Faq"));
const SocialHub = lazy(() => import("./pages/SocialHub"));
const PayPalPortal = lazy(() => import("./pages/PayPalPortal"));
const FeaturedClients = lazy(() => import("./pages/FeaturedClients"));
const Documents = lazy(() => import("./pages/Documents"));
const HireMySkill = lazy(() => import("./pages/HireMySkill"));
const HireMySkillProfile = lazy(() => import("./pages/HireMySkillProfile"));
const TrainingEvents = lazy(() => import("./pages/TrainingEvents"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const EmployerDashboard = lazy(() => import("./components/Employer/EmployerDashboard").then(m => ({ default: m.EmployerDashboard })));
const EmployerApplicationsList = lazy(() => import("./components/Employer/EmployerApplicationsList").then(m => ({ default: m.EmployerApplicationsList })));

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

// Service worker registration DISABLED to fix blank screen issue
// The service workers were aggressively caching pages causing stale content
// TODO: Re-enable with proper network-first caching strategy

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProviderFull>
          <NavigationProvider>
            <TooltipProvider delayDuration={300}>
              {/* Splash screen disabled to prevent mobile blocking */}
              <HashRouter>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={
                        <AuthRedirect>
                          <Landing />
                        </AuthRedirect>
                      } />
                      <Route path="landing" element={
                        <AuthRedirect>
                          <Landing />
                        </AuthRedirect>
                      } />
                      <Route path="index" element={<Index />} />
                      <Route path="jobs" element={<Jobs />} />
                      <Route path="chat-assistant" element={<ChatAssistant />} />
                      <Route path="document-generator" element={<DocumentGenerator />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="onboarding" element={<Onboarding />} />
                      <Route path="welcome" element={<WelcomeDashboard />} />
                      <Route path="auth" element={<Auth />} />
                      <Route path="job/:id" element={<JobDetails />} />
                      <Route path="company-signup" element={<CompanySignup />} />
                      {featureFlags.enableMentorship && (
                        <Route path="mentorship" element={
                          <ProtectedRoute>
                            <Mentorship />
                          </ProtectedRoute>
                        } />
                      )}
                      <Route path="salary-analyzer" element={<SalaryAnalyzer />} />
                      <Route path="discussions" element={<DiscussionList />} />
                      <Route path="careers" element={<JoinOurTeam />} />
                      <Route path="interview-prep" element={<InterviewPrep />} />
                      <Route path="company-reviews" element={<CompanyReviews />} />
                      {featureFlags.enableHRDirectory && (
                        <Route path="hr-directory" element={
                          <ProtectedRoute>
                            <HRDirectory />
                          </ProtectedRoute>
                        } />
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
                      <Route path="employer/dashboard" element={
                        <ProtectedRoute>
                          <EmployerDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="employer/applicants/:jobId" element={
                        <ProtectedRoute>
                          <EmployerApplicationsList />
                        </ProtectedRoute>
                      } />
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
                      <Route path="hire-my-skill/profile" element={
                        <ProtectedRoute>
                          <HireMySkillProfile />
                        </ProtectedRoute>
                      } />
                      <Route path="courses" element={<Courses />} />
                      <Route path="training-events" element={<TrainingEvents />} />
                      <Route path="security" element={<Security />} />
                      <Route path="rls-test" element={<RLSTest />} />
                      <Route path="forms" element={<Forms />} />
                      <Route path="free-services" element={<FreeServices />} />
                      <Route path="faq" element={<Faq />} />
                      <Route path="social-hub" element={<SocialHub />} />
                      <Route path="paypal-portal" element={<PayPalPortal />} />
                      <Route path="featured-clients" element={<FeaturedClients />} />
                      {featureFlags.enableDocuments && (
                        <Route path="documents" element={<Documents />} />
                      )}
                      <Route path="settings" element={<Settings />} />
                      <Route path="admin" element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                    </Route>
                  </Routes>
                </Suspense>
              </HashRouter>
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </NavigationProvider>
        </AuthProviderFull>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;