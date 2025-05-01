
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
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
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/toaster"
import { useTheme } from './hooks/use-theme';
import SecurityMiddleware from './components/SecurityMiddleware';
import AIAgents from "./pages/AIAgents";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <SecurityMiddleware>
          <Header />
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<Index />} />
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
              <Route path="/ai-agents" element={<AIAgents />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </SecurityMiddleware>
      </div>
    </div>
  );
}

export default App;
