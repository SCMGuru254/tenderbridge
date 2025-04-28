import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';
import { jobMatcher } from './aiAgents';

export interface SupplyChainJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_at: string;
  created_at: string;
}

const JOB_SEARCH_QUERIES = [
  'supply chain jobs kenya',
  'logistics jobs kenya',
  'procurement jobs kenya',
  'warehouse jobs kenya'
];

export const jobService = {
  async fetchAndStoreJobs() {
    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getTime() - 24);
      
      // Check last fetch time
      const { data: lastFetch } = await supabase
        .from('job_fetch_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (lastFetch && new Date(lastFetch.created_at) > twentyFourHoursAgo) {
        console.log('Jobs were fetched within last 24 hours');
        return;
      }

      // Fetch jobs from Google Custom Search API
      const jobs = await Promise.all(
        JOB_SEARCH_QUERIES.map(async (query) => {
          try {
            const response = await axios.get(
              `https://www.googleapis.com/customsearch/v1`,
              {
                params: {
                  q: query,
                  key: import.meta.env.VITE_GOOGLE_API_KEY,
                  cx: import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID,
                  num: 10
                }
              }
            );

            return response.data.items.map((item: any) => ({
              title: item.title,
              company: this.extractCompany(item.title),
              location: this.extractLocation(item.snippet),
              description: item.snippet,
              url: item.link,
              posted_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            }));
          } catch (error) {
            console.error(`Error fetching jobs for query "${query}":`, error);
            return [];
          }
        })
      );

      // Flatten and store jobs
      const flattenedJobs = jobs.flat();
      if (flattenedJobs.length > 0) {
        await supabase.from('supply_chain_jobs').insert(flattenedJobs);
      }

      // Log the fetch
      await supabase.from('job_fetch_log').insert({
        created_at: new Date().toISOString()
      });

      // Delete old jobs (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      await supabase
        .from('supply_chain_jobs')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString());

    } catch (error) {
      console.error('Error in fetchAndStoreJobs:', error);
      throw error;
    }
  },

  async getJobs() {
    // Ensure jobs are up to date
    await this.fetchAndStoreJobs();
    
    // Return current jobs
    const { data: jobs, error } = await supabase
      .from('supply_chain_jobs')
      .select('*')
      .order('posted_at', { ascending: false });

    if (error) throw error;
    return jobs;
  },

  async matchJobsWithUser(userProfile: any) {
    const jobs = await this.getJobs();
    return await jobMatcher.matchJobs(jobs, userProfile);
  },

  private extractCompany(title: string): string {
    // Implement company name extraction logic
    return title.split(' - ')[0] || 'Unknown Company';
  },

  private extractLocation(snippet: string): string {
    // Implement location extraction logic
    const locationKeywords = ['Nairobi', 'Mombasa', 'Kisumu', 'Kenya'];
    for (const keyword of locationKeywords) {
      if (snippet.includes(keyword)) {
        return keyword;
      }
    }
    return 'Kenya';
  }
}; 