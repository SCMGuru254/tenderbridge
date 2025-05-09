import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface AdSectionProps {
  type: "banner" | "sidebar" | "inline" | "interstitial";
  position: string;
  className?: string;
}

export function AdSection({ type, position, className = "" }: AdSectionProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Initialize ad service here
    const initializeAd = async () => {
      try {
        // Replace with actual ad service initialization
        // Example: await adService.initialize();
        setAdLoaded(true);
      } catch (error) {
        console.error("Error loading ad:", error);
        setAdError(true);
      }
    };

    initializeAd();
  }, [type, position]);

  if (adError) {
    return null;
  }

  const getAdStyles = () => {
    switch (type) {
      case "banner":
        return "w-full h-[90px] md:h-[120px]";
      case "sidebar":
        return "w-[300px] h-[600px]";
      case "inline":
        return "w-full h-[250px]";
      case "interstitial":
        return "fixed inset-0 z-50";
      default:
        return "";
    }
  };

  return (
    <Card className={`${getAdStyles()} ${className} overflow-hidden`}>
      {!adLoaded ? (
        <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
          <span className="text-sm text-muted-foreground">Loading ad...</span>
        </div>
      ) : (
        <div id={`ad-${type}-${position}`} className="w-full h-full">
          {/* Ad content will be injected here by the ad service */}
        </div>
      )}
    </Card>
  );
} 