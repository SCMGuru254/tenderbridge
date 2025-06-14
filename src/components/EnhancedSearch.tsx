
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X, TrendingUp } from "lucide-react";

interface EnhancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  availableCategories?: string[];
  availableSources?: string[];
}

export const EnhancedSearch = ({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
}: EnhancedSearchProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search suggestions based on supply chain terms
  const supplyChainTerms = useMemo(() => [
    'logistics optimization', 'supply chain disruption', 'inventory management',
    'freight transportation', 'warehouse automation', 'procurement strategy',
    'distribution networks', 'cold chain logistics', 'last mile delivery',
    'sustainable supply chain', 'digital transformation', 'supply chain visibility'
  ], []);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    return supplyChainTerms.filter(term =>
      term.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, supplyChainTerms]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    selectedTags.forEach(tag => onTagToggle(tag));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Enhanced Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search supply chain news, jobs, and insights..."
                value={searchTerm}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {/* Active Filters Display */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onTagToggle(tag)}
                />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Popular Tags Quick Select */}
        <div>
          <label className="text-sm font-medium mb-2 block">Popular Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 10).map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
