
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { NotificationsManager } from "@/components/Notifications/NotificationsManager";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl">
            SupplyChain_KE
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/jobs"><Button variant="ghost">Jobs</Button></Link>
            <Link to="/supply-chain-insights"><Button variant="ghost">Insights</Button></Link>
            <Link to="/salary-analyzer"><Button variant="ghost">Salary</Button></Link>
            <Link to="/chat-assistant"><Button variant="ghost">Assistant</Button></Link>
            <Link to="/hire-my-skill"><Button variant="ghost">Hire My Skill</Button></Link>
            <Link to="/post-job"><Button variant="ghost">Post Job</Button></Link>
            <Link to="/my-applications"><Button variant="ghost">My Apps</Button></Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationsManager />
                <Link to="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
