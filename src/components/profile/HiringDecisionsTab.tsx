
import React from "react";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { HiringDecision } from "@/types/profiles";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HiringDecisionsTabProps {
  hiringDecisions: HiringDecision[];
}

const HiringDecisionsTab = ({ hiringDecisions }: HiringDecisionsTabProps) => {
  return (
    <>
      <h3 className="font-medium mb-4">Hiring Decisions</h3>
      {hiringDecisions.length === 0 ? (
        <p className="text-sm text-gray-500">No hiring decisions have been recorded for you yet.</p>
      ) : (
        <div className="space-y-4">
          {hiringDecisions.map((decision) => (
            <Card key={decision.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {decision.employer.avatar_url ? (
                      <AvatarImage src={decision.employer.avatar_url} alt={decision.employer.full_name || "Employer"} />
                    ) : (
                      <AvatarFallback>
                        {decision.employer.full_name ? decision.employer.full_name[0].toUpperCase() : <User />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{decision.employer.full_name}</div>
                    {decision.employer.company && (
                      <div className="text-sm text-gray-500">{decision.employer.company}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(decision.decision_date), "MMM d, yyyy")}
                  </div>
                </div>
                {decision.notes && (
                  <div className="mt-3 text-sm p-3 bg-secondary/10 rounded-md">
                    {decision.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default HiringDecisionsTab;
