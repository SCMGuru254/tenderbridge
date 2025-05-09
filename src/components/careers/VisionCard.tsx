
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
          We're creating Kenya's premier supply chain careers platform, connecting professionals with 
          opportunities across procurement, logistics, distribution, and inventory management.
        </p>
        <p>
          Join our remote-first team to help shape the future of supply chain recruitment in Kenya. 
          Our community-driven approach means your impact will be measured by the supply chain professionals 
          we serve every day.
        </p>
      </CardContent>
    </Card>
  );
};
