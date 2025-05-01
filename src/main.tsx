import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter } from 'react-router-dom'
import { SecurityMiddleware } from './middleware/SecurityMiddleware'
import { Toaster } from "@/components/ui/toaster"
import Header from './components/Header'
import Footer from './components/Footer'
import Index from './pages/Index'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import JobSeekers from './pages/JobSeekers'
import InterviewPrep from './pages/InterviewPrep'
import Companies from './pages/Companies'
import CompanyProfile from './pages/CompanyProfile'
import Faq from './pages/Faq'
import Discussions from './pages/Discussions'
import PostJob from './pages/PostJob'
import Blog from './pages/Blog'
import Onboarding from './pages/Onboarding'
import DocumentGenerator from './pages/DocumentGenerator'
import Messages from './pages/Messages'
import SupplyChainInsights from './pages/SupplyChainInsights'
import Security from './pages/Security'
import AIAgents from "./pages/AIAgents";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-react-theme"
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
