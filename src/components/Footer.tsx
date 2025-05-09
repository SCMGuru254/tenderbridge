import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Send } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-gray-700 mb-4">SupplyChain_KE</h3>
            <p className="text-sm text-gray-600 mb-4">
              Connecting supply chain professionals in Kenya with opportunities and insights.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/people/SupplyChain-Ke/61575329135959/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com/supplychainke" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/supplychainke" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://t.me/supplychainke" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700">
                <span className="sr-only">Telegram</span>
                <Send className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-gray-700 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/discussions" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Discussions
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-gray-700 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/interview-prep" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/document-generator" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Document Generator
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Careers at SupplyChain_KE
                </Link>
              </li>
              <li>
                <Link to="/free-services" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Free Services
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-gray-700 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} SupplyChain_KE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
