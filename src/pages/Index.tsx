import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Next Supply Chain Career in Kenya
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The leading platform for supply chain, logistics, and procurement jobs in Kenya
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/discussions">Join Discussion</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Job Search</h3>
            <p className="text-gray-600">
              Find specialized roles in supply chain, logistics, and procurement
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Industry Insights</h3>
            <p className="text-gray-600">
              Stay updated with the latest supply chain news and trends
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Connect with other supply chain professionals in Kenya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;