import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';
import { jobMatcher } from './aiAgents';
import { JOB_CONFIG } from '@/config/jobs';
import { JobServiceError, ValidationError, RateLimitError, FetchError } from '@/utils/errors';
import * as cheerio from 'cheerio';

export interface SupplyChainJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_at: string;
  created_at: string;
  source?: string;
}

type JobSource = typeof JOB_CONFIG.DIRECT_SOURCES[number];

class JobService {
  private async validateJobData(job: Partial<SupplyChainJob>): Promise<void> {
    if (!job.title || !job.url) {
      throw new ValidationError('Invalid job data: missing required fields', job);
    }
  }

  private async checkRateLimit(): Promise<void> {
    const { data: count, error } = await supabase
      .from('job_fetch_log')
      .select('count', { count: 'exact' })
      .gt('created_at', new Date(Date.now() - 3600000).toISOString());
      
    if (error) {
      throw new JobServiceError('Failed to check rate limit', 'RATE_LIMIT_CHECK_ERROR', error);
    }
    
    if (count && Number(count) > JOB_CONFIG.MAX_REQUESTS_PER_HOUR) {
      throw new RateLimitError('Rate limit exceeded');
    }
  }

  private async logMetrics(operation: string, duration: number, success: boolean): Promise<void> {
    try {
      await supabase.from('service_metrics').insert({
        operation,
        duration_ms: duration,
        success,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log metrics:', error);
    }
  }

  private extractCompany(title: string): string {
    // Remove common job title prefixes
    const cleanTitle = title
      .replace(/^(Senior|Junior|Lead|Principal|Staff)\s+/i, '')
      .replace(/\s+\(.*\)$/, ''); // Remove anything in parentheses at the end

    // Extract company name if it's in the format "Position at Company"
    const atMatch = cleanTitle.match(/at\s+(.+)$/i);
    if (atMatch) {
      return atMatch[1].trim();
    }

    // Extract company name if it's in the format "Company - Position"
    const dashMatch = cleanTitle.match(/^(.+?)\s*-\s*/);
    if (dashMatch) {
      return dashMatch[1].trim();
    }

    return 'Unknown Company';
  }

  private extractLocation(snippet: string): string {
    const locationRegex = new RegExp(
      `(${JOB_CONFIG.LOCATION_KEYWORDS.join('|')})`,
      'i'
    );
    const match = snippet.match(locationRegex);
    return match ? match[1] : JOB_CONFIG.DEFAULT_LOCATION;
  }

  private async getExistingJobUrls(): Promise<Set<string>> {
    const { data: jobs, error } = await supabase
      .from('supply_chain_jobs')
      .select('url');
    
    if (error) {
      throw new JobServiceError('Failed to fetch existing job URLs', 'FETCH_ERROR', error);
    }
    
    return new Set(jobs?.map(job => job.url) || []);
  }

  private async deduplicateJobs(jobs: SupplyChainJob[]): Promise<SupplyChainJob[]> {
    const existingUrls = await this.getExistingJobUrls();
    return jobs.filter(job => !existingUrls.has(job.url));
  }

  private async scrapeDirectSource(source: JobSource): Promise<SupplyChainJob[]> {
    try {
      const response = await axios.get(source.url);
      const $ = cheerio.load(response.data);
      const jobs: SupplyChainJob[] = [];

      $(source.selector).each((_: number, element: any) => {
        const $element = $(element);
        let title = '';
        let company = '';
        let location = '';
        let description = '';
        let url = '';

        // Different parsing logic for each source
        switch (source.name) {
          case 'BrighterMonday':
            title = $element.find('.job-title').text().trim();
            company = $element.find('.company-name').text().trim();
            location = $element.find('.location').text().trim();
            description = $element.find('.job-description').text().trim();
            url = $element.find('a.job-title').attr('href') || '';
            break;

          case 'MyJobMag':
            title = $element.find('.job-title').text().trim();
            company = $element.find('.company-name').text().trim();
            location = $element.find('.job-location').text().trim();
            description = $element.find('.job-description').text().trim();
            url = $element.find('a.job-title').attr('href') || '';
            break;

          case 'Fuzu':
            title = $element.find('.job-title').text().trim();
            company = $element.find('.company-name').text().trim();
            location = $element.find('.job-location').text().trim();
            description = $element.find('.job-description').text().trim();
            url = $element.find('a.job-link').attr('href') || '';
            break;
        }

        if (title && url) {
          jobs.push({
            title,
            company: company || this.extractCompany(title),
            location: location || this.extractLocation(description),
            description,
            url,
            posted_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            id: '',
            source: source.name
          });
        }
      });

      return jobs;
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      return [];
    }
  }

  async fetchAndStoreJobs(): Promise<void> {
    const startTime = Date.now();
    let success = false;

    try {
      await this.checkRateLimit();

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - JOB_CONFIG.CACHE_DURATION_HOURS);
      
      // Check last fetch time
      const { data: lastFetch, error: fetchError } = await supabase
        .from('job_fetch_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new JobServiceError('Failed to check last fetch time', 'FETCH_ERROR', fetchError);
      }
        
      if (lastFetch && new Date(lastFetch.created_at) > twentyFourHoursAgo) {
        console.log('Jobs were fetched within last 24 hours');
        success = true;
        return;
      }

      // Fetch jobs from both Google Custom Search and direct sources
      const [googleJobs, directJobs] = await Promise.all([
        // Google Custom Search jobs
        Promise.all(
          JOB_CONFIG.SEARCH_QUERIES.map(async (query) => {
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

              return response.data.items.map((item: any) => {
                const job: SupplyChainJob = {
                  title: item.title,
                  company: this.extractCompany(item.title),
                  location: this.extractLocation(item.snippet),
                  description: item.snippet,
                  url: item.link,
                  posted_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  id: '',
                  source: 'Google Search'
                };
                this.validateJobData(job);
                return job;
              });
            } catch (error) {
              console.error(`Error fetching jobs for query "${query}":`, error);
              return [];
            }
          })
        ),
        // Direct source jobs
        Promise.all(
          JOB_CONFIG.DIRECT_SOURCES.map(source => this.scrapeDirectSource(source))
        )
      ]);

      // Flatten, deduplicate and store jobs
      const flattenedJobs = [...googleJobs.flat(), ...directJobs.flat()];
      const uniqueJobs = await this.deduplicateJobs(flattenedJobs);
      
      if (uniqueJobs.length > 0) {
        const { error: insertError } = await supabase
          .from('supply_chain_jobs')
          .insert(uniqueJobs);

        if (insertError) {
          throw new JobServiceError('Failed to insert jobs', 'INSERT_ERROR', insertError);
        }
      }

      // Log the fetch
      const { error: logError } = await supabase
        .from('job_fetch_log')
        .insert({
          created_at: new Date().toISOString()
        });

      if (logError) {
        throw new JobServiceError('Failed to log fetch', 'LOG_ERROR', logError);
      }

      // Delete old jobs
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - JOB_CONFIG.RETENTION_DAYS);
      
      const { error: deleteError } = await supabase
        .from('supply_chain_jobs')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (deleteError) {
        throw new JobServiceError('Failed to delete old jobs', 'DELETE_ERROR', deleteError);
      }

      success = true;
    } catch (error) {
      console.error('Error in fetchAndStoreJobs:', error);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      await this.logMetrics('fetchAndStoreJobs', duration, success);
    }
  }

  async getJobs(): Promise<SupplyChainJob[]> {
    const startTime = Date.now();
    let success = false;

    try {
      // Ensure jobs are up to date
      await this.fetchAndStoreJobs();
      
      // Return current jobs
      const { data: jobs, error } = await supabase
        .from('supply_chain_jobs')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) {
        throw new JobServiceError('Failed to fetch jobs', 'FETCH_ERROR', error);
      }

      success = true;
      return jobs || [];
    } catch (error) {
      console.error('Error in getJobs:', error);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      await this.logMetrics('getJobs', duration, success);
    }
  }

  async matchJobsWithUser(userProfile: any): Promise<any> {
    const startTime = Date.now();
    let success = false;

    try {
      const jobs = await this.getJobs();
      const result = await jobMatcher.matchJobs(jobs, userProfile);
      success = true;
      return result;
    } catch (error) {
      console.error('Error in matchJobsWithUser:', error);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      await this.logMetrics('matchJobsWithUser', duration, success);
    }
  }
}

export const jobService = new JobService(); 