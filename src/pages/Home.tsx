import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to SupplyChain_KE</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your gateway to supply chain opportunities in Kenya
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/jobs">
            <Button size="lg">Find Jobs</Button>
          </Link>
          <Link to="/companies">
            <Button size="lg" variant="outline">Browse Companies</Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Job Search</CardTitle>
            <CardDescription>Find your next supply chain role</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/jobs">
              <Button variant="link">Browse Jobs →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Resources</CardTitle>
            <CardDescription>Tools to advance your career</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/interview-prep">
              <Button variant="link">Get Started →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Free Services</CardTitle>
            <CardDescription>CV Review & Career Coaching</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/free-services">
              <Button variant="link">Learn More →</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 