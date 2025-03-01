
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

// Sample data for demo purposes - in production this would come from an API or database
const SAMPLE_SALARY_DATA = {
  "Supply Chain Manager": {
    "Kenya": { min: 150000, max: 350000, currency: "KES", period: "monthly" },
    "Tanzania": { min: 2500000, max: 6000000, currency: "TZS", period: "monthly" },
    "Uganda": { min: 4000000, max: 9000000, currency: "UGX", period: "monthly" },
    "Rwanda": { min: 1200000, max: 3000000, currency: "RWF", period: "monthly" }
  },
  "Logistics Coordinator": {
    "Kenya": { min: 60000, max: 120000, currency: "KES", period: "monthly" },
    "Tanzania": { min: 1000000, max: 2500000, currency: "TZS", period: "monthly" },
    "Uganda": { min: 1500000, max: 3500000, currency: "UGX", period: "monthly" },
    "Rwanda": { min: 500000, max: 1200000, currency: "RWF", period: "monthly" }
  },
  "Procurement Specialist": {
    "Kenya": { min: 80000, max: 180000, currency: "KES", period: "monthly" },
    "Tanzania": { min: 1500000, max: 3500000, currency: "TZS", period: "monthly" },
    "Uganda": { min: 2000000, max: 4500000, currency: "UGX", period: "monthly" },
    "Rwanda": { min: 800000, max: 1800000, currency: "RWF", period: "monthly" }
  },
  "Warehouse Manager": {
    "Kenya": { min: 100000, max: 200000, currency: "KES", period: "monthly" },
    "Tanzania": { min: 1800000, max: 4000000, currency: "TZS", period: "monthly" },
    "Uganda": { min: 2500000, max: 5500000, currency: "UGX", period: "monthly" },
    "Rwanda": { min: 900000, max: 2000000, currency: "RWF", period: "monthly" }
  },
  "Inventory Analyst": {
    "Kenya": { min: 70000, max: 150000, currency: "KES", period: "monthly" },
    "Tanzania": { min: 1200000, max: 2800000, currency: "TZS", period: "monthly" },
    "Uganda": { min: 1800000, max: 4000000, currency: "UGX", period: "monthly" },
    "Rwanda": { min: 600000, max: 1500000, currency: "RWF", period: "monthly" }
  }
};

type SubmissionForm = {
  role: string;
  country: string;
  salary: string;
  experience: string;
  education: string;
  industry: string;
  details: string;
};

export const SalaryAnalyzer = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [salaryData, setSalaryData] = useState<any>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState<SubmissionForm>({
    role: "",
    country: "",
    salary: "",
    experience: "",
    education: "",
    industry: "",
    details: ""
  });

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    if (selectedCountry && role) {
      setSalaryData(SAMPLE_SALARY_DATA[role]?.[selectedCountry]);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    if (selectedRole && country) {
      setSalaryData(SAMPLE_SALARY_DATA[selectedRole]?.[country]);
    }
  };

  const handleFormChange = (field: keyof SubmissionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitSalary = () => {
    // In a real app, this would send data to the server
    console.log("Submitting salary data:", formData);
    
    // For demo, just show a success toast
    toast.success("Thank you for your contribution! Your anonymous salary data helps others in the community.");
    
    // Reset form
    setFormData({
      role: "",
      country: "",
      salary: "",
      experience: "",
      education: "",
      industry: "",
      details: ""
    });
    setShowSubmitForm(false);
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(value) + " " + currency;
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">East Africa Salary Analyzer</CardTitle>
          <CardDescription>
            Compare supply chain salaries across East Africa to make informed career decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="role">Select Role</Label>
              <Select onValueChange={handleRoleChange} value={selectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(SAMPLE_SALARY_DATA).map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="country">Select Country</Label>
              <Select onValueChange={handleCountryChange} value={selectedCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Choose a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="Tanzania">Tanzania</SelectItem>
                  <SelectItem value="Uganda">Uganda</SelectItem>
                  <SelectItem value="Rwanda">Rwanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {salaryData && (
            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <h3 className="font-semibold text-lg mb-2">Salary Range for {selectedRole} in {selectedCountry}</h3>
              <p className="text-md">
                {formatCurrency(salaryData.min, salaryData.currency)} - {formatCurrency(salaryData.max, salaryData.currency)} {salaryData.period}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Data based on community contributions and market research. Last updated June 2024.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center">
            <p className="text-center mb-4">
              Help improve our data by anonymously sharing your salary information
            </p>
            <Button 
              onClick={() => setShowSubmitForm(!showSubmitForm)} 
              variant="outline"
            >
              {showSubmitForm ? "Cancel" : "Submit Your Salary Data"}
            </Button>
          </div>

          {showSubmitForm && (
            <div className="mt-6 p-4 border rounded-md">
              <h3 className="font-semibold text-lg mb-4">Submit Anonymous Salary Data</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="form-role">Role/Position</Label>
                    <Input 
                      id="form-role" 
                      value={formData.role}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      placeholder="e.g. Supply Chain Manager"
                    />
                  </div>
                  <div>
                    <Label htmlFor="form-country">Country</Label>
                    <Select onValueChange={(val) => handleFormChange('country', val)} value={formData.country}>
                      <SelectTrigger id="form-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Tanzania">Tanzania</SelectItem>
                        <SelectItem value="Uganda">Uganda</SelectItem>
                        <SelectItem value="Rwanda">Rwanda</SelectItem>
                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="form-salary">Monthly Salary (with currency)</Label>
                    <Input 
                      id="form-salary" 
                      value={formData.salary}
                      onChange={(e) => handleFormChange('salary', e.target.value)}
                      placeholder="e.g. 120000 KES"
                    />
                  </div>
                  <div>
                    <Label htmlFor="form-experience">Years of Experience</Label>
                    <Select onValueChange={(val) => handleFormChange('experience', val)} value={formData.experience}>
                      <SelectTrigger id="form-experience">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="form-education">Education Level</Label>
                    <Select onValueChange={(val) => handleFormChange('education', val)} value={formData.education}>
                      <SelectTrigger id="form-education">
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Bachelor's">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's">Master's Degree</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="form-industry">Industry</Label>
                    <Select onValueChange={(val) => handleFormChange('industry', val)} value={formData.industry}>
                      <SelectTrigger id="form-industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="FMCG">FMCG</SelectItem>
                        <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="NGO">NGO/Non-profit</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="form-details">Additional Details (optional)</Label>
                  <Textarea 
                    id="form-details" 
                    value={formData.details}
                    onChange={(e) => handleFormChange('details', e.target.value)}
                    placeholder="Any other relevant details about your role, benefits, or context"
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSubmitSalary} className="w-full md:w-auto">
                    Submit Anonymous Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            All submissions are completely anonymous. We do not collect any personally identifiable information.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
