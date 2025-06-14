
export interface CareerRole {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  posted: string;
  isActive: boolean;
}

export interface CareerApplication {
  id: string;
  roleId: string;
  applicantName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
}

export interface RevenueModel {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricing: string;
  isPopular?: boolean;
}
