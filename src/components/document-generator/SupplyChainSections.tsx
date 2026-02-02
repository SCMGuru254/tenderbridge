
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Award, Settings, TrendingUp, Building2 } from "lucide-react";

interface SupplyChainSectionsProps {
  certifications: string[];
  setCertifications: (value: string[]) => void;
  erpSystems: string[];
  setErpSystems: (value: string[]) => void;
  metrics: string;
  setMetrics: (value: string) => void;
  industryExperience: string[];
  setIndustryExperience: (value: string[]) => void;
}

const COMMON_CERTIFICATIONS = [
  "CIPS (Chartered Institute of Procurement & Supply)",
  "CSCP (Certified Supply Chain Professional)",
  "CPIM (Certified in Planning and Inventory Management)",
  "Six Sigma Green Belt",
  "Six Sigma Black Belt",
  "Lean Certification",
  "PMP (Project Management Professional)",
  "CPSM (Certified Professional in Supply Management)",
  "CLTD (Certified in Logistics, Transportation and Distribution)",
  "SCOR-P (Supply Chain Operations Reference - Professional)"
];

const COMMON_ERP_SYSTEMS = [
  "SAP S/4HANA",
  "SAP MM/SD",
  "Oracle SCM Cloud",
  "Oracle EBS",
  "Microsoft Dynamics 365",
  "NetSuite",
  "Infor SCM",
  "Blue Yonder (JDA)",
  "Manhattan Associates WMS",
  "Coupa",
  "Ariba",
  "Kinaxis RapidResponse"
];

const INDUSTRY_SECTORS = [
  "FMCG / Consumer Goods",
  "Pharmaceuticals / Healthcare",
  "Manufacturing",
  "Retail / E-commerce",
  "3PL / Logistics",
  "Automotive",
  "Oil & Gas / Energy",
  "Agriculture / Agribusiness",
  "Technology / Electronics",
  "Construction / Building Materials",
  "Food & Beverage",
  "Telecommunications"
];

const SupplyChainSections = ({
  certifications,
  setCertifications,
  erpSystems,
  setErpSystems,
  metrics,
  setMetrics,
  industryExperience,
  setIndustryExperience
}: SupplyChainSectionsProps) => {
  
  const toggleCertification = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter(c => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const toggleErpSystem = (erp: string) => {
    if (erpSystems.includes(erp)) {
      setErpSystems(erpSystems.filter(e => e !== erp));
    } else {
      setErpSystems([...erpSystems, erp]);
    }
  };

  const toggleIndustry = (industry: string) => {
    if (industryExperience.includes(industry)) {
      setIndustryExperience(industryExperience.filter(i => i !== industry));
    } else {
      setIndustryExperience([...industryExperience, industry]);
    }
  };

  return (
    <Accordion type="multiple" className="w-full" defaultValue={["certifications"]}>
      {/* Certifications Section */}
      <AccordionItem value="certifications">
        <AccordionTrigger className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Professional Certifications
            {certifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">{certifications.length}</Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Select your supply chain certifications
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {COMMON_CERTIFICATIONS.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cert-${cert}`}
                    checked={certifications.includes(cert)}
                    onCheckedChange={() => toggleCertification(cert)}
                  />
                  <label
                    htmlFor={`cert-${cert}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {cert}
                  </label>
                </div>
              ))}
            </div>
            <Input
              placeholder="Add other certifications (comma-separated)"
              className="mt-2"
              onBlur={(e) => {
                if (e.target.value) {
                  const newCerts = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                  setCertifications([...new Set([...certifications, ...newCerts])]);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* ERP & Software Skills Section */}
      <AccordionItem value="erp">
        <AccordionTrigger className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            ERP & Software Skills
            {erpSystems.length > 0 && (
              <Badge variant="secondary" className="ml-2">{erpSystems.length}</Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Select ERP systems and supply chain software you've worked with
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {COMMON_ERP_SYSTEMS.map((erp) => (
                <div key={erp} className="flex items-center space-x-2">
                  <Checkbox
                    id={`erp-${erp}`}
                    checked={erpSystems.includes(erp)}
                    onCheckedChange={() => toggleErpSystem(erp)}
                  />
                  <label
                    htmlFor={`erp-${erp}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {erp}
                  </label>
                </div>
              ))}
            </div>
            <Input
              placeholder="Add other systems (comma-separated)"
              className="mt-2"
              onBlur={(e) => {
                if (e.target.value) {
                  const newErps = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                  setErpSystems([...new Set([...erpSystems, ...newErps])]);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Metrics & Achievements Section */}
      <AccordionItem value="metrics">
        <AccordionTrigger className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Metrics & Achievements
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Quantify your impact with specific metrics and achievements
            </p>
            <Textarea
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              placeholder={`Examples:\n• Reduced inventory costs by 25% ($500K annual savings)\n• Improved on-time delivery from 85% to 98%\n• Negotiated supplier contracts saving $2M annually\n• Led warehouse optimization reducing pick times by 40%\n• Managed $50M+ procurement portfolio`}
              rows={5}
              className="text-sm"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Industry Experience Section */}
      <AccordionItem value="industry">
        <AccordionTrigger className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Industry Experience
            {industryExperience.length > 0 && (
              <Badge variant="secondary" className="ml-2">{industryExperience.length}</Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Select industries where you have supply chain experience
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INDUSTRY_SECTORS.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={industryExperience.includes(industry)}
                    onCheckedChange={() => toggleIndustry(industry)}
                  />
                  <label
                    htmlFor={`industry-${industry}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {industry}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SupplyChainSections;
