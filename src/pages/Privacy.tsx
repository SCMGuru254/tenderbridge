
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: May 2, 2025
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            SupplyChain_KE ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p>
            We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Personal Data</h3>
          <p>
            When you register an account, apply for jobs, or use certain features of our platform, we may collect personal information, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email address, and contact details</li>
            <li>Professional information including work experience, skills, and education</li>
            <li>Resume/CV and other job application materials</li>
            <li>Profile information and preferences</li>
            <li>Account credentials</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">Usage Data</h3>
          <p>
            We may also collect information that your browser sends whenever you visit our website or access our services via a device, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your device's IP address</li>
            <li>Browser type and version</li>
            <li>Pages of our website that you visit</li>
            <li>Time and date of your visit</li>
            <li>Time spent on those pages</li>
            <li>Device identifiers</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>We may use the information we collect for various purposes, including to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and maintain your account</li>
            <li>Provide and maintain our services</li>
            <li>Match you with relevant job opportunities</li>
            <li>Connect employers with suitable candidates</li>
            <li>Personalize your experience on our platform</li>
            <li>Send you job alerts and other notifications</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Improve our website and services</li>
            <li>Monitor usage of our services</li>
            <li>Detect and prevent fraudulent activities</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Disclosure of Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>We may share information we have collected about you in certain situations, including:</p>
          
          <h3 className="text-lg font-medium">With Employers</h3>
          <p>
            When you apply for jobs or make your profile visible on our platform, your professional information may be shared with employers who post job listings or search for candidates.
          </p>
          
          <h3 className="text-lg font-medium mt-4">Business Partners</h3>
          <p>
            We may share your information with business partners to offer you certain products, services, or promotions related to supply chain employment.
          </p>
          
          <h3 className="text-lg font-medium mt-4">Legal Requirements</h3>
          <p>
            We may disclose your information where required to do so by law or in response to valid requests by public authorities.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Security of Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Correct any inaccurate personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing of your personal information</li>
            <li>Request transfer of your personal information</li>
            <li>Withdraw consent</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> privacy@supplychain-ke.com<br />
            <strong>Address:</strong> SupplyChain_KE Headquarters, Nairobi, Kenya
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
