
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface RevenueModelCardProps {
  onSubmitClick: () => void;
}

export const RevenueModelCard = ({ onSubmitClick }: RevenueModelCardProps) => {
  return (
    <Card id="apply" className="bg-slate-50 dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-xl">Revenue Model</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Primary Revenue Streams</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Premium job listings</li>
              <li>Featured company profiles</li>
              <li>Corporate subscription packages</li>
              <li>Candidate profile highlights (50 KES lifetime)</li>
              <li>Sponsored industry reports</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Value-Added Services</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Resume building & optimization</li>
              <li>AI-based candidate matching</li>
              <li>Rewarded video credits (earn free CV reviews)</li>
              <li>Supply chain salary analysis</li>
              <li>Free monthly HR coaching opportunities</li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="font-semibold text-lg mb-3">Join our team by voting initiative</h3>
          <p className="mb-4">
            We believe in community-led growth. Our platform is built for and by supply chain practitioners. 
            Share your vision for enhancing the platform and let the community vote for the best ideas 
            that will drive traffic, engagement, and success.
          </p>
          <Button 
            className="bg-purple-700 hover:bg-purple-800 mt-2" 
            onClick={onSubmitClick}
          >
            Submit Your Vision
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
