import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import type { Job } from '@/types/database';

interface JobFilters {
  location?: string;
  jobType?: Job['job_type'];
  experienceLevel?: Job['experience_level'];
  minSalary?: number;
  isRemote?: boolean;
  skills?: string[];
}

interface JobFiltersProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const handleFilterChange = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K]
  ) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Filter */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            placeholder="Enter location..."
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>

        {/* Job Type Filter */}
        <div className="space-y-2">
          <Label>Job Type</Label>
          <Select
            value={filters.jobType || ''}
            onValueChange={(value) => 
              handleFilterChange('jobType', value as Job['job_type'])
            }
          >
            <option value="">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="temporary">Temporary</option>
          </Select>
        </div>

        {/* Experience Level Filter */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select
            value={filters.experienceLevel || ''}
            onValueChange={(value) =>
              handleFilterChange('experienceLevel', value as Job['experience_level'])
            }
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="intermediate">Intermediate</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="executive">Executive</option>
          </Select>
        </div>

        {/* Minimum Salary Filter */}
        <div className="space-y-2">
          <Label>Minimum Salary (KES)</Label>
          <Slider
            defaultValue={[0]}
            max={500000}
            step={10000}
            value={[filters.minSalary || 0]}
            onValueChange={(value) => handleFilterChange('minSalary', value[0])}
          />
          <div className="text-sm text-muted-foreground">
            KES {(filters.minSalary || 0).toLocaleString()}
          </div>
        </div>

        {/* Remote Work Filter */}
        <div className="flex items-center justify-between">
          <Label>Remote Only</Label>
          <Switch
            checked={filters.isRemote || false}
            onCheckedChange={(checked) => handleFilterChange('isRemote', checked)}
          />
        </div>

        {/* Skills Filter */}
        <div className="space-y-2">
          <Label>Required Skills</Label>
          <Input
            placeholder="Enter skills, separated by commas..."
            value={filters.skills?.join(', ') || ''}
            onChange={(e) => {
              const skills = e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
              handleFilterChange('skills', skills);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};