
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: May 2, 2025
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            These Terms of Service constitute a legally binding agreement made between you and SupplyChain_KE ("we," "us," or "our"), concerning your access to and use of the SupplyChain_KE website and platform.
          </p>
          <p>
            You agree that by accessing the platform, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the platform and you must discontinue use immediately.
          </p>
          <p>
            We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of these Terms of Service, and you waive any right to receive specific notice of each such change.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Intellectual Property Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Unless otherwise indicated, the platform is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the platform (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
          </p>
          <p>
            The Content and the Marks are provided on the platform "AS IS" for your information and personal use only. Except as expressly provided in these Terms of Service, no part of the platform and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Representations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>By using the platform, you represent and warrant that:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
            <li>You are not a minor in the jurisdiction in which you reside.</li>
            <li>You will not access the platform through automated or non-human means, whether through a bot, script, or otherwise.</li>
            <li>You will not use the platform for any illegal or unauthorized purpose.</li>
            <li>Your use of the platform will not violate any applicable law or regulation.</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You may be required to register with the platform to access certain features. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prohibited Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You may not access or use the platform for any purpose other than that for which we make the platform available. The platform may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
          
          <p>As a user of the platform, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Systematically retrieve data or other content from the platform to create or compile, directly or indirectly, a collection, compilation, database, or directory.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the platform.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>Engage in any automated use of the system, such as using scripts to send comments or messages.</li>
            <li>Use the platform in a manner inconsistent with any applicable laws or regulations.</li>
            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the platform.</li>
            <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You acknowledge and agree that any questions, comments, suggestions, ideas, feedback, or other information regarding the platform ("Submissions") provided by you to us are non-confidential and shall become our sole property. We shall own exclusive rights, including all intellectual property rights, and shall be entitled to the unrestricted use and dissemination of these Submissions for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p>
            If you wish to terminate your account, you may simply discontinue using the platform. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            To the maximum extent permitted by law, in no event shall we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the platform, even if we have been advised of the possibility of such damages.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            For any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> terms@supplychain-ke.com<br />
            <strong>Address:</strong> SupplyChain_KE Headquarters, Nairobi, Kenya
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
