
import { Job } from "../types/job.ts";

export function getFallbackJobs(): Job[] {
  return [
    {
      title: 'Supply Chain Manager',
      company: 'East Africa Breweries Limited',
      location: 'Nairobi, Kenya',
      job_type: 'full_time',
      description: 'EABL is seeking a Supply Chain Manager to oversee operations across Kenya. Responsibilities include managing inventory, coordinating with suppliers, and optimizing the supply chain process.',
      job_url: 'https://www.eabl.com/careers/supply-chain-manager',
      source: 'Directly Listed'
    },
    {
      title: 'Procurement Officer',
      company: 'Safaricom PLC',
      location: 'Nairobi, Kenya',
      job_type: 'full_time',
      description: 'Safaricom is looking for a Procurement Officer to handle vendor relationships and purchasing processes for their expanding telecom operations.',
      job_url: 'https://www.safaricom.co.ke/careers/procurement-officer',
      source: 'Directly Listed'
    },
    {
      title: 'Logistics Coordinator',
      company: 'Kenya Airways',
      location: 'Nairobi, Kenya',
      job_type: 'contract',
      description: 'Kenya Airways needs a Logistics Coordinator to handle cargo operations and ensure efficient movement of goods.',
      job_url: 'https://www.kenya-airways.com/careers/logistics-coordinator',
      source: 'Directly Listed'
    },
    {
      title: 'Supply Chain Intern',
      company: 'Unilever Kenya',
      location: 'Nairobi, Kenya',
      job_type: 'internship',
      description: 'Unilever is offering internships for supply chain graduates to gain hands-on experience in FMCG supply chain operations.',
      job_url: 'https://www.unilever.co.ke/careers/supply-chain-intern',
      source: 'Directly Listed'
    },
    {
      title: 'Warehouse Manager',
      company: 'Tuskys Supermarkets',
      location: 'Nakuru, Kenya',
      job_type: 'full_time',
      description: 'Tuskys is hiring a Warehouse Manager to oversee inventory management and warehouse operations for their retail chain.',
      job_url: 'https://www.tuskys.com/careers/warehouse-manager',
      source: 'Directly Listed'
    }
  ];
}
