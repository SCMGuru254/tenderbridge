
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
import { JobsBizDevelopment } from "@/components/JobsBizDevelopment";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="container mx-auto px-4 py-12 mt-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Supply Chain Jobs in Kenya</h1>
        <JobRefreshButton onRefreshComplete={handleRefreshComplete} />
      </div>
      
      {/* Main tabs for the entire page */}
      <Tabs defaultValue="jobs" className="mb-8" value={mainTab} onValueChange={setMainTab}>
        <ScrollArea className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="chat">Job Matching</TabsTrigger>
            <TabsTrigger value="salary">Salary Analyzer</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            <TabsTrigger value="careers">Join Our Team</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
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
        
        {/* Business Development Careers Content */}
        <TabsContent value="careers" className="mt-4">
          <JobsBizDevelopment />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Jobs;
