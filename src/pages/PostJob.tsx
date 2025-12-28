import { useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Upload, Image, Link as LinkIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";

type JobType = "full_time" | "part_time" | "contract" | "internship";
const HIRING_TIMELINES = [
  { label: "Immediate", value: "immediate" },
  { label: "A week", value: "one_week" },
  { label: "Custom...", value: "custom" }
];

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const PostJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    notify_applicants: false,
    document_url: ""
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return null;
    
    setUploadingImage(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

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
      // Upload image if selected
      const imageUrl = await uploadImage(session.user.id);
      
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
        notify_applicants: formData.notify_applicants,
        image_url: imageUrl,
        document_url: formData.document_url || null
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Post a New Job</CardTitle>
              <p className="text-muted-foreground">
                Create a job posting optimized for supply chain and logistics professionals
              </p>
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
                <div>
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

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Job Image (Optional, max 2MB)
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-40 mx-auto rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="flex flex-col items-center justify-center py-4 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Document Link */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Job Document Link (Optional)
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/job-description.pdf"
                    value={formData.document_url}
                    onChange={(e) => setFormData({ ...formData, document_url: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to additional job details, PDF, or company brochure
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || uploadingImage}
                >
                  {uploadingImage ? "Uploading Image..." : isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                ATS Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">Tip</Badge>
                  <p className="text-sm">Use supply chain keywords like "logistics", "procurement", "inventory management"</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">Tip</Badge>
                  <p className="text-sm">Include specific skills and certifications relevant to your industry</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">Tip</Badge>
                  <p className="text-sm">Use clear section headers and bullet points for better readability</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Supply Chain Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Your job will be featured to professionals in:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Supply Chain</Badge>
                <Badge variant="outline">Logistics</Badge>
                <Badge variant="outline">Procurement</Badge>
                <Badge variant="outline">Operations</Badge>
                <Badge variant="outline">Warehouse</Badge>
                <Badge variant="outline">Distribution</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
