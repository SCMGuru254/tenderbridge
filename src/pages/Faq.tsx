
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Faq = () => {
  const faqs = [
    {
      question: "What is SupplyChain_KE?",
      answer: "SupplyChain_KE is Kenya's specialized platform connecting supply chain professionals with relevant opportunities. The platform aggregates jobs and provides industry-specific resources to help advance careers in supply chain, logistics, procurement, and related fields."
    },
    {
      question: "How do I apply for jobs on SupplyChain_KE?",
      answer: "When you find a job you're interested in, click the 'Apply Now' button. For jobs posted directly on our platform, you'll complete the application process here. For aggregated jobs from external sources, you'll be redirected to the original posting to complete your application."
    },
    {
      question: "Are there any fees to use SupplyChain_KE?",
      answer: "Job seekers can browse jobs, set up job alerts, and access basic resources completely free of charge. We also offer premium services and features for career advancement."
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
      question: "I found concerning content. What should I do?",
      answer: "If you encounter content that appears inappropriate or concerning, please use the 'Report' feature. Our team will investigate all reports to maintain the quality and safety of our platform."
    },
    {
      question: "How can I make my profile stand out to employers?",
      answer: "Complete your professional profile with a detailed CV, professional photo, and LinkedIn profile. Regularly update your skills and experience, and engage with our community through discussions and company reviews to increase visibility."
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
