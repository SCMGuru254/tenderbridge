import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MobileNavigation } from "@/components/MobileNavigation";

export const Layout = () => {
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-4">
        <Outlet />
      </main>
      {/* Show mobile navigation on all pages for mobile devices */}
      <MobileNavigation />
    </div>
  );
};