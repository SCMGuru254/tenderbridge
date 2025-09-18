export interface CompanyReview {
  id?: string;
  company_id: string;
  reviewer_id: string;
  rating: number;
  title: string;
  review_text: string;
  pros?: string;
  cons?: string;
  position?: string;
  employment_status: 'current' | 'former' | 'interview';
  employment_period?: string;
  location?: string;
  work_life_balance: number;
  salary_benefits: number;
  job_security: number;
  management: number;
  culture: number;
  career_growth: number;
  verified?: boolean;
  anonymous: boolean;
  helpful_votes?: number;
  reported_count?: number;
  review_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  created_at?: string;
  updated_at?: string;
}

export interface ReviewFormData {
  title: string;
  review_text: string;
  rating: number;
  pros?: string;
  cons?: string;
  position?: string;
  employment_status: 'current' | 'former' | 'interview';
  employment_period?: string;
  location?: string;
  work_life_balance: number;
  salary_benefits: number;
  job_security: number;
  management: number;
  culture: number;
  career_growth: number;
  anonymous: boolean;
}