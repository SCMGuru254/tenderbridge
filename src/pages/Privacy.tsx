
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: January 9, 2025
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            SupplyChain_KE ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, and utilize our supply chain and logistics career services.
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
          <h3 className="text-lg font-medium">Personal Information</h3>
          <p>
            When you register an account, apply for jobs, or use certain features of our platform, we may collect personal information, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email address, phone number, and contact details</li>
            <li>Professional information including work experience, skills, education, and certifications</li>
            <li>Resume/CV and other job application materials</li>
            <li>Profile information, preferences, and career interests</li>
            <li>Account credentials and security information</li>
            <li>Payment information for premium services (processed securely via PayPal)</li>
            <li>Communication records and support interactions</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">Technical Information</h3>
          <p>
            We automatically collect certain technical information when you access our platform:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address, browser type, and device information</li>
            <li>Operating system and device identifiers</li>
            <li>Pages visited, time spent, and navigation patterns</li>
            <li>Referral sources and search terms</li>
            <li>Location data (with your explicit consent)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">Document and File Information</h3>
          <p>
            When you upload documents for ATS checking or other services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>CV/Resume content and metadata</li>
            <li>Document format and technical specifications</li>
            <li>Analysis results and recommendations</li>
            <li>File access logs for security purposes</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>We use the collected information for the following purposes:</p>
          
          <h3 className="text-lg font-medium">Core Services</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and maintain your account and profile</li>
            <li>Provide job matching and recommendation services</li>
            <li>Enable applications to job postings</li>
            <li>Connect employers with suitable candidates</li>
            <li>Facilitate communication between users</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Premium Services</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Conduct ATS CV analysis and optimization</li>
            <li>Provide career guidance and analytics</li>
            <li>Offer enhanced profile visibility</li>
            <li>Deliver priority customer support</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Platform Improvement</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personalize your platform experience</li>
            <li>Send relevant job alerts and notifications</li>
            <li>Analyze usage patterns to improve our services</li>
            <li>Conduct research and development</li>
            <li>Monitor and prevent fraudulent activities</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Information Sharing and Disclosure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">With Employers and Recruiters</h3>
          <p>
            When you apply for jobs or make your profile visible, relevant professional information may be shared with employers and recruiters. We never share your contact information without your explicit consent.
          </p>
          
          <h3 className="text-lg font-medium mt-4">Service Providers</h3>
          <p>
            We work with trusted third-party service providers to deliver our services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>PayPal for secure payment processing</li>
            <li>Cloud storage providers for document hosting</li>
            <li>Analytics services for platform improvement</li>
            <li>Communication services for notifications</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Legal Requirements</h3>
          <p>
            We may disclose your information when required by law, court order, or government request, or to protect our rights, property, or safety.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Security and Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We implement comprehensive security measures to protect your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>End-to-end encryption for sensitive data transmission</li>
            <li>Secure servers with regular security updates</li>
            <li>Multi-factor authentication options</li>
            <li>Regular security audits and penetration testing</li>
            <li>Employee training on data protection practices</li>
            <li>Incident response procedures for security breaches</li>
          </ul>
          <p className="mt-4">
            While we take reasonable steps to secure your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining industry-standard protection measures.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Rights and Choices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You have the following rights regarding your personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Update or correct any inaccurate personal information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
            <li><strong>Restriction:</strong> Limit how we process your personal information</li>
            <li><strong>Portability:</strong> Request transfer of your information to another service</li>
            <li><strong>Objection:</strong> Object to certain types of processing</li>
            <li><strong>Withdrawal:</strong> Withdraw consent for processing activities</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-4">Marketing Communications</h3>
          <p>
            You can opt out of marketing communications at any time by clicking the unsubscribe link in emails or updating your account preferences.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We retain your information for as long as necessary to provide our services and comply with legal obligations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information: Until account deletion plus 1 year for legal compliance</li>
            <li>CV/Resume documents: 5 years or until deletion request</li>
            <li>Application records: 3 years for employer compliance</li>
            <li>Payment records: 7 years for tax and audit purposes</li>
            <li>Support communications: 2 years from last interaction</li>
            <li>Analytics data: Anonymized after 18 months</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>International Data Transfers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Your information may be transferred to and processed in countries other than Kenya. We ensure adequate protection through:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard contractual clauses with service providers</li>
            <li>Adequacy decisions for data transfer destinations</li>
            <li>Binding corporate rules where applicable</li>
            <li>Your explicit consent for specific transfers</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our platform is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <ul className="list-none space-y-2">
            <li><strong>Email:</strong> privacy@supplychain-ke.com</li>
            <li><strong>Data Protection Officer:</strong> dpo@supplychain-ke.com</li>
            <li><strong>Address:</strong> SupplyChain_KE, Nairobi, Kenya</li>
            <li><strong>Phone:</strong> +254 700 000 000</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
