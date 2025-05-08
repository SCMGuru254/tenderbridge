
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-purple-700 to-indigo-800 dark:from-purple-900 dark:to-indigo-900 text-white py-12 px-4 rounded-lg">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Join Our Business Development Team
        </h1>
        <p className="text-lg md:text-xl opacity-95 max-w-2xl">
          Help build Kenya's premier Supply Chain jobs platform through strategic partnerships, 
          customer acquisition, and innovative revenue models.
        </p>
        <div className="mt-6">
          <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
            <Link to="/careers?tab=apply">Apply Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
