
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for demo purposes
const SAMPLE_MENTORSHIP_REQUESTS = [
  {
    id: "1",
    title: "Need guidance on supply chain certifications",
    skills: ["CPIM", "CSCP", "Career Development"],
    description: "I'm looking for advice on which certification would be most valuable for a career in demand planning.",
    experience: "3 years in inventory management",
    commitment: "2-3 hours per month",
    created: "2024-05-15",
    location: "Nairobi, Kenya"
  },
  {
    id: "2",
    title: "SAP ERP implementation mentorship",
    skills: ["SAP", "ERP", "Systems Integration"],
    description: "Our company is implementing SAP and I need guidance on best practices for supply chain modules.",
    experience: "5 years as logistics coordinator",
    commitment: "Weekly check-ins",
    created: "2024-05-10",
    location: "Remote, Tanzania"
  },
  {
    id: "3",
    title: "Sustainability in supply chain",
    skills: ["Sustainability", "Green Logistics", "Carbon Footprint"],
    description: "Looking for mentorship on implementing sustainable practices in our agricultural supply chain.",
    experience: "2 years in procurement",
    commitment: "Bi-weekly meetings",
    created: "2024-05-08",
    location: "Kampala, Uganda"
  },
  {
    id: "4",
    title: "Warehouse optimization techniques",
    skills: ["Warehouse Management", "Lean", "Optimization"],
    description: "Need guidance on implementing lean principles in warehouse operations.",
    experience: "4 years as warehouse supervisor",
    commitment: "Monthly sessions",
    created: "2024-05-05",
    location: "Mombasa, Kenya"
  }
];

const SAMPLE_MENTORS = [
  {
    id: "101",
    name: "Grace Mwangi",
    title: "Supply Chain Director",
    company: "EABL",
    skills: ["S&OP", "Procurement", "Leadership"],
    experience: "15+ years in FMCG supply chain",
    availability: "1-2 hours per week",
    bio: "Experienced supply chain leader with expertise in end-to-end supply chain optimization and team development.",
    location: "Nairobi, Kenya"
  },
  {
    id: "102",
    name: "Benjamin Okeyo",
    title: "Logistics Manager",
    company: "DHL East Africa",
    skills: ["Logistics", "Transportation", "International Shipping"],
    experience: "12 years in transportation and logistics",
    availability: "Bi-weekly sessions",
    bio: "Logistics professional specializing in regional distribution networks and customs compliance.",
    location: "Mombasa, Kenya"
  },
  {
    id: "103",
    name: "Amina Hassan",
    title: "Procurement Consultant",
    company: "Independent",
    skills: ["Strategic Sourcing", "Negotiation", "Vendor Management"],
    experience: "10 years in procurement across multiple industries",
    availability: "Flexible scheduling",
    bio: "Former corporate procurement manager now helping organizations optimize their purchasing strategies.",
    location: "Dar es Salaam, Tanzania"
  }
];

// Supply chain related skills for the form
const SUPPLY_CHAIN_SKILLS = [
  "Procurement", "Logistics", "Inventory Management", "Demand Planning", 
  "Supply Planning", "S&OP", "Warehousing", "Transportation", 
  "Distribution", "Import/Export", "Customs Compliance", "Vendor Management",
  "Strategic Sourcing", "Contract Management", "ERP Systems", "SAP",
  "Oracle", "Microsoft Dynamics", "Lean", "Six Sigma", "Process Improvement",
  "Supply Chain Analytics", "Forecasting", "Category Management",
  "Sustainable Supply Chain", "Green Logistics", "Reverse Logistics",
  "3PL Management", "Cold Chain", "E-commerce Logistics", "Last Mile Delivery",
  "Fleet Management", "Risk Management", "Business Continuity", "CSCP",
  "CPIM", "CPSM", "SCOR Model", "Project Management", "Change Management",
  "Leadership", "Negotiation", "Cost Reduction", "Blockchain in Supply Chain",
  "IoT in Supply Chain", "AI in Supply Chain", "Robotics & Automation"
];

type MentorshipRequestForm = {
  title: string;
  skills: string[];
  description: string;
  experience: string;
  commitment: string;
  location: string;
};

type MentorProfileForm = {
  name: string;
  title: string;
  company: string;
  skills: string[];
  experience: string;
  availability: string;
  bio: string;
  location: string;
};

export const Mentorship = () => {
  const [activeMentorshipTab, setActiveMentorshipTab] = useState("find");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const { toast } = useToast();
  
  const [mentorshipForm, setMentorshipForm] = useState<MentorshipRequestForm>({
    title: "",
    skills: [],
    description: "",
    experience: "",
    commitment: "",
    location: ""
  });
  
  const [mentorForm, setMentorForm] = useState<MentorProfileForm>({
    name: "",
    title: "",
    company: "",
    skills: [],
    experience: "",
    availability: "",
    bio: "",
    location: ""
  });

  // Filter skills based on input
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSkillInput(input);
    
    if (input.trim() === "") {
      setFilteredSkills([]);
    } else {
      const filtered = SUPPLY_CHAIN_SKILLS.filter(
        skill => skill.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setFilteredSkills(filtered);
    }
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      
      // Add to the appropriate form based on active tab
      if (activeMentorshipTab === "request") {
        setMentorshipForm({
          ...mentorshipForm,
          skills: [...mentorshipForm.skills, skill]
        });
      } else if (activeMentorshipTab === "become") {
        setMentorForm({
          ...mentorForm,
          skills: [...mentorForm.skills, skill]
        });
      }
    }
    
    // Reset input and suggestions
    setSkillInput("");
    setFilteredSkills([]);
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    setSelectedSkills(updatedSkills);
    
    // Update the appropriate form based on active tab
    if (activeMentorshipTab === "request") {
      setMentorshipForm({
        ...mentorshipForm,
        skills: mentorshipForm.skills.filter(skill => skill !== skillToRemove)
      });
    } else if (activeMentorshipTab === "become") {
      setMentorForm({
        ...mentorForm,
        skills: mentorForm.skills.filter(skill => skill !== skillToRemove)
      });
    }
  };

  const handleMentorshipFormChange = (field: keyof MentorshipRequestForm, value: string) => {
    setMentorshipForm({
      ...mentorshipForm,
      [field]: value
    });
  };

  const handleMentorFormChange = (field: keyof MentorProfileForm, value: string) => {
    setMentorForm({
      ...mentorForm,
      [field]: value
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveMentorshipTab(tab);
    setSelectedSkills([]);
    setSkillInput("");
    setFilteredSkills([]);
  };

  const handleSubmitMentorshipRequest = () => {
    console.log("Submitting mentorship request:", mentorshipForm);
    
    // Validate form
    if (!mentorshipForm.title || mentorshipForm.skills.length === 0 || !mentorshipForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in title, skills, and description.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be sent to a backend
    toast({
      title: "Mentorship request submitted!",
      description: "Potential mentors will be able to see your request.",
      variant: "default"
    });
    
    // Reset form
    setMentorshipForm({
      title: "",
      skills: [],
      description: "",
      experience: "",
      commitment: "",
      location: ""
    });
    setSelectedSkills([]);
    
    // Switch to find tab to see all requests including the "new" one
    setActiveMentorshipTab("find");
  };

  const handleSubmitMentorProfile = () => {
    console.log("Submitting mentor profile:", mentorForm);
    
    // Validate form
    if (!mentorForm.name || !mentorForm.title || mentorForm.skills.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in your name, professional title, and skills.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be sent to a backend
    toast({
      title: "Thank you for volunteering!",
      description: "Your mentor profile has been created. People seeking mentorship can now find you.",
      variant: "default"
    });
    
    // Reset form
    setMentorForm({
      name: "",
      title: "",
      company: "",
      skills: [],
      experience: "",
      availability: "",
      bio: "",
      location: ""
    });
    setSelectedSkills([]);
    
    // Switch to mentors tab to see all mentors including the "new" one
    setActiveMentorshipTab("mentors");
  };

  const connectWithMentor = (mentorId: string) => {
    console.log("Connecting with mentor:", mentorId);
    toast({
      title: "Connection request sent!",
      description: "The mentor will receive your request and contact you if they can help.",
      variant: "default"
    });
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Supply Chain Mentorship Hub</CardTitle>
          <CardDescription>
            Connect with experienced professionals or offer your expertise to help others grow in their supply chain careers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMentorshipTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="find">Find a Mentor</TabsTrigger>
              <TabsTrigger value="request">Request Mentorship</TabsTrigger>
              <TabsTrigger value="become">Become a Mentor</TabsTrigger>
              <TabsTrigger value="mentors">Browse Mentors</TabsTrigger>
            </TabsList>
            
            {/* Find a Mentor Tab */}
            <TabsContent value="find" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SAMPLE_MENTORSHIP_REQUESTS.map(request => (
                  <Card key={request.id} className="overflow-hidden h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {request.location} • Posted {new Date(request.created).toLocaleDateString()}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2 flex flex-wrap gap-1">
                        {request.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm mb-2">{request.description}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        <div><strong>Experience:</strong> {request.experience}</div>
                        <div><strong>Commitment:</strong> {request.commitment}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full" onClick={() => toast({
                        title: "Contact request sent!",
                        description: "We'll notify you when the mentee accepts your offer to help.",
                        variant: "default"
                      })}>
                        Offer to Mentor
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="text-center py-4">
                <p className="mb-2 text-muted-foreground">Don't see what you're looking for?</p>
                <Button variant="outline" onClick={() => setActiveMentorshipTab("request")}>
                  Submit Your Mentorship Request
                </Button>
              </div>
            </TabsContent>
            
            {/* Request Mentorship Tab */}
            <TabsContent value="request" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="request-title">What do you need help with?</Label>
                  <Input
                    id="request-title"
                    placeholder="E.g., 'Guidance on implementing S&OP process'"
                    value={mentorshipForm.title}
                    onChange={(e) => handleMentorshipFormChange('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Skills you need help with</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type to search skills"
                      value={skillInput}
                      onChange={handleSkillInputChange}
                    />
                    {filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredSkills.map(skill => (
                          <div
                            key={skill}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => addSkill(skill)}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          className="text-xs font-bold"
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="request-description">Describe what you need help with</Label>
                  <Textarea
                    id="request-description"
                    placeholder="Provide details about what you're looking to learn or challenges you're facing"
                    rows={4}
                    value={mentorshipForm.description}
                    onChange={(e) => handleMentorshipFormChange('description', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="request-experience">Your current experience level</Label>
                    <Input
                      id="request-experience"
                      placeholder="E.g., '2 years as inventory analyst'"
                      value={mentorshipForm.experience}
                      onChange={(e) => handleMentorshipFormChange('experience', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="request-commitment">Time commitment</Label>
                    <Select 
                      value={mentorshipForm.commitment}
                      onValueChange={(value) => handleMentorshipFormChange('commitment', value)}
                    >
                      <SelectTrigger id="request-commitment">
                        <SelectValue placeholder="Select commitment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 hours per month">1-2 hours per month</SelectItem>
                        <SelectItem value="3-4 hours per month">3-4 hours per month</SelectItem>
                        <SelectItem value="Weekly check-ins">Weekly check-ins</SelectItem>
                        <SelectItem value="Bi-weekly sessions">Bi-weekly sessions</SelectItem>
                        <SelectItem value="Flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="request-location">Your location</Label>
                  <Input
                    id="request-location"
                    placeholder="E.g., 'Nairobi, Kenya' or 'Remote'"
                    value={mentorshipForm.location}
                    onChange={(e) => handleMentorshipFormChange('location', e.target.value)}
                  />
                </div>
                
                <Button
                  className="w-full mt-4"
                  onClick={handleSubmitMentorshipRequest}
                >
                  Submit Mentorship Request
                </Button>
              </div>
            </TabsContent>
            
            {/* Become a Mentor Tab */}
            <TabsContent value="become" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mentor-name">Your Name</Label>
                    <Input
                      id="mentor-name"
                      placeholder="Full name"
                      value={mentorForm.name}
                      onChange={(e) => handleMentorFormChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mentor-title">Professional Title</Label>
                    <Input
                      id="mentor-title"
                      placeholder="E.g., 'Supply Chain Manager'"
                      value={mentorForm.title}
                      onChange={(e) => handleMentorFormChange('title', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="mentor-company">Company (Optional)</Label>
                  <Input
                    id="mentor-company"
                    placeholder="Where you work"
                    value={mentorForm.company}
                    onChange={(e) => handleMentorFormChange('company', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Skills you can mentor in</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type to search skills"
                      value={skillInput}
                      onChange={handleSkillInputChange}
                    />
                    {filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredSkills.map(skill => (
                          <div
                            key={skill}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => addSkill(skill)}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          className="text-xs font-bold"
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="mentor-experience">Your Experience</Label>
                  <Input
                    id="mentor-experience"
                    placeholder="E.g., '10+ years in procurement'"
                    value={mentorForm.experience}
                    onChange={(e) => handleMentorFormChange('experience', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="mentor-availability">Availability</Label>
                  <Select 
                    value={mentorForm.availability}
                    onValueChange={(value) => handleMentorFormChange('availability', value)}
                  >
                    <SelectTrigger id="mentor-availability">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 hours per month">1-2 hours per month</SelectItem>
                      <SelectItem value="3-4 hours per month">3-4 hours per month</SelectItem>
                      <SelectItem value="Weekly check-ins">Weekly check-ins</SelectItem>
                      <SelectItem value="Bi-weekly sessions">Bi-weekly sessions</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="mentor-bio">Short Bio</Label>
                  <Textarea
                    id="mentor-bio"
                    placeholder="Tell potential mentees about yourself and how you can help"
                    rows={3}
                    value={mentorForm.bio}
                    onChange={(e) => handleMentorFormChange('bio', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="mentor-location">Your Location</Label>
                  <Input
                    id="mentor-location"
                    placeholder="E.g., 'Nairobi, Kenya' or 'Remote'"
                    value={mentorForm.location}
                    onChange={(e) => handleMentorFormChange('location', e.target.value)}
                  />
                </div>
                
                <Button
                  className="w-full mt-4"
                  onClick={handleSubmitMentorProfile}
                >
                  Create Mentor Profile
                </Button>
              </div>
            </TabsContent>
            
            {/* Browse Mentors Tab */}
            <TabsContent value="mentors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SAMPLE_MENTORS.map(mentor => (
                  <Card key={mentor.id} className="overflow-hidden h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <div className="text-sm">
                        {mentor.title}{mentor.company ? ` at ${mentor.company}` : ''}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {mentor.location}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2 flex flex-wrap gap-1">
                        {mentor.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm mb-2">{mentor.bio}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        <div><strong>Experience:</strong> {mentor.experience}</div>
                        <div><strong>Availability:</strong> {mentor.availability}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => connectWithMentor(mentor.id)}
                      >
                        Connect
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="text-center py-4">
                <p className="mb-2 text-muted-foreground">Want to help others in their supply chain career?</p>
                <Button variant="outline" onClick={() => setActiveMentorshipTab("become")}>
                  Become a Mentor
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex-col items-start text-sm text-muted-foreground">
          <p>This is a volunteer-based community platform. All mentorship is provided free of charge.</p>
          <p className="mt-1">Your contribution helps build a stronger supply chain community in East Africa.</p>
        </CardFooter>
      </Card>
    </div>
  );
};
