
import { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Heart, ExternalLink } from "lucide-react";

interface SwipeableJobCardProps {
  job: {
    id: string;
    title: string;
    company: string | null;
    location: string | null;
    job_type?: string | null;
    category?: string;
    job_url?: string | null;
    application_deadline?: string | null;
    social_shares?: Record<string, any>;
  };
  onSave: () => void;
  onShare: () => void;
}

export function SwipeableJobCard({ job, onSave, onShare }: SwipeableJobCardProps) {
  const [x, setX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const swipeThreshold = 100;

  const handlePan = (_: any, info: PanInfo) => {
    setX(info.offset.x);
    setIsDragging(true);
  };

  const handlePanEnd = () => {
    setIsDragging(false);
    if (Math.abs(x) > swipeThreshold) {
      if (x > 0) {
        onSave();
      } else {
        onShare();
      }
    }
    setX(0);
  };

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const dragTransition = {
    type: "spring",
    stiffness: 260,
    damping: 20,
  };

  return (
    <motion.div
      className="relative"
      style={{ x: x }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      transition={isDragging ? dragTransition : { duration: 0.3 }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
              <div className="flex items-center text-muted-foreground">
                <Building2 className="h-4 w-4 mr-1" />
                <span>{job.company || "Company not specified"}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {job.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.job_type && (
                <div className="flex items-center text-sm">
                  <Heart className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.job_type}</span>
                </div>
              )}
            </div>

            {job.category && <Badge variant="outline">{job.category}</Badge>}

            <div className="flex items-center justify-between pt-2">
              <a href={job.job_url || undefined} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="ml-1 h-4 w-4" />
                Apply
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
