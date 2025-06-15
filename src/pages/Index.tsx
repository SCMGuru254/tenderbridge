
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobList } from "@/components/JobList";
import { JobFilters } from "@/components/JobFilters";
import { JobRefreshButton } from "@/components/JobRefreshButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileJobFilters } from "@/components/MobileJobFilters";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");

  console.log("Index page - Rendering with filters:", {
    category: selectedCategory,
    location: selectedLocation,
    jobType: selectedJobType
  });

  const {
    data: jobs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["scraped_jobs", selectedCategory, selectedLocation, selectedJobType],
    queryFn: async () => {
      console.log("Index - Fetching scraped jobs with filters:", {
        category: selectedCategory,
        location: selectedLocation,
        jobType: selectedJobType
      });

      let query = supabase
        .from("scraped_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters if they are selected
      if (selectedCategory) {
        query = query.ilike("category", `%${selectedCategory}%`);
      }
      
      if (selectedLocation) {
        query = query.ilike("location", `%${selectedLocation}%`);
      }
      
      if (selectedJobType) {
        query = query.ilike("job_type", `%${selectedJobType}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Index - Database error:", error);
        throw error;
      }

      console.log("Index - Raw scraped jobs data:", data);
      console.log("Index - Number of jobs fetched:", data?.length || 0);

      return data || [];
    },
    retry: 3,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const handleRefresh = () => {
    console.log("Index - Manual refresh triggered");
    refetch();
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedLocation("");
    setSelectedJobType("");
  };

  // Convert error to PostgrestError type to match expected interface
  const postgrestError: PostgrestError | null = error ? {
    message: error.message,
    details: (error as any).details || '',
    hint: (error as any).hint || '',
    code: (error as any).code || ''
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="lg:w-1/4">
            {isMobile ? (
              <MobileJobFilters
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                selectedJobType={selectedJobType}
                onCategoryChange={setSelectedCategory}
                onLocationChange={setSelectedLocation}
                onJobTypeChange={setSelectedJobType}
                onClearFilters={clearFilters}
              />
            ) : (
              <JobFilters
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                selectedJobType={selectedJobType}
                onCategoryChange={setSelectedCategory}
                onLocationChange={setSelectedLocation}
                onJobTypeChange={setSelectedJobType}
                onClearFilters={clearFilters}
              />
            )}
          </div>

          {/* Main content */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Latest Supply Chain Jobs
              </h1>
              <JobRefreshButton onRefresh={handleRefresh} />
            </div>

            <JobList 
              jobs={jobs} 
              isLoading={isLoading} 
              error={postgrestError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
