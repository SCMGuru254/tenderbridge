
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobData } from "@/hooks/useJobData";
import { filterJobs } from "@/utils/jobUtils";
import { JobFilters } from "@/components/JobFilters";
import { JobList } from "@/components/JobList";
import { JobRefreshButton } from "@/components/JobRefreshButton";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const { 
    allJobs, 
    isLoading, 
    activeTab, 
    setActiveTab, 
    refetchPostedJobs, 
    refetchScrapedJobs 
  } = useJobData();

  // Filter jobs based on search term and category
  const filteredJobs = filterJobs(allJobs, { searchTerm, category });

  const handleRefreshComplete = () => {
    // Refresh both posted and scraped jobs to ensure we have the latest data
    refetchPostedJobs();
    refetchScrapedJobs();
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Supply Chain Jobs in Kenya</h1>
        <JobRefreshButton onRefreshComplete={handleRefreshComplete} />
      </div>
      
      <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
          <TabsTrigger value="scraped">External Jobs</TabsTrigger>
        </TabsList>
      </Tabs>

      <JobFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
      />

      <JobList jobs={filteredJobs} isLoading={isLoading} />
    </div>
  );
};

export default Jobs;
