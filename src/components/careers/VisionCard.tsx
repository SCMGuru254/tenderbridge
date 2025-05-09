
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
          "The roles are young, new and well, you'll be running your business and meeting your own objectives. 
          Since the app is supply chain jobs only, your vision and deliverables will be measured by the supply 
          chain community."
        </p>
        <p>
          "No weird interview, because SupplyChain_KE is just starting. So you set the pace. 
          In case you want an office, well this might not be for you, as most work can be done remotely."
        </p>
      </CardContent>
    </Card>
  );
};
