import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface AdBannerProps {
  position: 'header' | 'sidebar' | 'content';
  className?: string;
}

export function AdBanner({ position, className = "" }: AdBannerProps) {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasRecordedView = useRef(false);

  useEffect(() => {
    fetchAd();
  }, [position]);

  const fetchAd = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('position', position)
        .eq('status', 'active')
        .limit(5); // Get pool of 5

      if (error) throw error;

      if (data && data.length > 0) {
        // Random Selection Rotation
        const randomAd = data[Math.floor(Math.random() * data.length)];
        setAd(randomAd);
        
        // Record View (Once per mount)
        if (!hasRecordedView.current) {
            recordView(randomAd.id);
            hasRecordedView.current = true;
        }
      }
    } catch (err) {
      console.error("Ad Fetch Error", err);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async (adId: string) => {
      // Call RPC
      const { data } = await supabase.rpc('record_ad_view', { ad_id: adId });
      // Optional: Toast "Points Earned!" if data.points_awarded (might be spammy though)
  };

  if (loading || !ad) return null; // Collapse if no ad

  return (
    <div className={`relative group ${className}`}>
      {/* Ad Label for Transparency */}
      <div className="absolute top-0 right-0 bg-gray-200 text-[10px] px-1 text-gray-500 z-10 opacity-70">
          Sponsored
      </div>

      <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="block">
          <img 
              src={ad.image_url} 
              alt={ad.title} 
              className="w-full h-auto object-cover rounded-md shadow-sm border hover:opacity-95 transition-opacity"
          />
      </a>
    </div>
  );
}
