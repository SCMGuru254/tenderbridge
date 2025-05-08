
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vote } from "lucide-react";
import { Link } from "react-router-dom";

export function CareersVotingCTA() {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5 text-purple-600" />
          Community Voting Initiative
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          We're selecting our next Business Development Lead through our community-led approach.
          View submitted vision proposals and vote for the candidates you believe will drive the
          most value for SupplyChain_KE.
        </p>
        <Button asChild className="bg-purple-700 hover:bg-purple-800">
          <Link to="/careers?tab=submissions">View & Vote on Proposals</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
