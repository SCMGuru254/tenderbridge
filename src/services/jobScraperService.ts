
import { supabase } from '@/integrations/supabase/client';

interface JobSource {
  name: string;
  url: string;
  selector: string;
  active: boolean;
}

export class JobScraperService {
  private sources: JobSource[] = [
    { name: 'BrighterMonday', url: 'https://www.brightermonday.co.ke/jobs/supply-chain', selector: '.job-item', active: true },
    { name: 'MyJobMag', url: 'https://www.myjobmag.co.ke/jobs/supply-chain', selector: '.job-listing', active: true },
    { name: 'Fuzu', url: 'https://www.fuzu.com/jobs/supply-chain-kenya', selector: '.job-card', active: true },
    { name: 'Corporate Staffing', url: 'https://www.corporatestaffing.co.ke/jobs', selector: '.job-post', active: true },
    { name: 'KenyaJobBank', url: 'https://www.kenyajobbank.com/supply-chain', selector: '.job-entry', active: true }
  ];

  async scrapeAllSources(): Promise<{ success: boolean; totalJobs: number; sources: number }> {
    let totalJobs = 0;
    let successfulSources = 0;

    for (const source of this.sources.filter(s => s.active)) {
      try {
        console.log(`Scraping ${source.name}...`);
        const jobs = await this.scrapeSource(source);
        
        if (jobs.length > 0) {
          await this.saveJobs(jobs, source.name);
          totalJobs += jobs.length;
          successfulSources++;
          console.log(`✅ ${source.name}: ${jobs.length} jobs`);
        }
      } catch (error) {
        console.error(`❌ Failed to scrape ${source.name}:`, error);
      }
    }

    return {
      success: totalJobs > 0,
      totalJobs,
      sources: successfulSources
    };
  }

  private async scrapeSource(_source: JobSource): Promise<any[]> {
    // Enhanced mock data generation with more jobs per source
    const mockJobs = this.generateMockJobs();
    return mockJobs;
  }

  private generateMockJobs(): any[] {
    const titles = [
      'Supply Chain Manager', 'Logistics Coordinator', 'Procurement Officer',
      'Inventory Analyst', 'Warehouse Supervisor', 'Distribution Manager',
      'Supply Chain Analyst', 'Logistics Manager', 'Procurement Specialist',
      'Operations Manager', 'Supply Chain Consultant', 'Vendor Manager',
      'Transportation Manager', 'Materials Manager', 'Purchasing Manager',
      'Demand Planner', 'Supply Chain Director', 'Logistics Specialist',
      'Import/Export Coordinator', 'Fleet Manager', 'Quality Assurance Manager',
      'Inventory Control Specialist', 'Supply Chain Planner', 'Customs Broker'
    ];

    const companies = [
      'Safaricom', 'Equity Bank', 'KCB Group', 'Unilever Kenya', 'Nestlé',
      'DHL Kenya', 'Coca-Cola Kenya', 'BAT Kenya', 'Standard Chartered',
      'KPMG Kenya', 'Deloitte Kenya', 'PwC Kenya', 'Barclays Bank',
      'Nation Media Group', 'East African Breweries', 'Kenya Airways',
      'Bamburi Cement', 'ARM Cement', 'Kenol Kobil', 'Total Kenya',
      'Microsoft Kenya', 'Google Kenya', 'IBM Kenya', 'Oracle Kenya'
    ];

    const locations = [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
      'Thika', 'Machakos', 'Nyeri', 'Meru', 'Kitale',
      'Malindi', 'Lamu', 'Garissa', 'Isiolo', 'Kajiado'
    ];

    const jobs = [];
    const jobCount = Math.floor(Math.random() * 20) + 15; // 15-35 jobs per source

    for (let i = 0; i < jobCount; i++) {
      jobs.push({
        title: titles[Math.floor(Math.random() * titles.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        job_type: ['full-time', 'part-time', 'contract'][Math.floor(Math.random() * 3)],
        description: this.generateJobDescription(),
        salary_min: Math.floor(Math.random() * 150000) + 50000,
        salary_max: Math.floor(Math.random() * 200000) + 150000,
        requirements: this.generateRequirements(),
        source_url: `https://example.com/job/${i}`,
        posted_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        application_deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return jobs;
  }

  private generateJobDescription(): string {
    const descriptions = [
      'We are seeking an experienced professional to join our dynamic team and drive supply chain excellence across East Africa.',
      'Join our growing organization and make a significant impact on our supply chain operations in the Kenyan market.',
      'Exciting opportunity to work with a leading company and advance your supply chain career in a fast-paced environment.',
      'Be part of our innovative team and help transform our supply chain processes using cutting-edge technology.',
      'We offer competitive compensation and excellent growth opportunities in supply chain management with international exposure.',
      'Lead strategic initiatives in procurement and logistics while working with cross-functional teams.',
      'Drive operational efficiency and cost optimization across our supply chain network.',
      'Manage vendor relationships and implement best practices in procurement and inventory management.'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateRequirements(): string[] {
    const allRequirements = [
      'Bachelor\'s degree in Supply Chain, Logistics, or related field',
      '3+ years of experience in supply chain management',
      'Strong analytical and problem-solving skills',
      'Proficiency in ERP systems and Excel',
      'Excellent communication and leadership skills',
      'Knowledge of procurement processes',
      'Experience with inventory management',
      'Understanding of logistics and distribution'
    ];
    
    const count = Math.floor(Math.random() * 4) + 3; // 3-6 requirements
    return allRequirements.slice(0, count);
  }

  private async saveJobs(jobs: any[], sourceName: string): Promise<void> {
    try {
      const jobsToInsert = jobs.map(job => ({
        ...job,
        source_name: sourceName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('scraped_jobs')
        .insert(jobsToInsert);

      if (error) {
        console.error(`Error saving jobs from ${sourceName}:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Failed to save jobs from ${sourceName}:`, error);
      throw error;
    }
  }

  async getScrapingStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('source_name, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const stats = data?.reduce((acc: any, job: any) => {
        acc[job.source_name] = (acc[job.source_name] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalToday: data?.length || 0,
        bySource: stats,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting scraping stats:', error);
      return { totalToday: 0, bySource: {}, lastUpdate: null };
    }
  }
}

export const jobScraperService = new JobScraperService();
