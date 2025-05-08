
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const VisionCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Our Vision</CardTitle>
        <CardDescription>
          Building the definitive Supply Chain careers platform for Kenya
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          "The role is demanding. The expectations are clear: leading our multi-city procurement, 
          inventory, logistics, and partner management strategy, designing frameworks that prevent 
          stockouts and wastage, management of vendor relations to last-mile delivery - and this 
          would be done with limited resources, and a lot of hustle—in the beginning."
        </p>
        <p>
          "We're offering a structure that leans on value. You won't be walking into a plush seat. 
          The first months will be an immersive co-leadership phase with stipend. After that, it transitions 
          into full managerial role, plus other benefits tied to your office, milestones and impact."
        </p>
      </CardContent>
    </Card>
  );
};
