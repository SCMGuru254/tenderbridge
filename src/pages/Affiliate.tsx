
import { AffiliateSignup } from '@/components/affiliate/AffiliateSignup';
import { AffiliateDashboard } from '@/components/affiliate/AffiliateDashboard';
import { useAffiliate } from '@/hooks/useAffiliate';
import { useUser } from '@/hooks/useUser';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Affiliate = () => {
  const { user, loading: userLoading } = useUser();
  const { affiliateProgram, loading: affiliateLoading } = useAffiliate();

  if (userLoading || affiliateLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access the affiliate program.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Affiliate Program</h1>
        {!affiliateProgram ? (
          <AffiliateSignup />
        ) : (
          <AffiliateDashboard />
        )}
      </div>
    </div>
  );
};

export default Affiliate;
