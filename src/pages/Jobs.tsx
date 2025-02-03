import { useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PostedJob = {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  companies?: {
    name: string | null;
    location: string | null;
  } | null;
}

type ScrapedJob = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  description: string | null;
  job_type: string | null;
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("posted");

  const { data: postedJobs, isLoading: isLoadingPosted } = useQuery({
    queryKey: ['posted-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name,
            location
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data as PostedJob[];
    }
  });

  const { data: scrapedJobs, isLoading: isLoadingScraped } = useQuery({
    queryKey: ['scraped-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ScrapedJob[];
    }
  });

  const jobs = activeTab === "posted" ? postedJobs : scrapedJobs;
  const isLoading = activeTab === "posted" ? isLoadingPosted : isLoadingScraped;

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = !category || job.job_type === category;
    return matchesSearch && matchesCategory;
  });

  const getCompanyName = (job: PostedJob | ScrapedJob): string | null => {
    if ('companies' in job && job.companies) {
      return job.companies.name;
    }
    if ('company' in job) {
      return job.company;
    }
    return null;
  };

  const getLocation = (job: PostedJob | ScrapedJob): string | null => {
    if ('companies' in job && job.companies) {
      return job.companies.location;
    }
    if ('location' in job) {
      return job.location;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Supply Chain Jobs in Kenya</h1>
      
      <Tabs defaultValue="posted" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
          <TabsTrigger value="scraped">External Jobs</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={category ?? undefined} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : filteredJobs?.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No jobs found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredJobs?.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={getCompanyName(job)}
              location={getLocation(job)}
              type={job.job_type}
              category="Supply Chain"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;