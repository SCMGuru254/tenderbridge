import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            SupplyChainKE
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/jobs" className="text-gray-700 hover:text-primary">
              Jobs
            </Link>
            <Link to="/discussions" className="text-gray-700 hover:text-primary">
              Discussions
            </Link>
            <Link to="/news" className="text-gray-700 hover:text-primary">
              News
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary">
              Blog
            </Link>
          </div>
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            Post a Job
          </Button>
        </div>
      </div>
    </nav>
  );
};