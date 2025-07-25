import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useAuth } from "@/hooks/useAuth";

export const Layout = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-4">
        <Outlet />
      </main>
      {/* Only show mobile navigation on mobile devices */}
      <div className="block md:hidden">
        <MobileNavigation />
      </div>
    </div>
  );
};