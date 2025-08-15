import { supabase } from '@/integrations/supabase/client';

export interface ReviewData {
  company_id: string;
  reviewer_id: string;
  rating: number;
  title: string;
  review_text: string;
  pros?: string;
  cons?: string;
  position?: string;
  employment_status?: 'current' | 'former' | 'interview';
  employment_period?: string;
  location?: string;
  work_life_balance?: number;
  salary_benefits?: number;
  job_security?: number;
  management?: number;
  culture?: number;
  career_growth?: number;
  anonymous?: boolean;
}

export interface ReviewVote {
  review_id: string;
  helpful: boolean;
}

export interface ReviewReport {
  review_id: string;
  reason: string;
  details?: string;
}

class ReviewService {
  async createReview(data: ReviewData) {
    const { data: review, error } = await supabase
      .from('company_reviews')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return review;
  }

  async getCompanyReviews(companyId: string, options = {
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
    filterStatus: 'approved' as 'approved' | 'pending' | 'flagged' | 'rejected'
  }) {
    const { page, limit, sortBy, sortOrder, filterStatus } = options;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data: reviews, error, count } = await supabase
      .from('company_reviews')
      .select('*, reviewer:reviewer_id(full_name, avatar_url)', { count: 'exact' })
      .eq('company_id', companyId)
      .eq('status', filterStatus)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(start, end);

    if (error) throw error;
    return { reviews, total: count || 0 };
  }

  async getUserReviews(userId: string) {
    const { data: reviews, error } = await supabase
      .from('company_reviews')
      .select('*, company:company_id(name, logo_url)')
      .eq('reviewer_id', userId);

    if (error) throw error;
    return reviews;
  }

  async updateReview(reviewId: string, data: Partial<ReviewData>) {
    const { data: review, error } = await supabase
      .from('company_reviews')
      .update(data)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return review;
  }

  async voteReview(reviewId: string, helpful: boolean) {
    const { data, error } = await supabase
      .from('review_helpful_votes')
      .upsert(
        { review_id: reviewId, helpful },
        { onConflict: 'review_id,user_id' }
      )
      .select();

    if (error) throw error;
    return data;
  }

  async reportReview(reportData: ReviewReport) {
    const { data, error } = await supabase
      .from('review_reports')
      .insert([reportData])
      .select();

    if (error) throw error;
    return data;
  }

  async getReviewStats(companyId: string) {
    const { data: reviews, error } = await supabase
      .from('company_reviews')
      .select('rating, work_life_balance, salary_benefits, job_security, management, culture, career_growth')
      .eq('company_id', companyId)
      .eq('status', 'approved');

    if (error) throw error;
    return reviews;
  }
}

export const reviewService = new ReviewService();
