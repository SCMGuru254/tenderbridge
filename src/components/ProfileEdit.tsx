
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { validateImageUpload, validatePDFUpload, validateInput } from "@/utils/inputValidation";
import { Loader2, Upload, Linkedin, FileText } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Profile } from "@/types/profiles";

// Define the form schema with validations
const profileSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional(),
  position: z.string().max(100, { message: "Position must be less than 100 characters" }).optional(),
  company: z.string().max(100, { message: "Company must be less than 100 characters" }).optional(),
  linkedin_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  notify_on_view: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEdit() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      bio: "",
      position: "",
      company: "",
      linkedin_url: "",
      notify_on_view: true
    }
  });
  
  // Fetch user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate("/auth");
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        const profile = data as Profile;
        
        if (profile) {
          form.reset({
            full_name: profile.full_name || "",
            bio: profile.bio || "",
            position: profile.position || "",
            company: profile.company || "",
            linkedin_url: profile.linkedin_url || "",
            notify_on_view: profile.notify_on_view !== false // default to true if not set
          });
          
          if (profile.avatar_url) {
            setPhotoPreview(profile.avatar_url);
          }
          
          if (profile.cv_filename) {
            setCvFileName(profile.cv_filename);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data."
        });
      }
    };
    
    loadUserProfile();
  }, [navigate, toast, form]);
  
  // Handle photo upload
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const validation = validateImageUpload(file);
    
    if (!validation.isValid) {
      setUploadError(validation.errors[0]);
      return;
    }
    
    setUploadError(null);
    setPhotoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle CV upload
  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const validation = validatePDFUpload(file);
    
    if (!validation.isValid) {
      setUploadError(validation.errors[0]);
      return;
    }
    
    setUploadError(null);
    setCvFile(file);
    setCvFileName(file.name);
  };
  
  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsUploading(true);
      
      // Validate LinkedIn URL if provided
      if (values.linkedin_url && !validateInput(values.linkedin_url, "url")) {
        toast({
          variant: "destructive",
          title: "Invalid LinkedIn URL",
          description: "Please enter a valid LinkedIn URL"
        });
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in to update your profile"
        });
        navigate("/auth");
        return;
      }
      
      // Upload photo if changed
      let avatar_url = photoPreview;
      if (photoFile) {
        const photoFileName = `photo_${user.id}_${Date.now()}.${photoFile.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(photoFileName, photoFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(photoFileName);
          
        avatar_url = publicUrl;
      }
      
      // Upload CV if changed
      let cv_url = null;
      let cv_filename = cvFileName;
      if (cvFile) {
        const cvFileName = `cv_${user.id}_${Date.now()}.pdf`;
        
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(cvFileName, cvFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(cvFileName);
          
        cv_url = publicUrl;
        cv_filename = cvFile.name;
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          bio: values.bio,
          position: values.position,
          company: values.company,
          linkedin_url: values.linkedin_url || null,
          avatar_url,
          cv_url,
          cv_filename,
          notify_on_view: values.notify_on_view
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your profile has been updated"
      });
      
      navigate("/profile");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your professional information</CardDescription>
        </CardHeader>
        <CardContent>
          {uploadError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          
          <div className="mb-6 flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              {photoPreview ? (
                <AvatarImage src={photoPreview} alt="Profile" />
              ) : (
                <AvatarFallback>
                  {form.getValues("full_name")?.charAt(0) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            
            <Label htmlFor="photo" className="cursor-pointer">
              <div className="flex items-center space-x-2 text-primary">
                <Upload size={16} />
                <span>{photoPreview ? "Change photo" : "Upload photo"}</span>
              </div>
              <Input
                id="photo"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Label>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <FileText size={16} className="text-muted-foreground" />
              <Label htmlFor="cv">CV / Resume</Label>
            </div>
            
            {cvFileName ? (
              <div className="flex items-center justify-between p-3 border rounded-md mb-2">
                <span className="text-sm truncate">{cvFileName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById("cv")?.click()}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Label htmlFor="cv" className="cursor-pointer">
                <div className="flex items-center justify-center p-4 border border-dashed rounded-md hover:bg-muted transition-colors">
                  <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                    <Upload size={20} />
                    <span>Upload PDF (max 5MB)</span>
                  </div>
                </div>
              </Label>
            )}
            
            <Input
              id="cv"
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleCvChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload a single-page PDF resume
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Your job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Brief description of your professional background
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Linkedin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://linkedin.com/in/username"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notify_on_view"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="space-y-1 leading-none">
                          <FormLabel>Profile view notifications</FormLabel>
                          <FormDescription>
                            Get notified when employers view your profile
                          </FormDescription>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
