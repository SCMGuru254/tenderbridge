
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

type JobType = "full_time" | "part_time" | "contract" | "internship";
const HIRING_TIMELINES = [
  { label: "Immediate", value: "immediate" },
  { label: "A week", value: "one_week" },
  { label: "Custom...", value: "custom" }
];

const PostJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary_range: "",
    job_type: "" as JobType,
    requirements: "",
    responsibilities: "",
    hiring_timeline: "",
    hiring_timeline_custom: "",
    notify_applicants: false
  });

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  const { data: company } = useQuery({
    queryKey: ['company', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!formData.job_type) {
      toast({
        title: "Error",
        description: "Please select a job type",
        variant: "destructive",
      });
      return;
    }

    const hiringTimelineValue = 
      formData.hiring_timeline === "custom"
        ? formData.hiring_timeline_custom
        : formData.hiring_timeline || null;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('jobs').insert({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary_range: formData.salary_range,
        job_type: formData.job_type,
        requirements: formData.requirements.split('\n').filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').filter(Boolean),
        company_id: company?.id,
        posted_by: session.user.id,
        hiring_timeline: hiringTimelineValue,
        notify_applicants: formData.notify_applicants
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your job has been posted successfully",
      });
      navigate("/jobs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Job Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Salary Range (e.g., KSH 50,000 - 80,000)"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
              />
            </div>
            <div>
              <Select
                value={formData.job_type}
                onValueChange={(value: JobType) => setFormData({ ...formData, job_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hiring Timeline */}
            <div>
              <label className="block mb-1 text-sm font-medium">Expected Time to Fill Position</label>
              <Select
                value={formData.hiring_timeline}
                onValueChange={(val) => setFormData({ ...formData, hiring_timeline: val, hiring_timeline_custom: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hiring timeline" />
                </SelectTrigger>
                <SelectContent>
                  {HIRING_TIMELINES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.hiring_timeline === "custom" && (
                <Input
                  placeholder="Custom timeline (e.g. 2 weeks, 3 days, etc)"
                  className="mt-2"
                  value={formData.hiring_timeline_custom}
                  onChange={e =>
                    setFormData({ ...formData, hiring_timeline_custom: e.target.value })
                  }
                  required
                />
              )}
            </div>

            {/* Notify Applicants */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.notify_applicants}
                onCheckedChange={(checked) => setFormData({ ...formData, notify_applicants: !!checked })}
                id="notify-applicants"
              />
              <label htmlFor="notify-applicants" className="cursor-pointer">
                Notify applicants of application stages (recommended)
              </label>
            </div>

            <div>
              <Textarea
                placeholder="Requirements (one per line)"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Responsibilities (one per line)"
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostJob;
