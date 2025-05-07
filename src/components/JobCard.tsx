
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Building2, MapPin, BriefcaseIcon, Share2, Clock, ExternalLink, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { hasExternalUrl } from "../utils/jobUtils";
import { ShareToSocial } from './ShareToSocial';
import type { Database } from "../integrations/supabase/types";

interface JobCardProps {
  job: Database["public"]["Tables"]["scraped_jobs"]["Row"];
}

export function JobCard({ job }: JobCardProps) {
  const {
    title,
