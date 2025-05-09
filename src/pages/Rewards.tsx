
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, Share2, Play, Users } from "lucide-react";

export default function Rewards() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">SupplyChain_KE Rewards Program</h1>
      <p className="text-muted-foreground mb-8">
        Earn points and unlock valuable career benefits
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Award className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Our point-based reward system</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The SupplyChain_KE rewards program allows users to earn points through platform engagement.
              These points can be redeemed for career-enhancing benefits that will help you stand out in 
              the competitive supply chain job market.
            </p>
            <p>
              Points are automatically tracked in your profile and benefits are unlocked as you reach 
              specific point thresholds.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Share2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Referral Benefits</CardTitle>
              <CardDescription>Earn points by growing our community</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              Refer colleagues to download our app and earn points for each successful installation.
              Users who achieve 20 successful installations receive priority access to free CV reviews
              from HR specialists and career coaching opportunities.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-1">
              <li>Each successful app installation: 5 points</li>
              <li>20 successful installations: 100 bonus points + priority access to free benefits</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Play className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Ad Engagement Rewards</CardTitle>
              <CardDescription>Watch ads, earn points</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              Support our platform by engaging with relevant, carefully selected ad content from 
              supply chain industry partners.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-1">
              <li>Each ad view: 1 point</li>
              <li>50+ ad views per month: 100 bonus points (equivalent to 20 referral installations)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Redeeming Your Points</CardTitle>
              <CardDescription>Valuable career benefits</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your accumulated points can be redeemed for various benefits to enhance your 
              supply chain career:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Free CV review from HR specialist: 100 points</li>
              <li>30-minute career coaching session: 200 points</li>
              <li>Profile highlight for increased visibility: 50 points</li>
              <li>Early access to premium features: 150 points</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Your privacy is important to us. When using our rewards program:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              All messaging services are provided by licensed third-party providers in compliance with 
              Communications Authority of Kenya regulations
            </li>
            <li>
              Referrals are tracked using anonymous installation codes to protect your contacts' privacy
            </li>
            <li>
              Ad engagement is entirely optional and implemented following local eCPM benchmarks 
              (165-275 KES per 1,000 views)
            </li>
            <li>
              Our booking system for coaching sessions is powered by a secure third-party platform to 
              protect both coaches and users
            </li>
          </ul>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            SupplyChain_KE reserves the right to modify the rewards program terms and point values at any time. 
            Points have no monetary value and cannot be transferred or sold.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
