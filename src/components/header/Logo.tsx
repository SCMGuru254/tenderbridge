
import { Link } from "react-router-dom";

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
    </div>
  );
};
