
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import JobDetails from './pages/JobDetails';
import JobSeekers from './pages/JobSeekers';
import InterviewPrep from './pages/InterviewPrep';
import Companies from './pages/Companies';
import CompanyProfile from './pages/CompanyProfile';
import Faq from './pages/Faq';
import Discussions from './pages/Discussions';
import PostJob from './pages/PostJob';
import Blog from './pages/Blog';
import Onboarding from './pages/Onboarding';
import DocumentGenerator from './pages/DocumentGenerator';
import Messages from './pages/Messages';
import SupplyChainInsights from './pages/SupplyChainInsights';
import Security from './pages/Security';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from './hooks/use-theme';
import SecurityMiddleware from './components/SecurityMiddleware';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Careers from './pages/Careers';
import Forms from './pages/Forms';
import Rewards from './pages/Rewards';
import { adService } from "@/services/adService";
import { AdSection } from "@/components/AdSection";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import FreeServices from "@/pages/FreeServices";
import { SiteNavigation } from '@/components/SiteNavigation';
import AdManagement from './pages/AdManagement';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.dataset.theme = theme;
    // Initialize ad service
    adService.initialize().catch(console.error);
  }, [theme]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <PWAInstallPrompt />
      <div className="min-h-screen bg-background">
        <SecurityMiddleware>
          <Navbar />
          <SiteNavigation />
          <main className="pb-8 pt-20">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/job-details/:id" element={<JobDetails />} />
                  <Route path="/job-seekers" element={<JobSeekers />} />
                  <Route path="/interview-prep" element={<InterviewPrep />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/companies/:id" element={<CompanyProfile />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/discussions" element={<Discussions />} />
                  <Route path="/post-job" element={<PostJob />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/document-generator" element={<DocumentGenerator />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/supply-chain-insights" element={<SupplyChainInsights />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/forms" element={<Forms />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/free-services" element={<FreeServices />} />
                  <Route path="/ad-management" element={<AdManagement />} />
                </Routes>
              </div>

              {/* Sidebar Ads */}
              <div className="hidden lg:block w-[300px] space-y-8">
                <AdSection type="sidebar" position="sidebar-top" />
                <AdSection type="sidebar" position="sidebar-bottom" />
              </div>
            </div>

            {/* Inline Content Ad */}
            <AdSection type="inline" position="content" className="my-8" />
          </main>
          <Footer />
          <Toaster />
        </SecurityMiddleware>
      </div>
    </div>
  );
}

export default App;
