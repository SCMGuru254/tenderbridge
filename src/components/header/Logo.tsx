
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react"; // Import the Briefcase icon from lucide-react

export const Logo = () => {
  return (
    <div className="flex items-center gap-6">
      <Link to="/" className="flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-primary" /> {/* Replace favicon with Briefcase icon */}
        <span className="font-bold text-lg md:text-xl whitespace-nowrap">SupplyChain_KE</span>
      </Link>
    </div>
  );
};
