
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useJobData } from "@/hooks/useJobData";
import { filterJobs } from "@/utils/jobUtils";
import { JobFilters } from "@/components/JobFilters";
import { MobileJobFilters } from "@/components/MobileJobFilters";
import { JobList } from "@/components/JobList";
import { JobRefreshButton } from "@/components/JobRefreshButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobsMainContentProps {
  onRefreshComplete: () => void;
}

export const JobsMainContent = ({ onRefreshComplete }: JobsMainContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [onlyRecent, setOnlyRecent] = useState(true); // Default to showing only recent jobs
  const isMobile = useIsMobile();
  
  const { 
    allJobs, 
    isLoading, 
    activeTab, 
    setActiveTab,
    errors
  } = useJobData();

  // Filter jobs based on search term, category, and recent filter
  const filteredJobs = filterJobs(allJobs, { searchTerm, category, onlyRecent });
  const jobFetchError = errors.postedJobsError || errors.scrapedJobsError;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Supply Chain Jobs in Kenya</h1>
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Switch
              id="recent-jobs"
              checked={onlyRecent}
              onCheckedChange={setOnlyRecent}
            />
            <Label htmlFor="recent-jobs" className="text-sm">
              Show only jobs posted in last 24 hours
            </Label>
          </div>
        </div>
        <JobRefreshButton onRefreshComplete={onRefreshComplete} />
      </div>
      
      <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
            <TabsTrigger value="scraped">External Jobs</TabsTrigger>
          </TabsList>
        </ScrollArea>
      </Tabs>

      {isMobile ? (
        <MobileJobFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
        />
      ) : (
        <JobFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
        />
      )}
      
      <JobList jobs={filteredJobs} isLoading={isLoading} error={jobFetchError} />
    </div>
  );
};
