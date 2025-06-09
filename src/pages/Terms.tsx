
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: January 9, 2025
      </p>

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
          <p>
            We reserve the right, in our sole discretion, to make changes or modifications to these Terms at any time. We will alert you about changes by updating the "Last Updated" date of these Terms, and you waive any right to receive specific notice of each such change.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Platform Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            SupplyChain_KE is a specialized career platform focused on supply chain, logistics, procurement, and related fields in Kenya and East Africa. Our services include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Job listing aggregation and posting services</li>
            <li>Career matching and recommendation services</li>
            <li>ATS CV checking and optimization tools</li>
            <li>Professional networking and community features</li>
            <li>Career guidance and industry insights</li>
            <li>Premium analytics and reporting services</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Registration and Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            To access certain features of the Platform, you may be required to register for an account. When registering, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide true, accurate, current, and complete information</li>
            <li>Maintain and promptly update your registration information</li>
            <li>Maintain the security and confidentiality of your login credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access or security breaches</li>
          </ul>
          <p>
            We reserve the right to refuse registration or terminate accounts that violate these Terms or contain inappropriate, false, or misleading information.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Representations and Warranties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>By using the Platform, you represent and warrant that:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>You are at least 18 years of age or have reached the age of majority in your jurisdiction</li>
            <li>You have the legal capacity to enter into these Terms</li>
            <li>All information you provide is truthful and accurate</li>
            <li>You will comply with all applicable laws and regulations</li>
            <li>You will not use automated systems to access the Platform without permission</li>
            <li>You will not use the Platform for any illegal, unauthorized, or commercial purposes not expressly permitted</li>
            <li>You will respect the intellectual property rights of others</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prohibited Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You may not access or use the Platform for any purpose other than that for which we make it available. Prohibited activities include:</p>
          
          <h3 className="text-lg font-medium">Content Violations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Posting false, misleading, or fraudulent job listings or information</li>
            <li>Uploading malicious files, viruses, or harmful code</li>
            <li>Sharing inappropriate, offensive, or discriminatory content</li>
            <li>Impersonating other individuals or organizations</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Technical Violations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Attempting to gain unauthorized access to our systems</li>
            <li>Using automated tools to scrape or harvest data</li>
            <li>Reverse engineering or attempting to extract source code</li>
            <li>Interfering with the Platform's operation or security</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Commercial Violations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Using the Platform for unauthorized commercial purposes</li>
            <li>Selling or redistributing Platform access or content</li>
            <li>Posting spam or unsolicited promotional content</li>
            <li>Competing directly with our services using our data</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment Terms and Premium Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Free Services</h3>
          <p>
            Basic job searching, profile creation, and standard job applications are provided free of charge to all users.
          </p>

          <h3 className="text-lg font-medium mt-4">Premium Services</h3>
          <p>
            Certain advanced features require payment, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ATS CV Checker and optimization tools</li>
            <li>Advanced career analytics and insights</li>
            <li>Enhanced profile visibility</li>
            <li>Priority customer support</li>
            <li>Premium job alert services</li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Payment Processing</h3>
          <p>
            All payments are processed securely through PayPal. By making a payment, you agree to PayPal's terms of service. M-Pesa integration will be available soon. Payments are typically one-time fees with lifetime access to the purchased feature.
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
