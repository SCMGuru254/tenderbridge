import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield } from "lucide-react";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: January 9, 2025
      </p>

      <Alert className="mb-8 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Important Payment Disclaimer:</strong> SupplyChain_KE does not interfere with, guarantee, or take responsibility for any payments between service providers and clients. We strongly recommend only paying for services after 100% completion and delivery. All financial transactions are solely between the contracting parties.
        </AlertDescription>
      </Alert>

      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Service Provider Agreement:</strong> By using our platform as a service provider, you agree to charge clients only after 100% delivery of agreed services. Violation of this principle may result in account suspension.
        </AlertDescription>
      </Alert>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you and SupplyChain_KE ("we," "us," or "our"), concerning your access to and use of the SupplyChain_KE website, mobile application, and related services (collectively, the "Platform").
          </p>
          <p>
            By accessing or using the Platform, you agree that you have read, understood, and agree to be bound by all of these Terms. If you do not agree with all of these Terms, you are expressly prohibited from using the Platform and must discontinue use immediately.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Platform Liability and Payment Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium text-red-600">Payment Non-Interference Policy</h3>
          <p>
            SupplyChain_KE operates as a platform connecting service providers with potential clients. We explicitly disclaim any responsibility, liability, or involvement in financial transactions between users.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Client Protection Guidelines</h4>
            <ul className="list-disc pl-6 space-y-1 text-yellow-800">
              <li>Only pay for services after complete delivery and satisfaction</li>
              <li>Verify service provider credentials and reviews before engagement</li>
              <li>Use secure payment methods with buyer protection</li>
              <li>Document all agreements and deliverables in writing</li>
              <li>Report any fraudulent activity immediately</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Service Provider Obligations</h4>
            <ul className="list-disc pl-6 space-y-1 text-blue-800">
              <li>Charge clients only after 100% completion of agreed services</li>
              <li>Provide clear scope of work and timelines</li>
              <li>Maintain professional standards and ethical practices</li>
              <li>Respond to client communications promptly</li>
              <li>Honor all commitments made during negotiations</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            <strong>Legal Disclaimer:</strong> SupplyChain_KE is not a party to any agreements between users and bears no responsibility for disputes, non-payment, incomplete services, or any other issues arising from user interactions. Users engage at their own risk and must seek legal recourse independently if needed.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Guidelines and User Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Before Contacting Service Providers</h3>
          <p>
            Users must read and acknowledge our payment protection guidelines before initiating contact with service providers. This acknowledgment includes understanding:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Payment should only be made after complete service delivery</li>
            <li>SupplyChain_KE does not guarantee service quality or outcomes</li>
            <li>All agreements are between the user and service provider only</li>
            <li>Users should conduct their own due diligence</li>
            <li>Dispute resolution is the responsibility of the contracting parties</li>
          </ol>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Important Reminders</h4>
            <ul className="list-disc pl-6 space-y-1 text-red-800">
              <li>Never pay 100% upfront for any service</li>
              <li>Be wary of prices that seem too good to be true</li>
              <li>Always verify service provider identity and credentials</li>
              <li>Keep records of all communications and agreements</li>
              <li>Report suspicious activity to our moderation team</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Content Moderation and Account Deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Reporting and Moderation</h3>
          <p>
            We maintain community standards through user reporting and automated moderation:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users can report inappropriate content or suspicious service providers</li>
            <li>Multiple reports (3+) automatically mark content as spam</li>
            <li>Reported content is reviewed within 72 hours</li>
            <li>Service provider accounts with multiple spam reports may be deleted</li>
            <li>Account deletion is permanent and cannot be reversed</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">Account Deletion Policy</h3>
          <p>
            Service provider accounts may be scheduled for deletion under the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Multiple verified reports of fraudulent activity</li>
            <li>Violation of our payment ethics guidelines</li>
            <li>Spam or misleading content</li>
            <li>Harassment or inappropriate behavior</li>
            <li>Repeated violations of platform terms</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Account deletion occurs 72 hours after meeting deletion criteria, allowing time for appeals through our support team.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment Terms and Premium Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Platform Payments</h3>
          <p>
            All payments to SupplyChain_KE for premium features are processed through PayPal:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ATS CV Checker and optimization tools</li>
            <li>Enhanced profile visibility</li>
            <li>Advanced analytics and insights</li>
            <li>Priority customer support</li>
            <li>Service provider review response capabilities</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Payment Processing</h3>
          <p>
            All payments are processed securely through PayPal. By making a payment, you agree to PayPal's terms of service. M-Pesa integration will be available soon.
          </p>

          <h3 className="text-lg font-medium mt-4">Refund Policy</h3>
          <p>
            Refunds may be available within 7 days of purchase for technical issues or service unavailability. No refunds are provided for change of mind or after successful service delivery.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Intellectual Property Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Platform and its original content, features, and functionality are owned by SupplyChain_KE and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          
          <h3 className="text-lg font-medium">User Content</h3>
          <p>
            You retain ownership of content you submit to the Platform. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content for Platform operations.
          </p>
          
          <h3 className="text-lg font-medium mt-4">Restrictions</h3>
          <p>
            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of our content except as expressly permitted.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Content Moderation and Reporting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We maintain community standards to ensure a safe and professional environment:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>All user-generated content is subject to moderation</li>
            <li>Users can report inappropriate content using our reporting system</li>
            <li>Reports are reviewed within 24 hours by our moderation team</li>
            <li>Content violating our terms will be marked as spam and removed</li>
            <li>Repeat violations may result in account suspension or termination</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Privacy and Data Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms by reference, describes how we collect, use, and protect your information. By using the Platform, you consent to our data practices as described in the Privacy Policy.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Disclaimers and Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Service Disclaimer</h3>
          <p>
            The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties or representations about the accuracy, reliability, completeness, or timeliness of any content or services.
          </p>

          <h3 className="text-lg font-medium mt-4">Job Listing Disclaimer</h3>
          <p>
            We aggregate job listings from various sources but do not verify the accuracy of all postings. Users should exercise due diligence when applying for positions.
          </p>

          <h3 className="text-lg font-medium mt-4">Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, SupplyChain_KE shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data, or goodwill, arising from your use of the Platform.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We may terminate or suspend your account and access to the Platform immediately, without prior notice, for any reason, including breach of these Terms.
          </p>
          <p>
            Upon termination, your right to use the Platform will cease immediately. Termination does not affect any rights or obligations that accrued prior to termination.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Governing Law and Jurisdiction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Kenya. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Kenya.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-none space-y-2">
            <li><strong>Email:</strong> legal@supplychain-ke.com</li>
            <li><strong>Support:</strong> support@supplychain-ke.com</li>
            <li><strong>Address:</strong> SupplyChain_KE Headquarters, Nairobi, Kenya</li>
            <li><strong>Phone:</strong> +254 700 000 000</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
