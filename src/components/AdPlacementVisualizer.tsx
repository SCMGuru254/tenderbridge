
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getRecommendedAdsForPage, pageAdConfigurations } from "@/services/adPlacementGuide";

export function AdPlacementVisualizer() {
  const [selectedPage, setSelectedPage] = useState("home");
  const recommendations = getRecommendedAdsForPage(selectedPage);
  
  const pages = Object.keys(pageAdConfigurations);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ad Placement Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Select a page to view recommended ad placements:
          </p>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pages.map(page => (
                  <SelectItem key={page} value={page}>
                    {page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')} Page
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1).replace('-', ' ')} Page Recommendations
          </h3>
          
          {recommendations.length > 0 ? (
            <ul className="space-y-4">
              {recommendations.map((rec, index) => (
                <li key={index} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-medium">{rec.type.charAt(0).toUpperCase() + rec.type.slice(1)} Ad</div>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Position: {rec.position}</p>
                  <p className="text-sm">{rec.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No specific ad recommendations for this page.</p>
          )}
          
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Best Practices</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Limit to 1 ad per 5 screens of content</li>
              <li>Maintain at least 300px between ads</li>
              <li>Use responsive ad units that adapt to screen size</li>
              <li>Ensure ads are lazy-loaded to maintain page performance</li>
              <li>Avoid intrusive ad placements that interrupt core functionality</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
