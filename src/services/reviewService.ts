import { supabase } from '@/integrations/supabase/client';

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryAverages: {
    work_life_balance?: number;
    salary_benefits?: number;
    job_security?: number;
    management?: number;
    culture?: number;
    career_growth?: number;
  };
}

export interface ReviewData {
  id?: string;
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
  created_at?: string;
  status?: 'pending' | 'approved' | 'flagged' | 'rejected';
  [key: string]: any; // Add index signature for validation
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

interface ReviewService {
  createReview(data: ReviewData): Promise<ReviewData>;
  getCompanyReviews(companyId: string, options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filterStatus?: 'approved' | 'pending' | 'flagged' | 'rejected';
  }): Promise<{ reviews: ReviewData[]; total: number }>;
  getUserReviews(userId: string): Promise<ReviewData[]>;
  updateReview(reviewId: string, data: Partial<ReviewData>): Promise<ReviewData>;
  voteReview(reviewId: string, helpful: boolean): Promise<ReviewVote>;
  reportReview(reportData: ReviewReport): Promise<ReviewReport>;
  getReviewStats(companyId: string): Promise<ReviewStats>;
}

class ReviewServiceImpl implements ReviewService {
  async createReview(data: ReviewData) {
    // Validate ratings are between 1 and 5
    const ratingFields = ['rating', 'work_life_balance', 'salary_benefits', 'job_security', 'management', 'culture', 'career_growth'];
    ratingFields.forEach(field => {
      if (data[field] && (data[field] < 1 || data[field] > 5)) {
        throw new Error(`${field} must be between 1 and 5`);
      }
    });

    // Validate employment_status
    if (data.employment_status && !['current', 'former', 'interview'].includes(data.employment_status)) {
      throw new Error('Invalid employment status');
    }

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

    // Add validation for status values to match database constraints
    const validStatuses = ['pending', 'approved', 'rejected', 'flagged'];
    if (!validStatuses.includes(filterStatus)) {
      throw new Error('Invalid status filter');
    }

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

  async voteReview(reviewId: string, helpful: boolean): Promise<ReviewVote> {
    const { data, error } = await supabase
      .from('review_helpful_votes')
      .upsert(
        { review_id: reviewId, helpful },
        { onConflict: 'review_id,user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data as ReviewVote;
  }

  async reportReview(reportData: ReviewReport): Promise<ReviewReport> {
    const { data, error } = await supabase
      .from('review_reports')
      .insert([{
        review_id: reportData.review_id,
        reason: reportData.reason,
        details: reportData.details,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data as ReviewReport;
  }

  async getReviewStats(companyId: string): Promise<ReviewStats> {
    const { data: reviews, error } = await supabase
      .from('company_reviews')
      .select('rating, work_life_balance, salary_benefits, job_security, management, culture, career_growth')
      .eq('company_id', companyId)
      .eq('status', 'approved');

    if (error) throw error;

    if (!reviews?.length) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        categoryAverages: {}
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution = reviews.reduce((acc, review) => {
      const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      if (rating >= 1 && rating <= 5) {
        acc[rating]++;
      }
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    const categoryFields = [
      'work_life_balance',
      'salary_benefits',
      'job_security',
      'management',
      'culture',
      'career_growth'
    ] as const;

    const categoryAverages = categoryFields.reduce((acc, field) => {
      const validRatings = reviews
        .map(r => r[field])
        .filter((rating): rating is number => typeof rating === 'number');
      
      if (validRatings.length > 0) {
        acc[field] = validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length;
      }
      
      return acc;
    }, {} as ReviewStats['categoryAverages']);

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution,
      categoryAverages
    };
  }
}

export const reviewService = new ReviewServiceImpl();
