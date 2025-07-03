
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <div className="flex items-center gap-6">
      <Link to="/" className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/03c0e1ef-197d-4e61-926e-c4b14f094c6a.png" 
          alt="SupplyChain KE Logo" 
          className="w-8 h-8 rounded-full"
        />
        <span className="font-bold text-lg md:text-xl whitespace-nowrap">SupplyChain_KE</span>
      </Link>
    </div>
  );
};
