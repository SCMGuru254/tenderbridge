import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Users, MapPin, Globe } from "lucide-react";

const CompanySignup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register your company",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!formData.name || !formData.description || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if user already has a company
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingCompany) {
        toast({
          title: "Company already exists",
          description: "You have already registered a company. You can update it from your profile.",
          variant: "destructive",
        });
        navigate("/profile");
        return;
      }

      // Create new company
      const { error } = await supabase
        .from('companies')
        .insert({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          website: formData.website || null,
          user_id: user.id,
          verification_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Company registered successfully!",
        description: "Your company is now registered and pending verification. You can now post jobs.",
      });
      
      navigate("/companies");
    } catch (error: any) {
      console.error("Company registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register company",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Building2 className="h-6 w-6" />
            Register Your Company
          </CardTitle>
          <p className="text-muted-foreground">
            Join TenderZville as a verified company and start posting jobs to connect with supply chain professionals.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Name *
              </Label>
              <Input
                id="company-name"
                placeholder="Enter your company name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-description" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Company Description *
              </Label>
              <Textarea
                id="company-description"
                placeholder="Describe your company, its mission, and what makes it unique"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="company-location"
                placeholder="City, Country (e.g., Nairobi, Kenya)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="company-website"
                type="url"
                placeholder="https://www.yourcompany.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your company will be reviewed for verification</li>
                <li>• Once verified, you can post unlimited jobs</li>
                <li>• You'll be able to manage job applications</li>
                <li>• Access to company analytics and insights</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Company"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have a company account?{" "}
              <Button variant="link" onClick={() => navigate("/companies")} className="p-0">
                View Companies Directory
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySignup;