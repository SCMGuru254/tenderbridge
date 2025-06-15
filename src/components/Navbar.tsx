
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl">
            SupplyChain_KE
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                {/* Removed signOut as it's not present in useAuth */}
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
