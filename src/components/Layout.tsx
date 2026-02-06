import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MobileNavigation } from "@/components/MobileNavigation";
import Footer from "@/components/Footer";
import { CookieConsentBanner } from "@/components/compliance/CookieConsentBanner";

export const Layout = () => {
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-24 md:pb-8">
        <Outlet />
      </main>
      {/* Show mobile navigation on all pages for mobile devices */}
      <MobileNavigation />
      <Footer />
      <CookieConsentBanner />
    </div>
  );
};