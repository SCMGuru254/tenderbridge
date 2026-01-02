import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContextFull";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employer' | 'user';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [roleLoading, setRoleLoading] = useState(!!requiredRole);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkRole = async () => {
      if (!user || !requiredRole) {
          if (mounted) setRoleLoading(false);
          return;
      }

      try {
          // Check "user_roles" table for Admin
          if (requiredRole === 'admin') {
              const { data } = await supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', user.id)
                  .eq('role', 'admin')
                  .maybeSingle(); 
              
              if (mounted) setHasRole(!!data);
          } else {
              // Default true for non-admin roles for now (or implement logic)
              if (mounted) setHasRole(true); 
          }
      } catch (error) {
          console.error("Role check failed", error);
          if (mounted) setHasRole(false);
      } finally {
          if (mounted) setRoleLoading(false);
      }
    };

    if (!loading && user) {
        checkRole();
    } else if (!loading && !user) {
        setRoleLoading(false);
    }

    return () => { mounted = false; };
  }, [user, loading, requiredRole]);

  if (loading || roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Stealth Mode: If role missing, redirect to Home (Page doesn't exist to them)
  if (requiredRole && !hasRole) {
      return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
