
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Send, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-12 mt-16 relative">
      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg md:bottom-4"
        size="icon"
        variant="secondary"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-xl text-primary mb-4">SupplyChain_KE</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connecting supply chain professionals in Kenya with opportunities, insights, and community.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/people/SupplyChain-Ke/61575329135959/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/supplychainke" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/supplychainke" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://t.me/supplychainke" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Telegram</span>
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/ai-agents" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  AI Agents
                </Link>
              </li>
              <li>
                <Link to="/discussions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Discussions
                </Link>
              </li>
              <li>
                <Link to="/communities" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Communities
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Rewards Program
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/interview-prep" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/onboarding" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documents
                </Link>
              </li>
              <li>
                <Link to="/networking" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Networking
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/affiliate" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link to="/featured-clients" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Featured Services
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} SupplyChain_KE. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Made with ❤️ for the supply chain community in Kenya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
