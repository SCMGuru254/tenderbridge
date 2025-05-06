
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NewsletterForm from "@/components/forms/NewsletterForm";
import FeedbackForm from "@/components/forms/FeedbackForm";
import ReportHeadhunterForm from "@/components/forms/ReportHeadhunterForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Forms() {
  const [currentTab, setCurrentTab] = useState("newsletter");
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Forms & Data Collection</h1>
      <p className="text-muted-foreground mb-8">
        Below you can find all the forms available on SupplyChain_KE and information about how we handle your data.
      </p>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-10">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="report">Report Headhunters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="newsletter">
          <Card className="mt-6">
            <CardContent className="pt-6">
              <NewsletterForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card className="mt-6">
            <CardContent className="pt-6">
              <FeedbackForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="report">
          <Card className="mt-6">
            <CardContent className="pt-6">
              <ReportHeadhunterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-10" />
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">How We Handle Your Data</h2>
        
        <div className="grid gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Newsletter Subscription</h3>
            <p>
              When you subscribe to our newsletter, we collect your email address to send you periodic updates about job opportunities,
              industry news, and platform features. Your data is stored in our secure database and managed through a third-party email
              service provider.
            </p>
            <p className="text-sm text-muted-foreground">
              You can unsubscribe at any time by clicking the unsubscribe link in any email.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Feedback Form</h3>
            <p>
              When you submit feedback, we collect your name, email, and the feedback content. This data is stored in our database
              and used to improve our platform. We may reach out to you for clarification or follow-up questions related to your feedback.
            </p>
            <p className="text-sm text-muted-foreground">
              Your feedback may be used anonymously for product development and marketing purposes.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Headhunter Reports</h3>
            <p>
              When you report a suspicious headhunter, we collect details about the reported individual/company and your contact information.
              This data is stored securely and is only accessible to our trust and safety team for investigation purposes.
            </p>
            <p className="text-sm text-muted-foreground">
              Your identity as a reporter will be kept confidential during our investigation process.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Job Applications</h3>
            <p>
              When you apply for jobs through our platform, your application details including your resume, cover letter, and contact
              information are shared with the employer who posted the job. We retain this data to facilitate the application process
              and for compliance purposes.
            </p>
            <p className="text-sm text-muted-foreground">
              You can delete your application data from our system by contacting us directly.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Data Security</h3>
            <p>
              All form submissions are protected using HTTPS encryption. Your data is stored in our secure database with strict access controls.
              We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.
            </p>
            <p className="text-sm text-muted-foreground">
              For more information about our data handling practices, please refer to our Privacy Policy.
            </p>
          </div>
        </div>
        
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <a href="/privacy">Privacy Policy</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/terms">Terms of Service</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/security">Security Information</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
