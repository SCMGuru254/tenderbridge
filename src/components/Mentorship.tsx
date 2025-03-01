
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for demo purposes
const SAMPLE_MENTORS = [
  { 
    id: 1, 
    name: "Jane Mwangi", 
    title: "Supply Chain Director",
    company: "East African Breweries",
    skills: ["ERP Implementation", "Demand Planning", "Team Management"],
    experience: "15+ years",
    bio: "Passionate about developing the next generation of supply chain professionals in East Africa. Expertise in SAP implementation and complex supply chain transformation."
  },
  { 
    id: 2, 
    name: "David Ochieng", 
    title: "Logistics Manager",
    company: "Twiga Foods",
    skills: ["Last Mile Delivery", "Cold Chain", "Route Optimization"],
    experience: "8 years",
    bio: "Helping organizations optimize their logistics operations. Specialized in cold chain logistics for agricultural products across Kenya."
  },
  { 
    id: 3, 
    name: "Amina Hassan", 
    title: "Procurement Specialist",
    company: "UN World Food Programme",
    skills: ["International Procurement", "Tendering", "Contract Management"],
    experience: "12 years",
    bio: "Expert in humanitarian supply chains. Available to mentor on international procurement processes and strategic sourcing."
  }
];

const SAMPLE_MENTEE_REQUESTS = [
  {
    id: 1,
    name: "John Kamau",
    title: "Junior Supply Chain Analyst",
    skills: ["Data Analysis", "Forecasting"],
    request: "Looking for guidance on implementing advanced forecasting techniques in a manufacturing environment."
  },
  {
    id: 2,
    name: "Grace Njeri",
    title: "Recent Graduate",
    skills: ["Entry Level"],
    request: "Seeking career advice on how to break into supply chain management with a business degree."
  },
  {
    id: 3,
    name: "Michael Owino",
    title: "Warehouse Supervisor",
    skills: ["Inventory Management"],
    request: "Need mentorship on warehouse automation technologies and implementation strategies."
  }
];

type MentorFormData = {
  name: string;
  title: string;
  company: string;
  expertise: string[];
  experience: string;
  bio: string;
  email: string;
};

type MenteeFormData = {
  name: string;
  title: string;
  skills: string;
  request: string;
  email: string;
};

export const Mentorship = () => {
  const [activeTab, setActiveTab] = useState("find-mentor");
  const [mentorFormData, setMentorFormData] = useState<MentorFormData>({
    name: "",
    title: "",
    company: "",
    expertise: [],
    experience: "",
    bio: "",
    email: ""
  });
  const [menteeFormData, setMenteeFormData] = useState<MenteeFormData>({
    name: "",
    title: "",
    skills: "",
    request: "",
    email: ""
  });
  const [expertise, setExpertise] = useState("");

  const handleMentorFormChange = (field: keyof MentorFormData, value: string) => {
    if (field === 'expertise') {
      return; // This is handled separately
    }
    setMentorFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMenteeFormChange = (field: keyof MenteeFormData, value: string) => {
    setMenteeFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExpertise = () => {
    if (!expertise.trim()) return;
    if (mentorFormData.expertise.includes(expertise)) {
      toast.error("This expertise is already added");
      return;
    }
    setMentorFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, expertise]
    }));
    setExpertise("");
  };

  const removeExpertise = (skill: string) => {
    setMentorFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(s => s !== skill)
    }));
  };

  const submitMentorForm = () => {
    // In a real app, this would send data to the server
    console.log("Submitting mentor application:", mentorFormData);
    toast.success("Thank you for volunteering to be a mentor! We'll review your application and be in touch soon.");
    setMentorFormData({
      name: "",
      title: "",
      company: "",
      expertise: [],
      experience: "",
      bio: "",
      email: ""
    });
  };

  const submitMenteeRequest = () => {
    // In a real app, this would send data to the server
    console.log("Submitting mentee request:", menteeFormData);
    toast.success("Your mentorship request has been submitted! We'll notify you when a mentor matches your needs.");
    setMenteeFormData({
      name: "",
      title: "",
      skills: "",
      request: "",
      email: ""
    });
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Supply Chain Mentorship Hub</CardTitle>
          <CardDescription>
            Connect with experienced mentors or offer your expertise to help others grow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="find-mentor" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="find-mentor">Find a Mentor</TabsTrigger>
              <TabsTrigger value="become-mentor">Become a Mentor</TabsTrigger>
              <TabsTrigger value="mentee-requests">Mentee Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="find-mentor" className="space-y-6 mt-6">
              <div className="text-center mb-4">
                <p>Browse available mentors who volunteer their time to help supply chain professionals in East Africa</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_MENTORS.map(mentor => (
                  <Card key={mentor.id} className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription>{mentor.title} at {mentor.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">{mentor.bio}</p>
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-1">Expertise:</p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm"><span className="font-medium">Experience:</span> {mentor.experience}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => toast.success(`Request sent to ${mentor.name}. They'll contact you soon!`)}>
                        Request Mentorship
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Request a Mentor in Your Specific Area</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mentee-name">Your Name</Label>
                    <Input 
                      id="mentee-name" 
                      value={menteeFormData.name}
                      onChange={(e) => handleMenteeFormChange('name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mentee-title">Current Title/Position</Label>
                    <Input 
                      id="mentee-title" 
                      value={menteeFormData.title}
                      onChange={(e) => handleMenteeFormChange('title', e.target.value)}
                      placeholder="Supply Chain Analyst"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="mentee-skills">Skills You Want to Develop</Label>
                  <Input 
                    id="mentee-skills" 
                    value={menteeFormData.skills}
                    onChange={(e) => handleMenteeFormChange('skills', e.target.value)}
                    placeholder="e.g. Inventory Optimization, S&OP Process"
                  />
                </div>

                <div className="mt-4">
                  <Label htmlFor="mentee-request">Describe What You're Looking For in a Mentor</Label>
                  <Textarea 
                    id="mentee-request" 
                    value={menteeFormData.request}
                    onChange={(e) => handleMenteeFormChange('request', e.target.value)}
                    placeholder="Please describe your goals and what type of mentorship you're seeking"
                    className="resize-none"
                    rows={4}
                  />
                </div>

                <div className="mt-4">
                  <Label htmlFor="mentee-email">Your Email (to be contacted by mentors)</Label>
                  <Input 
                    id="mentee-email" 
                    type="email"
                    value={menteeFormData.email}
                    onChange={(e) => handleMenteeFormChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="mt-6">
                  <Button onClick={submitMenteeRequest} className="w-full">
                    Submit Mentorship Request
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="become-mentor" className="space-y-6 mt-6">
              <div className="text-center mb-4">
                <p>Volunteer your expertise to help develop the next generation of supply chain professionals in East Africa</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mentor-name">Your Name</Label>
                    <Input 
                      id="mentor-name" 
                      value={mentorFormData.name}
                      onChange={(e) => handleMentorFormChange('name', e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mentor-title">Current Title/Position</Label>
                    <Input 
                      id="mentor-title" 
                      value={mentorFormData.title}
                      onChange={(e) => handleMentorFormChange('title', e.target.value)}
                      placeholder="Supply Chain Director"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="mentor-company">Company/Organization</Label>
                  <Input 
                    id="mentor-company" 
                    value={mentorFormData.company}
                    onChange={(e) => handleMentorFormChange('company', e.target.value)}
                    placeholder="Example Company Ltd."
                  />
                </div>

                <div>
                  <Label htmlFor="expertise-input">Areas of Expertise</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="expertise-input" 
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                      placeholder="Add a skill (e.g. Procurement, Logistics)"
                    />
                    <Button type="button" onClick={addExpertise} className="shrink-0">
                      Add
                    </Button>
                  </div>
                  
                  {mentorFormData.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentorFormData.expertise.map(skill => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <span 
                            className="cursor-pointer ml-1" 
                            onClick={() => removeExpertise(skill)}
                          >
                            ×
                          </span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="mentor-experience">Years of Experience</Label>
                  <Select 
                    onValueChange={(val) => handleMentorFormChange('experience', val)}
                    value={mentorFormData.experience}
                  >
                    <SelectTrigger id="mentor-experience">
                      <SelectValue placeholder="Select your experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10-15">10-15 years</SelectItem>
                      <SelectItem value="15+">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mentor-bio">Brief Bio & Mentoring Interests</Label>
                  <Textarea 
                    id="mentor-bio" 
                    value={mentorFormData.bio}
                    onChange={(e) => handleMentorFormChange('bio', e.target.value)}
                    placeholder="Share about yourself and how you'd like to help mentees"
                    className="resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="mentor-email">Email Address</Label>
                  <Input 
                    id="mentor-email" 
                    type="email"
                    value={mentorFormData.email}
                    onChange={(e) => handleMentorFormChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="mt-2">
                  <Button onClick={submitMentorForm} className="w-full">
                    Submit Application
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mentee-requests" className="space-y-6 mt-6">
              <div className="text-center mb-4">
                <p>Browse current mentorship requests - see if you can help someone with your expertise</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_MENTEE_REQUESTS.map(mentee => (
                  <Card key={mentee.id} className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{mentee.name}</CardTitle>
                      <CardDescription>{mentee.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{mentee.request}</p>
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-1">Looking to develop:</p>
                        <div className="flex flex-wrap gap-2">
                          {mentee.skills.map(skill => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => toast.success(`We'll connect you with ${mentee.name} to start mentoring!`)}
                      >
                        Offer to Mentor
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            Mentorship on SupplyChainKE is 100% free and voluntary. We promote knowledge sharing and professional development within our community.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
