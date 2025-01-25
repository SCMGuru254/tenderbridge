import { useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - replace with real API data later
const MOCK_JOBS = [
  {
    id: 1,
    title: "Supply Chain Manager",
    company: "East African Breweries",
    location: "Nairobi",
    type: "Full-time",
    category: "Supply Chain",
  },
  {
    id: 2,
    title: "Logistics Coordinator",
    company: "DHL Kenya",
    location: "Mombasa",
    type: "Full-time",
    category: "Logistics",
  },
  {
    id: 3,
    title: "Procurement Officer",
    company: "Safaricom",
    location: "Nairobi",
    type: "Contract",
    category: "Procurement",
  },
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Supply Chain Jobs in Kenya</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supply-chain">Supply Chain</SelectItem>
            <SelectItem value="logistics">Logistics</SelectItem>
            <SelectItem value="procurement">Procurement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_JOBS.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;