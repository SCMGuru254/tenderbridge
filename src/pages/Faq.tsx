
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Faq = () => {
  const faqs = [
    {
      question: "What is SupplyChain_KE?",
      answer: "SupplyChain_KE is a specialized job platform connecting supply chain professionals with relevant job opportunities across Kenya. We aggregate jobs from multiple sources and provide industry-specific resources to help advance your career in supply chain, logistics, procurement, and related fields."
    },
    {
      question: "How do I apply for jobs on SupplyChain_KE?",
      answer: "When you find a job you're interested in, simply click the 'Apply Now' button. For jobs posted directly on our platform, you'll complete the application process here. For jobs aggregated from external sources, you'll be redirected to the original job posting where you can complete your application."
    },
    {
      question: "Are all jobs on SupplyChain_KE verified?",
      answer: "We display jobs from two main sources: 1) Jobs posted directly on our platform, which undergo review by our team, and 2) Jobs aggregated from trusted external sources like LinkedIn, BrighterMonday, and others. While we make efforts to ensure quality, we recommend conducting your own due diligence for externally sourced positions."
    },
    {
      question: "How often are new jobs added?",
      answer: "Our system automatically refreshes job listings multiple times daily. You can also manually refresh the jobs by clicking the 'Refresh Jobs' button on the Jobs page to see the very latest opportunities."
    },
    {
      question: "How can I post a job on SupplyChain_KE?",
      answer: "Employers can post jobs directly on our platform by creating an account and navigating to the 'Post a Job' section. We offer various packages to help your job posting reach qualified supply chain professionals across Kenya."
    },
    {
      question: "What makes SupplyChain_KE different from general job boards?",
      answer: "We focus exclusively on supply chain, logistics, procurement, and related fields in Kenya. This specialization means we offer more relevant job opportunities, industry-specific resources, and a community of professionals in your field."
    },
    {
      question: "Is SupplyChain_KE free to use for job seekers?",
      answer: "Yes, job seekers can browse jobs, set up job alerts, and access basic resources completely free of charge. We also offer premium services and features for career advancement."
    },
    {
      question: "I found a job that seems suspicious. What should I do?",
      answer: "If you encounter a job posting that appears fraudulent or suspicious, please report it immediately using the 'Report Job' feature. Our team will investigate and take appropriate action to maintain the quality of our job listings."
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
            <li>Email: support@supplychainke.com</li>
            <li>Phone: +254 700 000 000</li>
            <li>WhatsApp: +254 700 000 000</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Faq;
