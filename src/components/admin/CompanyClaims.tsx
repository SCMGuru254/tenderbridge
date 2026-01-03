import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, FileText, Building2 } from "lucide-react";

export function CompanyClaims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('company_claims')
        .select(`
          *,
          company:companies(name),
          user:profiles(full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (claimId: string) => {
    try {
      const { error } = await supabase.rpc('approve_company_claim', { p_claim_id: claimId });
      if (error) throw error;
      toast.success('Claim approved');
      fetchClaims();
    } catch (error) {
      toast.error('Failed to approve claim');
    }
  };

  const handleReject = async (claimId: string) => {
    try {
      const { error } = await supabase
        .from('company_claims')
        .update({ status: 'rejected' })
        .eq('id', claimId);
      
      if (error) throw error;
      toast.success('Claim rejected');
      fetchClaims();
    } catch (error) {
      toast.error('Failed to reject claim');
    }
  };

  if (loading) return <div>Loading claims...</div>;

  return (
    <div className="space-y-4">
      {claims.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No pending business claims.
          </CardContent>
        </Card>
      ) : (
        claims.map((claim) => (
          <Card key={claim.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{claim.company?.name || 'Unknown Company'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Claimed by: {claim.user?.full_name} ({claim.user?.email})
                  </p>
                  {claim.proof_document && (
                    <a 
                      href={claim.proof_document} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
                    >
                      <FileText className="h-3 w-3" />
                      View Proof Document
                    </a>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted: {new Date(claim.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleReject(claim.id)} className="text-red-600 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" onClick={() => handleApprove(claim.id)} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
