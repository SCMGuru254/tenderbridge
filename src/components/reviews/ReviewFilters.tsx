import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ReviewFilterProps {
  onFilterChange: (filters: ReviewFilters) => void;
}

export interface ReviewFilters {
  sortBy: 'date' | 'rating' | 'relevance';
  rating: number | null;
  employmentStatus: 'all' | 'current' | 'former' | 'interview';
}

export const ReviewFilters: React.FC<ReviewFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'date',
    rating: null,
    employmentStatus: 'all'
  });

  const handleFilterChange = (key: keyof ReviewFilters, value: string | number | null) => {
    const newFilters = { 
      ...filters, 
      [key]: key === 'sortBy' 
        ? value as ReviewFilters['sortBy']
        : key === 'employmentStatus'
        ? value as ReviewFilters['employmentStatus']
        : key === 'rating'
        ? value as ReviewFilters['rating']
        : value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: ReviewFilters = {
      sortBy: 'date',
      rating: null,
      employmentStatus: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Sort By</Label>
          <Select 
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <option value="date">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="relevance">Most Relevant</option>
          </Select>
        </div>

        <div>
          <Label>Rating</Label>
          <Select 
            value={filters.rating?.toString() || ''}
            onValueChange={(value) => handleFilterChange('rating', value ? parseInt(value) : null)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars & Up</option>
            <option value="3">3 Stars & Up</option>
            <option value="2">2 Stars & Up</option>
            <option value="1">1 Star & Up</option>
          </Select>
        </div>

        <div>
          <Label>Employment Status</Label>
          <Select 
            value={filters.employmentStatus}
            onValueChange={(value) => handleFilterChange('employmentStatus', value)}
          >
            <option value="all">All Status</option>
            <option value="current">Current Employees</option>
            <option value="former">Former Employees</option>
            <option value="interview">Interviewed</option>
          </Select>
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={resetFilters}
        className="w-full md:w-auto"
      >
        Reset Filters
      </Button>
    </div>
  );
};