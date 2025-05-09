
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, ArrowUpRight } from "lucide-react";

export const TenderzvilleNewsList = () => {
  const tenderzvilleUrl = "https://tenderzville-portal.co.ke/blog-page/";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-blue-100 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <h3 className="font-medium text-green-800 mb-2 text-xl">Tenderzville Portal Blog</h3>
            <p className="text-blue-700 mb-4">
              Stay updated with the latest procurement opportunities, tender information, and 
              supply chain insights from Kenya's leading tender platform.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Tenderzville Portal publishes valuable content about government tenders, 
              supply chain regulations, and industry news relevant to supply chain professionals in Kenya.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Procurement", "Tenders", "Government", "Regulations", "Supply Chain"].map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button asChild className="mt-2">
              <a href={tenderzvilleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                Visit Tenderzville Blog
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </a>
            </Button>
          </div>
          <div className="w-full md:w-auto flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <Calendar className="w-16 h-16 text-blue-600" />
              <p className="text-xs text-center mt-2 text-gray-500">Updated daily</p>
            </div>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-slate-50">
          <h3 className="font-medium">Why Visit Tenderzville Portal?</h3>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>Access to latest government tender notices</li>
            <li>Procurement news and policy updates</li>
            <li>Supply chain industry insights specific to Kenya</li>
            <li>Procurement training and certification information</li>
            <li>Expert advice on bidding strategies</li>
          </ul>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 flex justify-center">
          <Button asChild variant="outline">
            <a href={tenderzvilleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              Read Latest Articles
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
