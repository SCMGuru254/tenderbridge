
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const Faq = () => {
  const faqs = [
    {
      question: "What is SupplyChain_KE?",
      answer: "SupplyChain_KE is Kenya's specialized platform connecting supply chain professionals with relevant opportunities. The platform aggregates jobs, provides industry-specific resources, ATS CV checking, career guidance, and connects professionals in supply chain, logistics, procurement, and related fields."
    },
    {
      question: "How do I apply for jobs on SupplyChain_KE?",
      answer: "When you find a job you're interested in, click the 'Apply Now' button. For jobs posted directly on our platform, you'll complete the application process here. For aggregated jobs from external sources, you'll be redirected to the original posting to complete your application."
    },
    {
      question: "How can I post a job on SupplyChain_KE?",
      answer: "Employers can post jobs directly on our platform by creating an account and navigating to the 'Post a Job' section. Job posting is completely free for all employers. Visit our job posting guide for step-by-step instructions."
    },
    {
      question: "Are there any fees to use SupplyChain_KE?",
      answer: "Job seekers can browse jobs, set up job alerts, and access basic resources completely free. For employers, posting jobs and accessing candidates is free. For premium features like ATS CV checking, advanced analytics, and priority support, we offer affordable payments through Paystack/M-Pesa. Companies can pay KES 2,000 (one-time, lifetime access) to respond to reviews about their services."
    },
    {
      question: "What premium features are available?",
      answer: "Our premium features include: ATS CV Checker ($5), Advanced Career Analytics ($10), Priority Customer Support ($3), Enhanced Profile Visibility ($7), and Premium Job Alerts ($5). All payments are one-time fees with lifetime access, processed securely through PayPal."
    },
    {
      question: "How often are new jobs added?",
      answer: "Our system automatically refreshes job listings multiple times daily. You can also manually refresh the jobs by clicking the 'Refresh Jobs' button on the Jobs page to see the very latest opportunities."
    },
    {
      question: "What makes SupplyChain_KE different from general job boards?",
      answer: "We focus exclusively on supply chain, logistics, procurement, and related fields in Kenya. This specialization means we offer more relevant job opportunities, industry-specific resources, ATS compatibility checking, salary benchmarking, career path guidance, professional networking, and a community of professionals in your field. Our value-added services include CV optimization, interview preparation, and industry trend analysis."
    },
    {
      question: "What is the ATS CV Checker?",
      answer: "Our ATS (Applicant Tracking System) Checker analyzes your CV/Resume to ensure it's optimized for the automated systems used by employers. It provides detailed feedback on keyword usage, formatting, sections, and readability to improve your chances of passing initial screening."
    },
    {
      question: "I found concerning content. What should I do?",
      answer: "If you encounter content that appears inappropriate or concerning, please use the 'Report' feature available on all content. Our moderation team reviews all reports within 24 hours. Content found to violate our terms will be marked as spam and removed to maintain the quality and safety of our platform."
    },
    {
      question: "How can I make my profile stand out to employers?",
      answer: "Complete your professional profile with a detailed CV, professional photo, and LinkedIn profile. Use our ATS CV Checker to optimize your resume. Regularly update your skills and experience, engage with our community through discussions and company reviews, and consider upgrading to premium features for enhanced visibility."
    },
    {
      question: "How do I pay for premium features?",
      answer: "All payments on SupplyChain_KE are processed securely via PayPal. When you select a premium feature, you'll be redirected to PayPal's secure payment system. M-Pesa integration is coming soon for added convenience for our Kenyan users."
    },
    {
      question: "What are the pricing packages for employers?",
      answer: "Posting jobs and accessing basic candidate information is completely free for employers. We believe in supporting job creation in the supply chain industry without barriers."
    },
    {
      question: "What are the pricing packages for service providers?",
      answer: "Service providers can join and offer their services for free. To respond to company reviews, companies pay a one-time lifetime fee of KES 2,000. Homepage Sponsors pay KES 4,500/year or KES 2,000/week. Advertisements cost KES 3,000/month. All payments are processed securely via Paystack (M-Pesa & Card)."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About SupplyChain_KE</CardTitle>
          <CardDescription>
            Common questions about our platform and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Need Help Posting a Job?</CardTitle>
            <CardDescription>
              Learn how to post jobs on our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Get step-by-step guidance on how to post effective job listings that attract the best supply chain talent.
            </p>
            <Link to="/post-job">
              <Button className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Post a Job Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
            <CardDescription>
              Contact our support team for further assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">If you couldn't find the answer to your question, please contact us at:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Email: support@supplychain-ke.com</li>
              <li>Phone: +254 700 000 000</li>
              <li>WhatsApp: +254 700 000 000</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Faq;
