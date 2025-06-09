import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Sample data for demo purposes - in production this would come from an API or database
const SAMPLE_SALARY_DATA: Record<string, Record<string, any>> = {
  "Supply Chain Manager": {
    "Kenya": { 
      min: 150000, max: 350000, currency: "KES", period: "monthly",
      regions: {
        "Nairobi": { min: 180000, max: 400000 },
        "Mombasa": { min: 150000, max: 320000 },
        "Kisumu": { min: 130000, max: 280000 },
        "Nakuru": { min: 120000, max: 250000 }
      }
    },
    "Tanzania": { 
      min: 2500000, max: 6000000, currency: "TZS", period: "monthly",
      regions: {
        "Dar es Salaam": { min: 3000000, max: 7000000 },
        "Arusha": { min: 2200000, max: 5500000 },
        "Mwanza": { min: 2000000, max: 5000000 }
      }
    },
    "Uganda": { 
      min: 4000000, max: 9000000, currency: "UGX", period: "monthly",
      regions: {
        "Kampala": { min: 4500000, max: 10000000 },
        "Entebbe": { min: 3800000, max: 8500000 },
        "Jinja": { min: 3500000, max: 7500000 }
      }
    },
    "Rwanda": { 
      min: 1200000, max: 3000000, currency: "RWF", period: "monthly",
      regions: {
        "Kigali": { min: 1500000, max: 3500000 },
        "Other regions": { min: 1000000, max: 2500000 }
      }
    }
  },
  "Logistics Coordinator": {
    "Kenya": { 
      min: 60000, max: 120000, currency: "KES", period: "monthly",
      regions: {
        "Nairobi": { min: 70000, max: 140000 },
        "Mombasa": { min: 65000, max: 130000 },
        "Other regions": { min: 50000, max: 100000 }
      }
    },
    "Tanzania": { 
      min: 1000000, max: 2500000, currency: "TZS", period: "monthly",
      regions: {
        "Dar es Salaam": { min: 1200000, max: 2800000 },
        "Other regions": { min: 900000, max: 2200000 }
      }
    },
    "Uganda": { 
      min: 1500000, max: 3500000, currency: "UGX", period: "monthly",
      regions: {
        "Kampala": { min: 1800000, max: 4000000 },
        "Other regions": { min: 1300000, max: 3000000 }
      }
    },
    "Rwanda": { 
      min: 500000, max: 1200000, currency: "RWF", period: "monthly",
      regions: {
        "Kigali": { min: 600000, max: 1500000 },
        "Other regions": { min: 450000, max: 1000000 }
      }
    }
  },
  "Procurement Officer": { min: 70000, max: 140000, currency: "KES", period: "monthly" },
  "Procurement Manager": { min: 120000, max: 250000, currency: "KES", period: "monthly" },
  "Procurement Director": { min: 300000, max: 600000, currency: "KES", period: "monthly" },
  "Warehouse Supervisor": { min: 60000, max: 120000, currency: "KES", period: "monthly" },
  "Warehouse Manager": { min: 100000, max: 200000, currency: "KES", period: "monthly" },
  "Inventory Analyst": { min: 70000, max: 150000, currency: "KES", period: "monthly" },
  "Inventory Manager": { min: 110000, max: 220000, currency: "KES", period: "monthly" },
  "Demand Planner": { min: 90000, max: 180000, currency: "KES", period: "monthly" },
  "Supply Planner": { min: 90000, max: 180000, currency: "KES", period: "monthly" },
  "S&OP Manager": { min: 150000, max: 300000, currency: "KES", period: "monthly" },
  "Distribution Manager": { min: 120000, max: 240000, currency: "KES", period: "monthly" },
  "Transportation Manager": { min: 100000, max: 200000, currency: "KES", period: "monthly" },
  "Fleet Manager": { min: 90000, max: 180000, currency: "KES", period: "monthly" },
  "Logistics Manager": { min: 120000, max: 250000, currency: "KES", period: "monthly" },
  "Logistics Director": { min: 250000, max: 500000, currency: "KES", period: "monthly" },
  "Supply Chain Analyst": { min: 80000, max: 160000, currency: "KES", period: "monthly" },
  "Supply Chain Coordinator": { min: 70000, max: 140000, currency: "KES", period: "monthly" },
  "Supply Chain Director": { min: 350000, max: 700000, currency: "KES", period: "monthly" },
  "Operations Manager": { min: 130000, max: 270000, currency: "KES", period: "monthly" },
  "Operations Director": { min: 300000, max: 600000, currency: "KES", period: "monthly" },
  "Sourcing Specialist": { min: 80000, max: 160000, currency: "KES", period: "monthly" },
  "Category Manager": { min: 150000, max: 300000, currency: "KES", period: "monthly" },
  "Vendor Manager": { min: 120000, max: 240000, currency: "KES", period: "monthly" },
  "Materials Manager": { min: 100000, max: 200000, currency: "KES", period: "monthly" },
  "Order Fulfillment Specialist": { min: 60000, max: 120000, currency: "KES", period: "monthly" },
  "Customer Service Manager": { min: 90000, max: 180000, currency: "KES", period: "monthly" },
  "Import/Export Specialist": { min: 80000, max: 160000, currency: "KES", period: "monthly" },
  "Customs Compliance Officer": { min: 90000, max: 180000, currency: "KES", period: "monthly" },
  "Trade Compliance Manager": { min: 150000, max: 300000, currency: "KES", period: "monthly" },
  "Quality Assurance Manager": { min: 120000, max: 240000, currency: "KES", period: "monthly" },
  "Quality Control Specialist": { min: 70000, max: 140000, currency: "KES", period: "monthly" },
  "Production Planner": { min: 80000, max: 160000, currency: "KES", period: "monthly" },
  "Production Manager": { min: 120000, max: 240000, currency: "KES", period: "monthly" },
  "Manufacturing Manager": { min: 150000, max: 300000, currency: "KES", period: "monthly" },
  "Plant Manager": { min: 200000, max: 400000, currency: "KES", period: "monthly" },
  "Continuous Improvement Manager": { min: 150000, max: 300000, currency: "KES", period: "monthly" },
  "Lean Six Sigma Specialist": { min: 120000, max: 240000, currency: "KES", period: "monthly" },
  "Process Improvement Specialist": { min: 100000, max: 200000, currency: "KES", period: "monthly" },
  "ERP Specialist": { min: 100000, max: 200000, currency: "KES", period: "monthly" },
  "Supply Chain Systems Analyst": { min: 120000, max: 240000, currency: "KES", period: "monthly" },
  "Logistics Analyst": { min: 80000, max: 160000, currency: "KES", period: "monthly" },
  "3PL Relationship Manager": { min: 130000, max: 260000, currency: "KES", period: "monthly" },
  "Contract Manager": { min: 120000, max: 240000, currency: "KES", period: "monthly" },
  "Supply Chain Consultant": { min: 150000, max: 350000, currency: "KES", period: "monthly" },
  "Supply Chain Project Manager": { min: 180000, max: 360000, currency: "KES", period: "monthly" },
  "Sustainability Manager": { min: 150000, max: 300000, currency: "KES", period: "monthly" },
  "Green Logistics Specialist": { min: 100000, max: 200000, currency: "KES", period: "monthly" },
  "Supply Chain Risk Manager": { min: 180000, max: 360000, currency: "KES", period: "monthly" },
  "Business Continuity Planner": { min: 150000, max: 300000, currency: "KES", period: "monthly" }
};

// List of East African countries
const COUNTRIES = ["Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia", "Burundi", "South Sudan"];

// Sample list of cities by country
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale", "Garissa"],
  "Tanzania": ["Dar es Salaam", "Mwanza", "Arusha", "Dodoma", "Mbeya", "Morogoro", "Tanga", "Zanzibar"],
  "Uganda": ["Kampala", "Entebbe", "Jinja", "Gulu", "Mbarara", "Mbale", "Kasese", "Lira"],
  "Rwanda": ["Kigali", "Butare", "Gitarama", "Ruhengeri", "Gisenyi", "Cyangugu", "Kibungo"],
  "Ethiopia": ["Addis Ababa", "Dire Dawa", "Mek'ele", "Gondar", "Bahir Dar", "Hawassa", "Jimma"],
  "Burundi": ["Bujumbura", "Gitega", "Muyinga", "Ngozi", "Rumonge"],
  "South Sudan": ["Juba", "Wau", "Malakal", "Yei", "Bor"]
};

type SubmissionForm = {
  role: string;
  country: string;
  city: string;
  salary: string;
  experience: string;
  education: string;
  industry: string;
  details: string;
};

export const SalaryAnalyzer = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [salaryData, setSalaryData] = useState<any>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState<SubmissionForm>({
    role: "",
    country: "",
    city: "",
    salary: "",
    experience: "",
    education: "",
    industry: "",
    details: ""
  });
  const { toast } = useToast();

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    if (selectedCountry && role) {
      const data = SAMPLE_SALARY_DATA[role as keyof typeof SAMPLE_SALARY_DATA]?.[selectedCountry];
      setSalaryData(data);
      
      // Reset region when role changes
      setSelectedRegion("");
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    
    // Update available cities based on country
    setAvailableCities(CITIES_BY_COUNTRY[country as keyof typeof CITIES_BY_COUNTRY] || []);
    
    // Reset region when country changes
    setSelectedRegion("");
    
    if (selectedRole && country) {
      setSalaryData(SAMPLE_SALARY_DATA[selectedRole as keyof typeof SAMPLE_SALARY_DATA]?.[country]);
    }
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    
    // If we have region-specific data, update the salary display
    if (selectedRole && selectedCountry && region && 
        SAMPLE_SALARY_DATA[selectedRole as keyof typeof SAMPLE_SALARY_DATA]?.[selectedCountry]?.regions?.[region]) {
      const countryData = SAMPLE_SALARY_DATA[selectedRole as keyof typeof SAMPLE_SALARY_DATA][selectedCountry];
      const regionData = countryData.regions[region];
      
      // Merge country data with region-specific overrides
      setSalaryData({
        ...countryData,
        min: regionData.min,
        max: regionData.max
      });
    }
  };

  const handleFormChange = (field: keyof SubmissionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitSalary = () => {
    // In a real app, this would send data to the server
    console.log("Submitting salary data:", formData);
    
    // For demo, just show a success toast
    toast({
      title: "Thank you for your contribution!",
      description: "Your anonymous salary data helps others in the community.",
      variant: "default",
    });
    
    // Reset form
    setFormData({
      role: "",
      country: "",
      city: "",
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="role">Select Role</Label>
              <Select onValueChange={handleRoleChange} value={selectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
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
                  {COUNTRIES.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCountry && availableCities.length > 0 && (
              <div>
                <Label htmlFor="region">Select City/Town</Label>
                <Select onValueChange={handleRegionChange} value={selectedRegion}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Choose a city/town" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city: string) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {selectedCountry && CITIES_BY_COUNTRY[selectedCountry as keyof typeof CITIES_BY_COUNTRY] && (
            <div className="mt-6">
              <Label htmlFor="form-city">City/Town</Label>
              <Select onValueChange={(val) => handleFormChange('city', val)} value={formData.country}>
                <SelectTrigger id="form-city">
                  <SelectValue placeholder="Select city/town" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES_BY_COUNTRY[selectedCountry as keyof typeof CITIES_BY_COUNTRY].map((city: string) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {salaryData && (
            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <h3 className="font-semibold text-lg mb-2">
                Salary Range for {selectedRole} in {selectedRegion ? `${selectedRegion}, ${selectedCountry}` : selectedCountry}
              </h3>
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
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.country && CITIES_BY_COUNTRY[formData.country] && (
                  <div>
                    <Label htmlFor="form-city">City/Town</Label>
                    <Select onValueChange={(val) => handleFormChange('city', val)} value={formData.city}>
                      <SelectTrigger id="form-city">
                        <SelectValue placeholder="Select city/town" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES_BY_COUNTRY[formData.country].map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

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
