import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Navigation = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

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
            <Link to="/blog" className="text-gray-700 hover:text-primary">
              Blog
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/post-job")}
              >
                Post a Job
              </Button>
            ) : (
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};