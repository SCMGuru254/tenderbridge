
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobData } from "@/hooks/useJobData";
import { filterJobs } from "@/utils/jobUtils";
import { JobFilters } from "@/components/JobFilters";
import { JobList } from "@/components/JobList";
import { JobRefreshButton } from "@/components/JobRefreshButton";
import { SalaryAnalyzer } from "@/components/SalaryAnalyzer";
import { Mentorship } from "@/components/Mentorship";
import { JobMatchingChat } from "@/components/JobMatchingChat";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState("jobs");
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
      
      {/* Main tabs for the entire page */}
      <Tabs defaultValue="jobs" className="mb-8" value={mainTab} onValueChange={setMainTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="chat">Job Matching</TabsTrigger>
          <TabsTrigger value="salary">Salary Analyzer</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        </TabsList>
        
        {/* Job Listings Content */}
        <TabsContent value="jobs" className="mt-4">
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
        </TabsContent>
        
        {/* Job Matching Chat Content */}
        <TabsContent value="chat" className="mt-4">
          <JobMatchingChat />
        </TabsContent>
        
        {/* Salary Analyzer Content */}
        <TabsContent value="salary" className="mt-4">
          <SalaryAnalyzer />
        </TabsContent>
        
        {/* Mentorship Content */}
        <TabsContent value="mentorship" className="mt-4">
          <Mentorship />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Jobs;
