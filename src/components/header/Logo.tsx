
import { Link } from "react-router-dom";
import { Facebook } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-6">
      <Link to="/" className="flex items-center gap-2">
        <img 
          src="/favicon.ico" 
          alt="SupplyChain_KE Logo" 
          className="w-6 h-6" 
        />
        <span className="font-bold text-lg md:text-xl whitespace-nowrap">SupplyChain_KE</span>
      </Link>
      <a 
        href="https://www.facebook.com/people/SupplyChain-Ke/61575329135959/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hidden md:flex text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Facebook Page"
      >
        <Facebook className="h-5 w-5" />
      </a>
    </div>
  );
};
